import React, { useState } from 'react';
import {
  ShoppingBag,
  ShoppingCart,
  ClipboardList,
  Scale,
} from 'lucide-react';
import { CartItem, Category, OrderRecord, Product, ScreenView } from '../types/marketplace';
import { ProductVisual } from './ProductVisual';
import { SearchBar } from './SearchBar';

interface HeaderProps {
  currentScreen: ScreenView;
  onNavigate: (screen: ScreenView) => void;
  searchQuery: string;
  activeCategoryIds: string[];
  categories: Category[];
  onSearchSubmit: (query: string, compatibilityTag?: string) => void;
  onSelectCategory: (categoryId: string) => void;
  onQuickFilter: (type: 'mall' | 'flash' | 'freeShipping' | 'all') => void;
  cartItems: CartItem[];
  products: Product[];
  orders: OrderRecord[];
  onSelectProduct: (product: Product) => void;
  onBuyAgain: (product: Product, variant: string) => void;
  ordersCount: number;
  compareCount: number;
  onOpenCompare: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  searchQuery,
  activeCategoryIds,
  categories,
  onSearchSubmit,
  onSelectCategory,
  onQuickFilter,
  cartItems,
  products,
  orders,
  onSelectProduct,
  onBuyAgain,
  ordersCount,
  compareCount,
  onOpenCompare,
}) => {
  const [cartPreviewOpen, setCartPreviewOpen] = useState(false);
  const totalCartUnits = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header
      className="sticky top-0 z-40 w-full text-white"
      style={{
        background: 'linear-gradient(180deg, #F53D2D 0%, #EE4D2D 100%)',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
      }}
    >
      {/* Clean Top Bar: Brand + Search (on non-home views; central search sits on Home) + Key Actions */}
      <div className="max-w-[1200px] mx-auto px-4 py-2.5">
        <div className="flex items-center justify-between gap-4 sm:gap-6">
          {/* Brand Wordmark */}
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 shrink-0 cursor-pointer group focus-visible:outline-none whitespace-nowrap"
          >
            <div className="w-9 h-9 rounded-[4px] bg-white text-[#EE4D2D] flex items-center justify-center shadow-xs group-hover:scale-[1.02] transition-transform">
              <ShoppingBag className="w-5 h-5 stroke-[2.25]" />
            </div>
            <span className="font-display text-[24px] sm:text-[26px] font-bold tracking-[-0.02em] leading-none text-white">
              Shopee
            </span>
          </button>

          {/* Search bar in header on inner pages; on Home, Search Bar is central on the page */}
          {currentScreen !== 'home' ? (
            <div className="flex-1 max-w-[660px]">
              <SearchBar
                searchQuery={searchQuery}
                products={products}
                orders={orders}
                variant="header"
                onSearchSubmit={onSearchSubmit}
                onSelectProduct={onSelectProduct}
                onBuyAgain={onBuyAgain}
              />
            </div>
          ) : (
            <div className="flex-1 hidden md:block" />
          )}

          {/* Prioritized Key Shopping Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenCompare}
              className="h-[38px] px-2.5 sm:px-3 bg-white/12 hover:bg-white/20 rounded-[2px] inline-flex items-center gap-1.5 text-[12px] font-medium text-white transition-colors cursor-pointer whitespace-nowrap"
              title="Compare shortlisted items"
            >
              <Scale className="w-4 h-4 shrink-0" />
              <span className="hidden lg:inline">Compare</span>
              <span className="tabular-nums font-bold">({compareCount})</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('orders')}
              className={`h-[38px] px-2.5 sm:px-3 rounded-[2px] inline-flex items-center gap-1.5 text-[12px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                currentScreen === 'orders'
                  ? 'bg-white text-[#EE4D2D] font-semibold'
                  : 'bg-white/12 hover:bg-white/20 text-white'
              }`}
            >
              <ClipboardList className="w-4 h-4 shrink-0" />
              <span className="hidden md:inline">Orders</span>
              <span className="tabular-nums font-bold">({ordersCount})</span>
            </button>

            {/* Cart Button & Hover Flyout */}
            <div
              className="relative"
              onMouseEnter={() => setCartPreviewOpen(true)}
              onMouseLeave={() => setCartPreviewOpen(false)}
            >
              <button
                type="button"
                onClick={() => onNavigate('cart')}
                aria-label={`Shopping cart with ${totalCartUnits} items`}
                className="relative h-[38px] px-3 rounded-[2px] inline-flex items-center gap-1.5 text-[13px] font-semibold transition-colors cursor-pointer whitespace-nowrap bg-white text-[#EE4D2D] hover:bg-[#FFF5F1]"
              >
                <ShoppingCart className="w-4 h-4 stroke-[2.2]" />
                <span className="hidden sm:inline">Cart</span>
                <span className="tabular-nums">({totalCartUnits})</span>
              </button>

              {cartPreviewOpen && (
                <div
                  className="hidden lg:block absolute right-0 top-full mt-1 w-[380px] bg-white text-[#222222] rounded-[2px] border border-[#E0E0E0] z-50"
                  style={{ boxShadow: '0 6px 20px rgba(0, 0, 0, 0.14)' }}
                >
                  <div className="px-3.5 py-2.5 border-b border-[#EBEBEB] text-[13px] font-medium text-[#555555]">
                    Shopping Cart ({totalCartUnits} items)
                  </div>
                  {cartItems.length === 0 ? (
                    <div className="py-10 px-4 text-center text-[13px] text-[#757575]">
                      Your shopping cart is empty.
                    </div>
                  ) : (
                    <div className="max-h-[260px] overflow-y-auto divide-y divide-[#F5F5F5]">
                      {cartItems.slice(0, 5).map((item) => {
                        const product = products.find((p) => p.id === item.productId);
                        if (!product) return null;
                        return (
                          <button
                            key={`${item.productId}-${item.variant}`}
                            type="button"
                            onClick={() => {
                              setCartPreviewOpen(false);
                              onSelectProduct(product);
                            }}
                            className="w-full flex items-center gap-3 px-3.5 py-2.5 hover:bg-[#FAFAFA] transition-colors text-left cursor-pointer"
                          >
                            <div className="w-11 h-11 rounded-[2px] border border-[#EBEBEB] overflow-hidden shrink-0">
                              <ProductVisual kind={product.visual} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-[12px] text-[#222222] truncate font-medium">
                                {product.title}
                              </div>
                              <div className="text-[11px] text-[#757575] mt-0.5 truncate">
                                {item.variant} · Qty {item.quantity}
                              </div>
                            </div>
                            <div className="font-display font-bold text-[14px] text-[#EE4D2D] tabular-nums shrink-0">
                              ${(product.price * item.quantity).toFixed(2)}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                  <div className="px-3.5 py-2.5 bg-[#FAFAFA] border-t border-[#EBEBEB] flex items-center justify-between">
                    <span className="text-[11px] text-[#757575]">
                      Vouchers applied in cart
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setCartPreviewOpen(false);
                        onNavigate('cart');
                      }}
                      className="h-[34px] px-4 bg-[#EE4D2D] hover:bg-[#D73211] text-white text-[13px] font-semibold rounded-[2px] transition-colors cursor-pointer"
                    >
                      Open Cart
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Persistent Category Navigation Strip */}
      <nav
        aria-label="Persistent category navigation"
        className="bg-white text-[#222222] border-t border-b border-[#EBEBEB]"
      >
        <div className="max-w-[1200px] mx-auto px-4 flex items-center gap-1 overflow-x-auto no-scrollbar h-[38px]">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className={`px-2.5 h-full text-[12px] font-medium whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${
              currentScreen === 'home'
                ? 'border-[#EE4D2D] text-[#EE4D2D] font-semibold'
                : 'border-transparent text-[#555555] hover:text-[#EE4D2D]'
            }`}
          >
            Home
          </button>

          <button
            type="button"
            onClick={() => onQuickFilter('all')}
            className={`px-2.5 h-full text-[12px] font-medium whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${
              currentScreen === 'catalog' && activeCategoryIds.length === 0
                ? 'border-[#EE4D2D] text-[#EE4D2D] font-semibold'
                : 'border-transparent text-[#555555] hover:text-[#EE4D2D]'
            }`}
          >
            All Categories
          </button>

          <span className="text-[#E0E0E0] px-0.5 shrink-0">|</span>

          {categories.slice(0, 10).map((cat) => {
            const isActive =
              currentScreen === 'catalog' && activeCategoryIds.includes(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`px-2.5 h-full text-[12px] whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${
                  isActive
                    ? 'border-[#EE4D2D] text-[#EE4D2D] font-semibold'
                    : 'border-transparent text-[#444444] hover:text-[#EE4D2D]'
                }`}
              >
                {cat.name}
              </button>
            );
          })}

          <span className="text-[#E0E0E0] px-0.5 shrink-0">|</span>

          <button
            type="button"
            onClick={() => onQuickFilter('flash')}
            className="px-2.5 h-full text-[12px] font-semibold text-[#EE4D2D] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
          >
            Flash Deals
          </button>

          <button
            type="button"
            onClick={() => onQuickFilter('mall')}
            className="px-2.5 h-full text-[12px] font-semibold text-[#D0011B] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
          >
            Official Brand Store
          </button>
        </div>
      </nav>
    </header>
  );
};
