import React, { useEffect, useRef, useState } from 'react';
import {
  Search,
  X,
  ArrowRight,
  CheckCircle2,
  History,
  ShoppingCart,
  HelpCircle,
} from 'lucide-react';
import { OrderRecord, Product } from '../types/marketplace';
import { findSimilarProducts } from '../data/marketplaceData';
import { ProductVisual } from './ProductVisual';

interface SearchBarProps {
  searchQuery: string;
  products: Product[];
  orders: OrderRecord[];
  variant?: 'hero' | 'header';
  onSearchSubmit: (query: string, compatibilityTag?: string) => void;
  onSelectProduct: (product: Product) => void;
  onBuyAgain?: (product: Product, variant: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  products,
  orders,
  variant = 'header',
  onSearchSubmit,
  onSelectProduct,
  onBuyAgain,
}) => {
  const [draftQuery, setDraftQuery] = useState(searchQuery);
  const [searchFocused, setSearchFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDraftQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const trimmedDraft = draftQuery.trim().toLowerCase();

  // Principle 6: Previously purchased items matched on minimal keywords (>= 1 char)
  const previousMatches = trimmedDraft
    ? (() => {
        const seen = new Set<string>();
        const results: { product: Product; variant: string; date: string }[] = [];
        for (const order of orders) {
          if (order.status === 'Cancelled') continue;
          for (const item of order.items) {
            if (seen.has(item.productId)) continue;
            const prod = products.find((p) => p.id === item.productId);
            if (!prod) continue;
            const haystack = `${prod.title} ${prod.categoryName} ${item.variant}`.toLowerCase();
            if (haystack.includes(trimmedDraft)) {
              seen.add(item.productId);
              results.push({ product: prod, variant: item.variant, date: order.createdAt });
            }
          }
        }
        return results.slice(0, 3);
      })()
    : [];

  const prevIds = new Set(previousMatches.map((m) => m.product.id));

  const liveMatches = trimmedDraft
    ? products
        .filter(
          (p) =>
            !prevIds.has(p.id) &&
            (p.title.toLowerCase().includes(trimmedDraft) ||
              p.categoryName.toLowerCase().includes(trimmedDraft) ||
              p.shopName.toLowerCase().includes(trimmedDraft) ||
              (p.compatibility ?? []).some((c) => c.toLowerCase().includes(trimmedDraft)))
        )
        .slice(0, 5)
    : [];

  // Principle 10: Push similar products when user cannot find the exact item
  const similarSuggestions =
    trimmedDraft && previousMatches.length === 0 && liveMatches.length === 0
      ? findSimilarProducts(trimmedDraft, products).slice(0, 4)
      : [];

  const detectedCompatibility = trimmedDraft
    ? Array.from(
        new Set(
          products
            .filter(
              (p) =>
                p.title.toLowerCase().includes(trimmedDraft) ||
                (p.compatibility ?? []).some((c) => c.toLowerCase().includes(trimmedDraft))
            )
            .flatMap((p) => p.compatibility ?? [])
        )
      ).slice(0, 4)
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchFocused(false);
    onSearchSubmit(draftQuery.trim());
  };

  const isHero = variant === 'hero';

  return (
    <div ref={containerRef} className="w-full relative">
      <form
        onSubmit={handleSubmit}
        className={`flex items-center bg-white rounded-[3px] p-[3px] transition-shadow ${
          isHero
            ? 'h-[50px] border-2 border-[#EE4D2D] shadow-sm'
            : 'h-[42px] shadow-xs'
        } ${searchFocused ? 'ring-2 ring-[#FFE97A]' : ''}`}
      >
        <Search className="w-4 h-4 text-[#757575] ml-3 shrink-0" />
        <input
          type="text"
          value={draftQuery}
          onFocus={() => setSearchFocused(true)}
          onChange={(e) => {
            setDraftQuery(e.target.value);
            setSearchFocused(true);
          }}
          placeholder="Search products, exact models (e.g. iPhone 17 case), or past purchases..."
          aria-label="Search marketplace products"
          className={`flex-1 h-full px-3 text-[#222222] placeholder:text-[#757575] focus:outline-none bg-transparent min-w-0 ${
            isHero ? 'text-[15px]' : 'text-[14px]'
          }`}
        />
        {draftQuery && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setDraftQuery('');
              setSearchFocused(true);
            }}
            className="p-1.5 text-[#757575] hover:text-[#222222] cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          type="submit"
          aria-label="Search"
          className={`${
            isHero ? 'h-[40px] px-6 text-[14px]' : 'h-[34px] px-4 text-[13px]'
          } bg-[#EE4D2D] hover:bg-[#D73211] transition-colors text-white rounded-[2px] flex items-center gap-1.5 font-semibold cursor-pointer shrink-0 whitespace-nowrap`}
        >
          <span>Search</span>
        </button>
      </form>

      {/* Instant Dropdown: Recognition (Previously Purchased) + Catalog Matches + Similar Fallbacks */}
      {searchFocused && trimmedDraft.length >= 1 && (
        <div
          className={`absolute left-0 right-0 ${
            isHero ? 'top-[54px]' : 'top-[46px]'
          } bg-white text-[#222222] border border-[#E0E0E0] rounded-[3px] z-50 overflow-hidden`}
          style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.14)' }}
        >
          {/* Previously Purchased (Principle 6: Minimal keyword recognition) */}
          {previousMatches.length > 0 && (
            <div className="border-b border-[#EBEBEB] bg-[#FFFDF9]">
              <div className="px-3.5 py-1.5 text-[11px] font-semibold text-[#0F766E] flex items-center gap-1.5 border-b border-[#F2EFEA]">
                <History className="w-3.5 h-3.5" />
                <span>Previously Purchased — Buy Again</span>
              </div>
              <div className="divide-y divide-[#F5F5F5]">
                {previousMatches.map(({ product, variant: prevVariant, date }) => (
                  <div
                    key={`prev-${product.id}`}
                    className="px-3.5 py-2 hover:bg-[#FFF5F1] transition-colors flex items-center justify-between gap-3"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setSearchFocused(false);
                        onSelectProduct(product);
                      }}
                      className="flex items-center gap-3 min-w-0 flex-1 text-left cursor-pointer"
                    >
                      <div className="w-9 h-9 border border-[#EBEBEB] rounded-[2px] overflow-hidden shrink-0">
                        <ProductVisual kind={product.visual} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[13px] font-medium text-[#222222] truncate">
                          {product.title}
                        </div>
                        <div className="text-[11px] text-[#757575] truncate">
                          Ordered {date} · Variant: {prevVariant}
                        </div>
                      </div>
                    </button>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-display font-bold text-[13px] text-[#EE4D2D] tabular-nums">
                        ${product.price.toFixed(2)}
                      </span>
                      {onBuyAgain && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchFocused(false);
                            onBuyAgain(product, prevVariant);
                          }}
                          className="h-[28px] px-2.5 bg-[#EE4D2D] hover:bg-[#D73211] text-white text-[11px] font-semibold rounded-[2px] inline-flex items-center gap-1 cursor-pointer"
                        >
                          <ShoppingCart className="w-3 h-3" />
                          <span>Buy Again</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compatibility Quick Chips */}
          {detectedCompatibility.length > 0 && (
            <div className="px-3.5 py-2 bg-[#FFFBF8] border-b border-[#F2E2DC] flex flex-wrap items-center gap-2 text-[12px]">
              <span className="text-[#555555] font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#EE4D2D]" />
                Refine exact fit:
              </span>
              {detectedCompatibility.map((compat) => (
                <button
                  key={compat}
                  type="button"
                  onClick={() => {
                    setSearchFocused(false);
                    onSearchSubmit(draftQuery.trim(), compat);
                  }}
                  className="px-2 py-0.5 bg-white border border-[#EE4D2D] text-[#EE4D2D] hover:bg-[#EE4D2D] hover:text-white rounded-[2px] font-medium transition-colors cursor-pointer"
                >
                  {compat}
                </button>
              ))}
            </div>
          )}

          {/* Exact Matches */}
          {liveMatches.length > 0 && (
            <div className="divide-y divide-[#F5F5F5]">
              {liveMatches.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => {
                    setSearchFocused(false);
                    onSelectProduct(product);
                  }}
                  className="w-full px-3.5 py-2.5 hover:bg-[#FFF5F1] transition-colors flex items-center gap-3 text-left cursor-pointer"
                >
                  <div className="w-10 h-10 border border-[#EBEBEB] rounded-[2px] overflow-hidden shrink-0">
                    <ProductVisual kind={product.visual} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] text-[#222222] font-medium truncate">
                      {product.title}
                    </div>
                    <div className="text-[11px] text-[#757575] flex items-center gap-1.5 truncate">
                      <span>{product.categoryName}</span>
                      <span>·</span>
                      <span>{product.offerCondition}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-display font-bold text-[14px] text-[#EE4D2D] tabular-nums">
                      ${product.price.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-[#757575]">{product.deliveryEta}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Principle 10: Help & Similar Products when no exact match */}
          {similarSuggestions.length > 0 && (
            <div>
              <div className="px-3.5 py-2 bg-[#FFFBF8] border-b border-[#F2E2DC] text-[12px] text-[#555555] flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-[#EE4D2D] shrink-0" />
                <span>
                  No exact match for &ldquo;{draftQuery.trim()}&rdquo; — showing similar products you may need:
                </span>
              </div>
              <div className="divide-y divide-[#F5F5F5]">
                {similarSuggestions.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => {
                      setSearchFocused(false);
                      onSelectProduct(product);
                    }}
                    className="w-full px-3.5 py-2.5 hover:bg-[#FFF5F1] transition-colors flex items-center gap-3 text-left cursor-pointer"
                  >
                    <div className="w-9 h-9 border border-[#EBEBEB] rounded-[2px] overflow-hidden shrink-0">
                      <ProductVisual kind={product.visual} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] text-[#222222] font-medium truncate">
                        {product.title}
                      </div>
                      <div className="text-[11px] text-[#757575] truncate">
                        {product.categoryName} · {product.offerCondition}
                      </div>
                    </div>
                    <div className="font-display font-bold text-[14px] text-[#EE4D2D] tabular-nums shrink-0">
                      ${product.price.toFixed(2)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setSearchFocused(false);
              onSearchSubmit(draftQuery.trim());
            }}
            className="w-full px-3.5 py-2 bg-[#FAFAFA] hover:bg-[#FFF5F1] border-t border-[#EBEBEB] text-[12px] font-semibold text-[#EE4D2D] flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>
              {liveMatches.length === 0 && previousMatches.length === 0
                ? `Search catalog & view similar items for "${draftQuery.trim()}"`
                : `See all results for "${draftQuery.trim()}"`}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
