import React, { useEffect, useMemo, useState } from 'react';
import {
  Filter,
  Check,
  Star,
  X,
  ChevronLeft,
  Scale,
  CheckCircle2,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';
import { CartItem, Category, FilterState, Product, SortOption } from '../types/marketplace';
import { findSimilarProducts } from '../data/marketplaceData';
import { ProductCard } from '../components/ProductCard';

interface CatalogScreenProps {
  categories: Category[];
  products: Product[];
  cartItems: CartItem[];
  filters: FilterState;
  compareIds: string[];
  onUpdateFilters: (next: FilterState) => void;
  onClearFilters: () => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onRemoveProductFromCart: (product: Product) => void;
  onToggleCompare: (product: Product) => void;
  onOpenCompare: () => void;
  onBackHome: () => void;
}

interface FilterCheckboxProps {
  checked: boolean;
  label: string;
  count?: number;
  onChange: () => void;
}

const FilterCheckbox: React.FC<FilterCheckboxProps> = ({
  checked,
  label,
  count,
  onChange,
}) => (
  <button
    type="button"
    onClick={onChange}
    className="w-full flex items-center justify-between gap-2 py-1 text-left group cursor-pointer"
  >
    <span className="flex items-center gap-2 min-w-0">
      <span
        className={`w-[14px] h-[14px] rounded-[2px] border flex items-center justify-center shrink-0 transition-colors ${
          checked
            ? 'bg-[#EE4D2D] border-[#EE4D2D] text-white'
            : 'bg-white border-[#CCCCCC] group-hover:border-[#EE4D2D]'
        }`}
      >
        {checked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
      </span>
      <span
        className={`text-[13px] leading-[18px] truncate ${
          checked ? 'text-[#EE4D2D] font-medium' : 'text-[#222222] group-hover:text-[#EE4D2D]'
        }`}
      >
        {label}
      </span>
    </span>
    {count !== undefined && (
      <span className="text-[11px] text-[#757575] tabular-nums shrink-0">({count})</span>
    )}
  </button>
);

export const CatalogScreen: React.FC<CatalogScreenProps> = ({
  categories,
  products,
  cartItems,
  filters,
  compareIds,
  onUpdateFilters,
  onClearFilters,
  onSelectProduct,
  onQuickAdd,
  onRemoveProductFromCart,
  onToggleCompare,
  onOpenCompare,
  onBackHome,
}) => {
  const [draftMin, setDraftMin] = useState(filters.minPrice);
  const [draftMax, setDraftMax] = useState(filters.maxPrice);

  useEffect(() => {
    setDraftMin(filters.minPrice);
    setDraftMax(filters.maxPrice);
  }, [filters.minPrice, filters.maxPrice]);

  const getCartQty = (productId: string) =>
    cartItems
      .filter((ci) => ci.productId === productId)
      .reduce((sum, ci) => sum + ci.quantity, 0);

  const toggleCategory = (catId: string) => {
    const exists = filters.categoryIds.includes(catId);
    const nextIds = exists
      ? filters.categoryIds.filter((id) => id !== catId)
      : [...filters.categoryIds, catId];
    onUpdateFilters({ ...filters, categoryIds: nextIds });
  };

  const applyPriceFilter = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateFilters({ ...filters, minPrice: draftMin, maxPrice: draftMax });
  };

  const baseMatchedProducts = useMemo(() => {
    const q = filters.query.toLowerCase();
    return products.filter((p) => {
      if (
        q &&
        !p.title.toLowerCase().includes(q) &&
        !p.categoryName.toLowerCase().includes(q) &&
        !p.shopName.toLowerCase().includes(q) &&
        !(p.compatibility ?? []).some((c) => c.toLowerCase().includes(q))
      ) {
        return false;
      }
      if (filters.categoryIds.length > 0 && !filters.categoryIds.includes(p.categoryId)) {
        return false;
      }
      return true;
    });
  }, [products, filters.query, filters.categoryIds]);

  const availableCompatibilities = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of baseMatchedProducts) {
      for (const tag of p.compatibility ?? []) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries()).map(([tag, count]) => ({ tag, count }));
  }, [baseMatchedProducts]);

  const filteredProducts = useMemo(() => {
    const min = filters.minPrice ? parseFloat(filters.minPrice) : 0;
    const max = filters.maxPrice ? parseFloat(filters.maxPrice) : Infinity;

    const list = baseMatchedProducts.filter((p) => {
      if (filters.compatibilityTag) {
        const hasTag = (p.compatibility ?? []).some(
          (c) => c.toLowerCase() === filters.compatibilityTag.toLowerCase()
        );
        if (!hasTag) return false;
      }
      if (filters.mallOnly && !p.isMall) return false;
      if (filters.freeShippingOnly && !p.freeShipping) return false;
      if (filters.flashSaleOnly && !p.isFlashSale) return false;
      if (filters.cashbackOnly && !p.cashback) return false;
      if (p.price < min || p.price > max) return false;
      if (filters.minRating > 0 && p.rating < filters.minRating) return false;
      return true;
    });

    const sorted = [...list];
    switch (filters.sortBy) {
      case 'top_sales':
        sorted.sort((a, b) => b.soldCount - a.soldCount);
        break;
      case 'price_asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'latest':
        sorted.sort((a, b) => b.discountPercent - a.discountPercent);
        break;
      case 'relevance':
      default:
        break;
    }
    return sorted;
  }, [baseMatchedProducts, filters]);

  // Principle 9 & 10: Alternative & similar products pushed whenever 0 exact matches exist
  const alternativeProducts = useMemo(() => {
    if (filteredProducts.length > 0) return [];
    if (filters.query) {
      return findSimilarProducts(filters.query, products);
    }
    if (filters.categoryIds.length > 0) {
      const catId = filters.categoryIds[0];
      const inCat = products.filter((p) => p.categoryId === catId);
      if (inCat.length > 0) return inCat.slice(0, 5);
    }
    return [...products].sort((a, b) => b.soldCount - a.soldCount).slice(0, 5);
  }, [filteredProducts.length, filters.query, filters.categoryIds, products]);

  const sortButtons: { id: SortOption; label: string }[] = [
    { id: 'relevance', label: 'Relevance' },
    { id: 'latest', label: 'Best Discount' },
    { id: 'top_sales', label: 'Top Sales' },
    { id: 'price_asc', label: 'Price: Low to High' },
    { id: 'price_desc', label: 'Price: High to Low' },
  ];

  const hasActiveFilters =
    filters.query !== '' ||
    filters.categoryIds.length > 0 ||
    filters.compatibilityTag !== '' ||
    filters.mallOnly ||
    filters.freeShippingOnly ||
    filters.flashSaleOnly ||
    filters.cashbackOnly ||
    filters.minPrice !== '' ||
    filters.maxPrice !== '' ||
    filters.minRating > 0;

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-5 pb-16">
      {/* Breadcrumb Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 text-[13px] text-[#555555]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-1 text-[#05A] hover:text-[#EE4D2D] cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Shopee Home</span>
          </button>
          <span className="text-[#BDBDBD]">/</span>
          <span className="font-medium text-[#222222]">
            {filters.query
              ? `Search results for "${filters.query}"`
              : filters.flashSaleOnly
              ? 'Flash Deals Catalog'
              : filters.mallOnly
              ? 'Official Brand Stores'
              : filters.categoryIds.length === 1
              ? categories.find((c) => c.id === filters.categoryIds[0])?.name ?? 'Catalog'
              : 'All Marketplace Products'}
          </span>
        </div>

        <span className="text-[12px] text-[#757575] tabular-nums">
          Showing {filteredProducts.length} product{filteredProducts.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Left Filter Sidebar + Right Catalog Grid */}
      <div className="flex flex-col md:flex-row items-start gap-[16px]">
        <aside className="w-full md:w-[210px] shrink-0 bg-white border border-[#EBEBEB] rounded-[2px] p-3.5 space-y-5">
          <div className="flex items-center gap-1.5 text-[14px] font-bold text-[#222222] uppercase tracking-[0.02em] pb-2 border-b border-[#EBEBEB]">
            <Filter className="w-3.5 h-3.5 text-[#222222]" />
            <span>Refine Results</span>
          </div>

          {availableCompatibilities.length > 0 && (
            <div>
              <h3 className="text-[13px] font-semibold text-[#222222] mb-2">
                Exact Model / Fit
              </h3>
              <div className="space-y-1">
                {availableCompatibilities.map(({ tag, count }) => (
                  <FilterCheckbox
                    key={tag}
                    label={tag}
                    count={count}
                    checked={filters.compatibilityTag === tag}
                    onChange={() =>
                      onUpdateFilters({
                        ...filters,
                        compatibilityTag: filters.compatibilityTag === tag ? '' : tag,
                      })
                    }
                  />
                ))}
              </div>
            </div>
          )}

          <div className={availableCompatibilities.length > 0 ? 'pt-3 border-t border-[#EBEBEB]' : ''}>
            <h3 className="text-[13px] font-semibold text-[#222222] mb-2">By Category</h3>
            <div className="space-y-1 max-h-[240px] overflow-y-auto pr-1">
              {categories.map((cat) => {
                const count = products.filter((p) => p.categoryId === cat.id).length;
                if (count === 0) return null;
                return (
                  <FilterCheckbox
                    key={cat.id}
                    label={cat.name}
                    count={count}
                    checked={filters.categoryIds.includes(cat.id)}
                    onChange={() => toggleCategory(cat.id)}
                  />
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-[#EBEBEB]">
            <h3 className="text-[13px] font-semibold text-[#222222] mb-2">
              Store &amp; Offers
            </h3>
            <div className="space-y-1">
              <FilterCheckbox
                label="Official Brand Store"
                checked={filters.mallOnly}
                onChange={() => onUpdateFilters({ ...filters, mallOnly: !filters.mallOnly })}
              />
              <FilterCheckbox
                label="Free Shipping"
                checked={filters.freeShippingOnly}
                onChange={() =>
                  onUpdateFilters({ ...filters, freeShippingOnly: !filters.freeShippingOnly })
                }
              />
              <FilterCheckbox
                label="Flash Deals"
                checked={filters.flashSaleOnly}
                onChange={() =>
                  onUpdateFilters({ ...filters, flashSaleOnly: !filters.flashSaleOnly })
                }
              />
              <FilterCheckbox
                label="10% Cashback"
                checked={filters.cashbackOnly}
                onChange={() =>
                  onUpdateFilters({ ...filters, cashbackOnly: !filters.cashbackOnly })
                }
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#EBEBEB]">
            <h3 className="text-[13px] font-semibold text-[#222222] mb-2">Price Range</h3>
            <form onSubmit={applyPriceFilter} className="space-y-2">
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={0}
                  placeholder="$ MIN"
                  value={draftMin}
                  onChange={(e) => setDraftMin(e.target.value)}
                  className="w-full h-[30px] px-2 text-[12px] border border-[#CCCCCC] rounded-[2px] focus:outline-none focus:border-[#EE4D2D] tabular-nums"
                />
                <span className="text-[#757575] text-[12px]">—</span>
                <input
                  type="number"
                  min={0}
                  placeholder="$ MAX"
                  value={draftMax}
                  onChange={(e) => setDraftMax(e.target.value)}
                  className="w-full h-[30px] px-2 text-[12px] border border-[#CCCCCC] rounded-[2px] focus:outline-none focus:border-[#EE4D2D] tabular-nums"
                />
              </div>
              <button
                type="submit"
                className="w-full h-[30px] bg-[#EE4D2D] hover:bg-[#D73211] text-white text-[12px] font-semibold uppercase rounded-[2px] transition-colors cursor-pointer"
              >
                Apply
              </button>
            </form>
          </div>

          <div className="pt-3 border-t border-[#EBEBEB]">
            <h3 className="text-[13px] font-semibold text-[#222222] mb-2">Rating</h3>
            <div className="space-y-1.5">
              {[5, 4.8, 4.5].map((ratingVal) => {
                const active = filters.minRating === ratingVal;
                return (
                  <button
                    key={ratingVal}
                    type="button"
                    onClick={() =>
                      onUpdateFilters({
                        ...filters,
                        minRating: active ? 0 : ratingVal,
                      })
                    }
                    className={`w-full flex items-center gap-1.5 px-2 py-1 rounded-[2px] text-[12px] cursor-pointer transition-colors ${
                      active
                        ? 'bg-[#FFF5F1] text-[#EE4D2D] font-semibold border border-[#EE4D2D]'
                        : 'text-[#222222] hover:bg-[#F5F5F5]'
                    }`}
                  >
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((starIdx) => (
                        <Star
                          key={starIdx}
                          className={`w-3 h-3 ${
                            starIdx <= Math.floor(ratingVal)
                              ? 'fill-[#FFCE3D] text-[#FFCE3D]'
                              : 'fill-[#E0E0E0] text-[#E0E0E0]'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="tabular-nums">{ratingVal === 5 ? '5.0' : `${ratingVal} & Up`}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-[#EBEBEB]">
            <button
              type="button"
              onClick={() => {
                setDraftMin('');
                setDraftMax('');
                onClearFilters();
              }}
              className="w-full h-[32px] bg-[#EE4D2D] hover:bg-[#D73211] text-white text-[12px] font-semibold uppercase rounded-[2px] transition-colors cursor-pointer"
            >
              Clear All
            </button>
          </div>
        </aside>

        <div className="flex-1 min-w-0 w-full space-y-3">
          {availableCompatibilities.length > 0 && (
            <div className="bg-[#FFFBF8] border border-[#F2DDD6] rounded-[2px] px-4 py-3 flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#222222] mr-1">
                <CheckCircle2 className="w-4 h-4 text-[#EE4D2D]" />
                <span>Verify exact device / compatibility fit:</span>
              </div>
              {availableCompatibilities.map(({ tag, count }) => {
                const active = filters.compatibilityTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() =>
                      onUpdateFilters({
                        ...filters,
                        compatibilityTag: active ? '' : tag,
                      })
                    }
                    className={`h-[28px] px-2.5 rounded-[2px] text-[12px] font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                      active
                        ? 'bg-[#EE4D2D] border-[#EE4D2D] text-white'
                        : 'bg-white border-[#DCDCDC] text-[#222222] hover:border-[#EE4D2D] hover:text-[#EE4D2D]'
                    }`}
                  >
                    {tag} ({count})
                  </button>
                );
              })}
            </div>
          )}

          <div className="bg-[#EDEDED] border border-[#E2E2E2] rounded-[2px] px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[13px] text-[#555555] mr-1">Sort by</span>
              {sortButtons.map((btn) => {
                const active = filters.sortBy === btn.id;
                return (
                  <button
                    key={btn.id}
                    type="button"
                    onClick={() => onUpdateFilters({ ...filters, sortBy: btn.id })}
                    className={`h-[34px] px-3.5 text-[13px] rounded-[2px] transition-colors cursor-pointer whitespace-nowrap ${
                      active
                        ? 'bg-[#EE4D2D] text-white font-medium'
                        : 'bg-white text-[#222222] hover:bg-[#FFF5F1] border border-[#E0E0E0]'
                    }`}
                  >
                    {btn.label}
                  </button>
                );
              })}
            </div>

            {compareIds.length > 0 && (
              <button
                type="button"
                onClick={onOpenCompare}
                className="h-[34px] px-3 bg-[#222222] hover:bg-[#3B3B3B] text-white text-[12px] font-semibold rounded-[2px] inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5 text-[#FFE97A]" />
                <span>Compare ({compareIds.length})</span>
              </button>
            )}
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 text-[12px]">
              {filters.query && (
                <button
                  type="button"
                  onClick={() => onUpdateFilters({ ...filters, query: '' })}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#EE4D2D] text-[#EE4D2D] rounded-[2px] cursor-pointer"
                >
                  <span>Search: {filters.query}</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              {filters.compatibilityTag && (
                <button
                  type="button"
                  onClick={() => onUpdateFilters({ ...filters, compatibilityTag: '' })}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FFF5F1] border border-[#EE4D2D] text-[#EE4D2D] font-semibold rounded-[2px] cursor-pointer"
                >
                  <span>Exact Fit: {filters.compatibilityTag}</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              {filters.categoryIds.map((catId) => {
                const catName = categories.find((c) => c.id === catId)?.name ?? catId;
                return (
                  <button
                    key={catId}
                    type="button"
                    onClick={() => toggleCategory(catId)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#EE4D2D] text-[#EE4D2D] rounded-[2px] cursor-pointer"
                  >
                    <span>{catName}</span>
                    <X className="w-3 h-3" />
                  </button>
                );
              })}
              {filters.mallOnly && (
                <button
                  type="button"
                  onClick={() => onUpdateFilters({ ...filters, mallOnly: false })}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#D0011B] text-[#D0011B] rounded-[2px] cursor-pointer"
                >
                  <span>Official Brand Store</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              {filters.flashSaleOnly && (
                <button
                  type="button"
                  onClick={() => onUpdateFilters({ ...filters, flashSaleOnly: false })}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#EE4D2D] text-[#EE4D2D] rounded-[2px] cursor-pointer"
                >
                  <span>Flash Deals</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              {filters.freeShippingOnly && (
                <button
                  type="button"
                  onClick={() => onUpdateFilters({ ...filters, freeShippingOnly: false })}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#EE4D2D] text-[#EE4D2D] rounded-[2px] cursor-pointer"
                >
                  <span>Free Shipping</span>
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* Principle 9 & 10: Error Diagnosis + Recovery + Similar/Alternative Products */}
          {filteredProducts.length === 0 ? (
            <div className="space-y-4">
              <div className="bg-white border border-[#EBEBEB] rounded-[2px] p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#EE4D2D] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h2 className="font-display text-[17px] font-bold text-[#222222]">
                      {filters.query
                        ? `We couldn’t find an exact match for "${filters.query}"`
                        : 'No products match all selected filters'}
                    </h2>
                    <p className="text-[13px] text-[#555555] mt-1">
                      {filters.minPrice || filters.maxPrice
                        ? `Your price range (${filters.minPrice || '$0'} – ${filters.maxPrice || 'Any'}) or filter settings may be too narrow.`
                        : 'Try removing a restrictive filter or explore the similar alternatives suggested below.'}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {(filters.minPrice || filters.maxPrice) && (
                        <button
                          type="button"
                          onClick={() => {
                            setDraftMin('');
                            setDraftMax('');
                            onUpdateFilters({ ...filters, minPrice: '', maxPrice: '' });
                          }}
                          className="h-[32px] px-3.5 bg-[#FFF5F1] border border-[#EE4D2D] text-[#EE4D2D] text-[12px] font-semibold rounded-[2px] cursor-pointer"
                        >
                          Clear Price Range
                        </button>
                      )}
                      {filters.compatibilityTag && (
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateFilters({ ...filters, compatibilityTag: '' })
                          }
                          className="h-[32px] px-3.5 bg-[#FFF5F1] border border-[#EE4D2D] text-[#EE4D2D] text-[12px] font-semibold rounded-[2px] cursor-pointer"
                        >
                          Clear Model Fit ({filters.compatibilityTag})
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setDraftMin('');
                          setDraftMax('');
                          onClearFilters();
                        }}
                        className="h-[32px] px-4 bg-[#EE4D2D] hover:bg-[#D73211] text-white text-[12px] font-semibold rounded-[2px] cursor-pointer"
                      >
                        Reset All Filters
                      </button>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#F2F2F2] flex items-start gap-2 text-[12px] text-[#555555]">
                      <HelpCircle className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
                      <span>
                        Search tip: Try broader keywords like &ldquo;phone case&rdquo;, &ldquo;audio&rdquo;, or &ldquo;coffee&rdquo;, or pick a category from the top navigation bar.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Suggested Similar / Alternative Items */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="font-display text-[15px] font-bold text-[#222222]">
                    {filters.query
                      ? `Similar Products for "${filters.query}"`
                      : 'Recommended Alternative Products'}
                  </h3>
                  <span className="text-[12px] text-[#757575]">
                    {alternativeProducts.length} suggested alternatives
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-[10px]">
                  {alternativeProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelect={onSelectProduct}
                      onQuickAdd={onQuickAdd}
                      cartQty={getCartQty(product.id)}
                      onRemoveFromCart={onRemoveProductFromCart}
                      isCompared={compareIds.includes(product.id)}
                      onToggleCompare={onToggleCompare}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-[10px]">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                  onQuickAdd={onQuickAdd}
                  cartQty={getCartQty(product.id)}
                  onRemoveFromCart={onRemoveProductFromCart}
                  isCompared={compareIds.includes(product.id)}
                  onToggleCompare={onToggleCompare}
                  activeCompatibility={filters.compatibilityTag || undefined}
                  flashSaleMode={filters.flashSaleOnly}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
