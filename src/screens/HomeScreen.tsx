import React, { useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Zap,
  Ticket,
  Check,
  Scale,
  ArrowRight,
  Repeat,
  Clock,
  ShoppingCart,
  Trash2,
} from 'lucide-react';
import {
  CartItem,
  OrderRecord,
  Product,
  RecurringCadence,
  ShoppingIntent,
  Voucher,
} from '../types/marketplace';
import { ProductCard } from '../components/ProductCard';
import { ProductVisual } from '../components/ProductVisual';
import { SearchBar } from '../components/SearchBar';

interface HomeScreenProps {
  products: Product[];
  vouchers: Voucher[];
  claimedVoucherIds: string[];
  cartItems: CartItem[];
  orders: OrderRecord[];
  shoppingIntent: ShoppingIntent;
  compareIds: string[];
  onChangeIntent: (intent: ShoppingIntent) => void;
  onClaimVoucher: (voucherId: string) => void;
  onSearchSubmit: (query: string, compatibilityTag?: string) => void;
  onSelectCategory: (categoryId: string) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product, recurring?: RecurringCadence) => void;
  onRemoveProductFromCart: (product: Product) => void;
  onBuyAgain: (product: Product, variant: string, recurring?: RecurringCadence) => void;
  onToggleCompare: (product: Product) => void;
  onQuickFilter: (type: 'mall' | 'flash' | 'freeShipping' | 'all') => void;
}

const INTENT_OPTIONS: {
  id: ShoppingIntent;
  label: string;
}[] = [
  { id: 'all', label: 'For You' },
  { id: 'tech', label: 'Tech & Phone Gear' },
  { id: 'essentials', label: 'Daily Essentials' },
  { id: 'kitchen', label: 'Home Barista' },
  { id: 'active', label: 'Travel & Active' },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  products,
  vouchers,
  claimedVoucherIds,
  cartItems,
  orders,
  shoppingIntent,
  compareIds,
  onChangeIntent,
  onClaimVoucher,
  onSearchSubmit,
  onSelectCategory,
  onSelectProduct,
  onQuickAdd,
  onRemoveProductFromCart,
  onBuyAgain,
  onToggleCompare,
  onQuickFilter,
}) => {
  const [flashOffset, setFlashOffset] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(2 * 3600 + 18 * 60 + 44);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 3 * 3600));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const hours = String(Math.floor(secondsRemaining / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((secondsRemaining % 3600) / 60)).padStart(2, '0');
  const seconds = String(secondsRemaining % 60).padStart(2, '0');

  // Definitive 3-hour Flash Deals window timeline progress
  const totalWindowSeconds = 3 * 3600;
  const elapsedPercent = Math.min(
    100,
    Math.max(5, Math.round(((totalWindowSeconds - secondsRemaining) / totalWindowSeconds) * 100))
  );

  const getCartQty = (productId: string) =>
    cartItems
      .filter((ci) => ci.productId === productId)
      .reduce((sum, ci) => sum + ci.quantity, 0);

  const activeIntentConfig =
    INTENT_OPTIONS.find((opt) => opt.id === shoppingIntent) ?? INTENT_OPTIONS[0];

  const intentProducts =
    shoppingIntent === 'all'
      ? products
      : products.filter((p) => p.intentTags.includes(shoppingIntent));

  // Principle 7: Most frequently purchased items under "For You"
  const orderCountsByProduct = new Map<string, number>();
  for (const order of orders) {
    if (order.status === 'Cancelled') continue;
    for (const item of order.items) {
      orderCountsByProduct.set(
        item.productId,
        (orderCountsByProduct.get(item.productId) ?? 0) + item.quantity
      );
    }
  }

  const frequentlyPurchasedProducts = [...products]
    .map((p) => ({
      product: p,
      score: (p.frequentlyPurchasedCount ?? 0) + (orderCountsByProduct.get(p.id) ?? 0) * 2,
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((x) => x.product);

  const flashSaleProducts = products.filter((p) => p.isFlashSale);
  const visibleFlashCount = 6;
  const maxFlashOffset = Math.max(0, flashSaleProducts.length - visibleFlashCount);
  const visibleFlashProducts = flashSaleProducts.slice(
    flashOffset,
    flashOffset + visibleFlashCount
  );

  return (
    <div className="w-full pb-14">
      {/* Principle 8: Minimalist, Central Search Focal Point — Zero Banner or Popular-Search Clutter */}
      <section className="bg-white border-b border-[#EBEBEB] py-7">
        <div className="max-w-[920px] mx-auto px-4 text-center space-y-4">
          <h1
            className="font-display text-[26px] sm:text-[32px] font-bold leading-[1.18] tracking-[-0.02em] text-[#222222]"
            style={{ textWrap: 'balance' }}
          >
            What are you shopping for today?
          </h1>

          {/* Central Prominent Search Bar */}
          <div className="max-w-[740px] mx-auto text-left">
            <SearchBar
              searchQuery=""
              products={products}
              orders={orders}
              variant="hero"
              onSearchSubmit={onSearchSubmit}
              onSelectProduct={onSelectProduct}
              onBuyAgain={(prod, variant) => onBuyAgain(prod, variant)}
            />
          </div>

          {/* Clean Shopping Intent Switcher */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {INTENT_OPTIONS.map((opt) => {
              const active = shoppingIntent === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    onChangeIntent(opt.id);
                    setFlashOffset(0);
                  }}
                  className={`h-[32px] px-3.5 rounded-[2px] text-[12px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-[#EE4D2D] text-white font-semibold'
                      : 'bg-[#F5F5F5] text-[#444444] hover:bg-[#FFF5F1] hover:text-[#EE4D2D]'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => onQuickFilter('all')}
              className="h-[32px] px-3.5 rounded-[2px] text-[12px] font-medium border border-[#DCDCDC] text-[#222222] hover:border-[#EE4D2D] hover:text-[#EE4D2D] inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Browse All ({products.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-4 space-y-5 mt-5">
        {/* Principle 7: Most Frequently Purchased & Recurring Groceries/Essentials under "For You" */}
        {shoppingIntent === 'all' && frequentlyPurchasedProducts.length > 0 && (
          <section className="bg-white border border-[#EBEBEB] rounded-[2px] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div>
                <h2 className="font-display text-[16px] font-bold text-[#222222]">
                  Frequently Purchased &amp; Recurring Essentials
                </h2>
                <p className="text-[12px] text-[#757575]">
                  Quickly reorder everyday staples or set a monthly recurring checkout for groceries &amp; skincare.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectCategory('groceries')}
                className="text-[12px] font-medium text-[#EE4D2D] hover:underline inline-flex items-center gap-0.5 cursor-pointer"
              >
                <span>Browse Groceries &amp; Pantry</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {frequentlyPurchasedProducts.map((item) => {
                const qty = getCartQty(item.id);
                const isCompared = compareIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className="border border-[#EBEBEB] hover:border-[#EE4D2D] rounded-[2px] p-3 flex flex-col justify-between gap-2.5 bg-[#FFFEFD] transition-colors"
                  >
                    <div
                      onClick={() => onSelectProduct(item)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelectProduct(item);
                        }
                      }}
                      className="flex items-start gap-3 cursor-pointer group"
                    >
                      <div className="w-16 h-16 rounded-[2px] border border-[#EBEBEB] overflow-hidden shrink-0 bg-[#FAFAFA]">
                        <ProductVisual kind={item.visual} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[12px] font-medium text-[#222222] group-hover:text-[#EE4D2D] line-clamp-2 leading-[16px]">
                          {item.title}
                        </div>
                        <div className="mt-1 flex items-baseline gap-1.5">
                          <span className="font-display text-[17px] font-extrabold text-[#EE4D2D] tabular-nums">
                            ${item.price.toFixed(2)}
                          </span>
                          <span className="text-[11px] text-[#757575] tabular-nums">
                            · {item.stock} left
                          </span>
                        </div>
                        <div className="text-[10px] text-[#B93815] font-medium truncate mt-0.5">
                          {item.offerCondition}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 pt-2 border-t border-[#F4F4F4]">
                      {qty > 0 ? (
                        <button
                          type="button"
                          onClick={() => onRemoveProductFromCart(item)}
                          className="flex-1 h-[30px] bg-[#222222] hover:bg-[#D0011B] text-white text-[11px] font-semibold rounded-[2px] inline-flex items-center justify-center gap-1 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove ({qty})</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onQuickAdd(item, 'none')}
                          className="flex-1 h-[30px] bg-[#EE4D2D] hover:bg-[#D73211] text-white text-[11px] font-semibold rounded-[2px] inline-flex items-center justify-center gap-1 cursor-pointer transition-colors"
                        >
                          <ShoppingCart className="w-3 h-3" />
                          <span>Buy Once</span>
                        </button>
                      )}

                      {item.supportsRecurring && (
                        <button
                          type="button"
                          onClick={() => onQuickAdd(item, 'monthly')}
                          className="h-[30px] px-2.5 bg-[#FFF5F1] hover:bg-[#FFE3D9] border border-[#EE4D2D] text-[#EE4D2D] text-[11px] font-semibold rounded-[2px] inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
                          title="Add with monthly recurring checkout"
                        >
                          <Repeat className="w-3 h-3" />
                          <span>Monthly</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onToggleCompare(item)}
                        aria-label={`Compare ${item.title}`}
                        className={`h-[30px] px-2 border rounded-[2px] text-[11px] inline-flex items-center justify-center cursor-pointer ${
                          isCompared
                            ? 'bg-[#222222] border-[#222222] text-white'
                            : 'bg-white border-[#DCDCDC] text-[#555555] hover:border-[#EE4D2D]'
                        }`}
                      >
                        <Scale className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* FLASH DEALS WITH DEFINITIVE SESSION TIMELINE & ABSOLUTE NUMBERS */}
        <section className="bg-white border border-[#EBEBEB] rounded-[2px] relative">
          <div className="px-5 py-3.5 border-b border-[#EBEBEB] space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 text-[#EE4D2D]">
                  <Zap className="w-5 h-5 fill-[#EE4D2D]" />
                  <h2 className="font-display text-[19px] font-extrabold tracking-[-0.02em] uppercase">
                    Flash Deals
                  </h2>
                </div>

                {/* Definitive Active Session Window & Countdown */}
                <div className="flex items-center gap-2 text-[12px]">
                  <span className="inline-flex items-center gap-1 font-semibold text-[#222222]">
                    <Clock className="w-3.5 h-3.5 text-[#EE4D2D]" />
                    <span>00:00 – 03:00 Window</span>
                  </span>
                  <span className="text-[#757575]">· Ends in</span>
                  <div className="flex items-center gap-1" aria-label="Flash sale countdown timer">
                    <span className="bg-[#000000] text-white font-display text-[13px] font-bold leading-[16px] px-1.5 py-0.5 rounded-[2px] tabular-nums">
                      {hours}
                    </span>
                    <span className="text-[#222222] font-bold text-[12px]">:</span>
                    <span className="bg-[#000000] text-white font-display text-[13px] font-bold leading-[16px] px-1.5 py-0.5 rounded-[2px] tabular-nums">
                      {minutes}
                    </span>
                    <span className="text-[#222222] font-bold text-[12px]">:</span>
                    <span className="bg-[#000000] text-white font-display text-[13px] font-bold leading-[16px] px-1.5 py-0.5 rounded-[2px] tabular-nums">
                      {seconds}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onQuickFilter('flash')}
                className="text-[13px] font-medium text-[#EE4D2D] hover:underline inline-flex items-center gap-0.5 cursor-pointer"
              >
                <span>Compare All Flash Deals</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Definitive Session Timeline Bar */}
            <div className="flex items-center gap-3 text-[11px] text-[#555555]">
              <span className="font-medium text-[#222222] shrink-0">00:00 Start</span>
              <div className="flex-1 h-[6px] bg-[#F1F1F1] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#EE4D2D] rounded-full transition-all"
                  style={{ width: `${elapsedPercent}%` }}
                />
              </div>
              <span className="shrink-0 tabular-nums">
                03:00 End · Next session 03:00 – 06:00
              </span>
            </div>
          </div>

          <div className="relative p-3">
            {flashOffset > 0 && (
              <button
                type="button"
                aria-label="Previous flash sale items"
                onClick={() => setFlashOffset((prev) => Math.max(0, prev - 1))}
                className="hidden md:flex absolute -left-3.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border border-[#EBEBEB] shadow-md items-center justify-center text-[#555555] hover:text-[#EE4D2D] hover:scale-110 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            {flashOffset < maxFlashOffset && (
              <button
                type="button"
                aria-label="Next flash sale items"
                onClick={() => setFlashOffset((prev) => Math.min(maxFlashOffset, prev + 1))}
                className="hidden md:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border border-[#EBEBEB] shadow-md items-center justify-center text-[#555555] hover:text-[#EE4D2D] hover:scale-110 transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-[10px]">
              {visibleFlashProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                  onQuickAdd={onQuickAdd}
                  cartQty={getCartQty(product.id)}
                  onRemoveFromCart={onRemoveProductFromCart}
                  isCompared={compareIds.includes(product.id)}
                  onToggleCompare={onToggleCompare}
                  flashSaleMode
                />
              ))}
            </div>
          </div>
        </section>

        {/* VOUCHERS STRIP — Principle 2: "Applied in Cart" wording */}
        <section id="voucher-strip" className="bg-white border border-[#EBEBEB] rounded-[2px] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-[#EE4D2D]" />
              <h2 className="font-display text-[15px] font-semibold text-[#222222] uppercase tracking-[0.01em]">
                Eligible Vouchers — Applied in Cart
              </h2>
            </div>
            <span className="text-[12px] text-[#757575] tabular-nums">
              {claimedVoucherIds.length} of {vouchers.length} claimed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {vouchers.map((voucher) => {
              const isClaimed = claimedVoucherIds.includes(voucher.id);
              return (
                <div
                  key={voucher.id}
                  className="voucher-ticket border border-[#F3D2C9] rounded-[2px] flex items-stretch overflow-hidden"
                >
                  <div className="w-[90px] shrink-0 bg-[#FFF5F1] border-r border-dashed border-[#EE4D2D]/40 p-2 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-bold text-[#EE4D2D] uppercase leading-tight">
                      {voucher.badge}
                    </span>
                    <span className="mt-1 font-mono text-[10px] text-[#757575] font-semibold">
                      {voucher.code}
                    </span>
                  </div>

                  <div className="flex-1 p-2.5 pl-3 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-display text-[16px] font-bold text-[#EE4D2D] leading-tight">
                        {voucher.title}
                      </div>
                      <div className="text-[11px] text-[#222222] mt-0.5 truncate">
                        {voucher.subtitle}
                      </div>
                      <div className="text-[10px] text-[#757575] mt-1">
                        Applied in cart · {voucher.expiresIn}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onClaimVoucher(voucher.id)}
                      className={`h-[28px] px-3 rounded-[2px] text-[11px] font-semibold shrink-0 transition-colors cursor-pointer inline-flex items-center gap-1 ${
                        isClaimed
                          ? 'bg-[#FFF5F1] text-[#EE4D2D] border border-[#EE4D2D]'
                          : 'bg-[#EE4D2D] hover:bg-[#D73211] text-white'
                      }`}
                    >
                      {isClaimed ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Claimed</span>
                        </>
                      ) : (
                        <span>Claim</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* PERSONALISED INTENT DISCOVER GRID */}
        <section>
          <div className="bg-white border border-[#EBEBEB] rounded-t-[2px] px-5 h-[48px] flex items-center justify-between mb-3">
            <div className="h-full flex items-center border-b-4 border-[#EE4D2D] px-1">
              <h2 className="font-display text-[16px] font-bold text-[#EE4D2D] uppercase tracking-[0.02em]">
                {shoppingIntent === 'all'
                  ? 'Daily Discover'
                  : `Curated for ${activeIntentConfig.label}`}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              {shoppingIntent !== 'all' && (
                <button
                  type="button"
                  onClick={() => onChangeIntent('all')}
                  className="text-[12px] text-[#757575] hover:text-[#EE4D2D] cursor-pointer"
                >
                  Show All ({products.length})
                </button>
              )}
              <button
                type="button"
                onClick={() =>
                  shoppingIntent === 'tech'
                    ? onSelectCategory('mobile')
                    : onQuickFilter('all')
                }
                className="text-[13px] text-[#555555] hover:text-[#EE4D2D] font-medium inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Refine &amp; Compare Catalog</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-[10px]">
            {intentProducts.map((product) => (
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
        </section>
      </div>
    </div>
  );
};
