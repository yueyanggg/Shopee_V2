import React, { useMemo, useState } from 'react';
import {
  Check,
  Minus,
  Plus,
  Trash2,
  Truck,
  Ticket,
  Store,
  MapPin,
  CreditCard,
  Banknote,
  Wallet,
  CheckCircle2,
  PackageCheck,
  ShoppingBag,
  ArrowRight,
  AlertCircle,
  XCircle,
  Repeat,
} from 'lucide-react';
import {
  CartItem,
  OrderRecord,
  Product,
  RecurringCadence,
  Voucher,
} from '../types/marketplace';
import { computeVoucherDiscount, getBestVoucherForSubtotal } from '../data/marketplaceData';
import { ProductVisual } from '../components/ProductVisual';

interface CartScreenProps {
  mode: 'cart' | 'checkout' | 'orders';
  cartItems: CartItem[];
  products: Product[];
  vouchers: Voucher[];
  claimedVoucherIds: string[];
  selectedVoucherId: string | null;
  orders: OrderRecord[];
  latestOrderId: string | null;
  onClaimVoucher: (id: string) => void;
  onSelectVoucher: (id: string | null, isManual?: boolean) => void;
  onToggleSelect: (productId: string, variant: string) => void;
  onToggleSelectAll: (selected: boolean) => void;
  onUpdateQty: (productId: string, variant: string, delta: number) => void;
  onUpdateItemRecurring: (
    productId: string,
    variant: string,
    cadence: RecurringCadence
  ) => void;
  onRemoveItem: (productId: string, variant: string) => void;
  onClearCart: () => void;
  onProceedCheckout: () => void;
  onBackToCart: () => void;
  onPlaceOrder: (payload: {
    recipientName: string;
    phone: string;
    postalCode: string;
    address: string;
    paymentMethod: string;
    subtotal: number;
    shippingFee: number;
    voucherDiscount: number;
    total: number;
    recurringSchedule?: RecurringCadence;
  }) => void;
  onAdvanceOrderStatus: (orderId: string) => void;
  onCancelOrder: (orderId: string) => void;
  onPauseRecurringOrder: (orderId: string) => void;
  onSelectProduct: (product: Product) => void;
  onContinueShopping: () => void;
}

const ORDER_STAGES: ('Preparing Shipment' | 'In Transit' | 'Delivered')[] = [
  'Preparing Shipment',
  'In Transit',
  'Delivered',
];

const RECURRING_LABELS: Record<RecurringCadence, string> = {
  none: 'One-time',
  weekly: 'Weekly',
  biweekly: 'Every 2 Weeks',
  monthly: 'Monthly',
};

function isValidPhone(raw: string): boolean {
  const cleaned = raw.trim();
  // Accepts Singapore 8-digit numbers (+65 9123 4567 or 91234567) or standard international 8-15 digit phones
  return /^(\+65\s?)?[689]\d{3}\s?\d{4}$/.test(cleaned) || /^\+?[1-9]\d{7,14}$/.test(cleaned.replace(/[\s-]/g, ''));
}

function isValidPostalCode(raw: string): boolean {
  // Validated 6-digit Singapore postal code (e.g., 018980)
  return /^\d{6}$/.test(raw.trim());
}

export const CartAndCheckoutScreen: React.FC<CartScreenProps> = ({
  mode,
  cartItems,
  products,
  vouchers,
  claimedVoucherIds,
  selectedVoucherId,
  orders,
  latestOrderId,
  onClaimVoucher,
  onSelectVoucher,
  onToggleSelect,
  onToggleSelectAll,
  onUpdateQty,
  onUpdateItemRecurring,
  onRemoveItem,
  onClearCart,
  onProceedCheckout,
  onBackToCart,
  onPlaceOrder,
  onAdvanceOrderStatus,
  onCancelOrder,
  onPauseRecurringOrder,
  onSelectProduct,
  onContinueShopping,
}) => {
  const [recipientName, setRecipientName] = useState('Alex Tan');
  const [phone, setPhone] = useState('+65 9123 4567');
  const [postalCode, setPostalCode] = useState('018980');
  const [address, setAddress] = useState('18 Marina Boulevard, #14-02');
  const [paymentMethod, setPaymentMethod] = useState('ShopeePay Wallet');
  const [checkoutRecurring, setCheckoutRecurring] = useState<RecurringCadence>('none');
  const [formError, setFormError] = useState('');
  const [touchedCheckout, setTouchedCheckout] = useState(false);

  const enrichedItems = useMemo(() => {
    return cartItems
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return null;
        return { ...item, product };
      })
      .filter((x): x is CartItem & { product: Product } => x !== null);
  }, [cartItems, products]);

  const selectedItems = enrichedItems.filter((item) => item.selected);
  const allSelected =
    enrichedItems.length > 0 && enrichedItems.every((item) => item.selected);

  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const originalSubtotal = selectedItems.reduce(
    (sum, item) => sum + item.product.originalPrice * item.quantity,
    0
  );
  const itemSavings = Math.max(0, originalSubtotal - subtotal);

  const baseShipping =
    selectedItems.length === 0
      ? 0
      : selectedItems.every((i) => i.product.freeShipping) || subtotal >= 15
      ? 0
      : 4.5;

  const activeVoucher = vouchers.find((v) => v.id === selectedVoucherId) ?? null;
  const bestVoucherRecommendation = getBestVoucherForSubtotal(
    vouchers,
    subtotal,
    baseShipping
  );

  let voucherDiscount = 0;
  let shippingDiscount = 0;
  if (activeVoucher && subtotal >= activeVoucher.minSpend) {
    const disc = computeVoucherDiscount(activeVoucher, subtotal, baseShipping);
    if (activeVoucher.discountType === 'shipping') {
      shippingDiscount = disc;
    } else {
      voucherDiscount = disc;
    }
  }

  const finalShipping = Math.max(0, baseShipping - shippingDiscount);
  const totalPayable = Math.max(0, subtotal + finalShipping - voucherDiscount);

  const nextUnlockVoucher = vouchers
    .filter((v) => v.minSpend > subtotal)
    .sort((a, b) => a.minSpend - b.minSpend)[0];

  const derivedCartRecurring =
    selectedItems.find((i) => i.recurringCadence && i.recurringCadence !== 'none')
      ?.recurringCadence ?? 'none';

  // ORDERS VIEW
  if (mode === 'orders') {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-6 pb-16 space-y-4">
        <div className="bg-white border border-[#EBEBEB] rounded-[2px] px-5 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-[20px] font-bold text-[#222222]">
              My Purchases &amp; Order Tracking
            </h1>
            <p className="text-[13px] text-[#757575] mt-0.5">
              Track active deliveries, manage recurring checkouts, or cancel an order placed by
              mistake.
            </p>
          </div>
          <button
            type="button"
            onClick={onContinueShopping}
            className="h-[36px] px-4 border border-[#EE4D2D] text-[#EE4D2D] hover:bg-[#FFF5F1] text-[13px] font-medium rounded-[2px] cursor-pointer whitespace-nowrap shrink-0"
          >
            Continue Shopping
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white border border-[#EBEBEB] rounded-[2px] py-16 text-center">
            <PackageCheck className="w-12 h-12 text-[#CCCCCC] mx-auto mb-3" />
            <div className="text-[16px] font-medium text-[#222222]">No orders placed yet</div>
            <p className="text-[13px] text-[#757575] mt-1">
              Add items to your cart and complete checkout to track your orders here.
            </p>
            <button
              type="button"
              onClick={onContinueShopping}
              className="mt-4 h-[38px] px-6 bg-[#EE4D2D] hover:bg-[#D73211] text-white text-[13px] font-medium rounded-[2px] cursor-pointer"
            >
              Explore Marketplace
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isJustPlaced = order.id === latestOrderId;
              const isCancelled = order.status === 'Cancelled';
              const currentStageIndex = isCancelled
                ? -1
                : ORDER_STAGES.indexOf(
                    order.status as 'Preparing Shipment' | 'In Transit' | 'Delivered'
                  );
              const canCancel =
                order.status === 'Preparing Shipment' || order.status === 'In Transit';

              return (
                <div
                  key={order.id}
                  className={`bg-white border rounded-[2px] overflow-hidden ${
                    isCancelled
                      ? 'border-[#E5E7EB] opacity-90'
                      : isJustPlaced
                      ? 'border-[#EE4D2D]'
                      : 'border-[#EBEBEB]'
                  }`}
                >
                  {isJustPlaced && !isCancelled && (
                    <div className="bg-[#FFF5F1] border-b border-[#FADCD4] px-5 py-2.5 flex items-center gap-2 text-[13px] text-[#EE4D2D] font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Order #{order.id} Confirmed — {order.status}</span>
                    </div>
                  )}

                  {isCancelled && (
                    <div className="bg-[#FEF2F2] border-b border-[#FECACA] px-5 py-2.5 flex items-center gap-2 text-[13px] text-[#B91C1C] font-semibold">
                      <XCircle className="w-4 h-4" />
                      <span>
                        Order #{order.id} Cancelled — Full refund to {order.paymentMethod} initiated
                      </span>
                    </div>
                  )}

                  <div className="px-5 py-3 border-b border-[#EBEBEB] flex flex-wrap items-center justify-between gap-2 text-[13px]">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-semibold text-[#222222] tabular-nums">
                        Order #{order.id}
                      </span>
                      <span className="text-[#757575]">{order.createdAt}</span>
                      {order.recurringSchedule && order.recurringSchedule !== 'none' && !isCancelled && (
                        <span className="inline-flex items-center gap-1 bg-[#F0FDFA] border border-[#99F6E4] text-[#0F766E] text-[11px] font-semibold px-2 py-0.5 rounded-[2px]">
                          <Repeat className="w-3 h-3" />
                          <span>Recurring: {RECURRING_LABELS[order.recurringSchedule]}</span>
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`font-semibold uppercase text-[12px] tracking-[0.02em] ${
                          isCancelled ? 'text-[#B91C1C]' : 'text-[#EE4D2D]'
                        }`}
                      >
                        {order.status}
                      </span>
                      {order.recurringSchedule && order.recurringSchedule !== 'none' && !isCancelled && (
                        <button
                          type="button"
                          onClick={() => onPauseRecurringOrder(order.id)}
                          className="px-2.5 py-1 text-[11px] font-medium border border-[#99F6E4] text-[#0F766E] hover:bg-[#F0FDFA] rounded-[2px] cursor-pointer transition-colors whitespace-nowrap shrink-0"
                        >
                          Pause Recurring
                        </button>
                      )}
                      {order.status !== 'Delivered' && !isCancelled && (
                        <button
                          type="button"
                          onClick={() => onAdvanceOrderStatus(order.id)}
                          className="px-2.5 py-1 text-[11px] font-medium border border-[#CCCCCC] hover:border-[#EE4D2D] hover:text-[#EE4D2D] rounded-[2px] cursor-pointer transition-colors whitespace-nowrap shrink-0"
                        >
                          Update Delivery Status
                        </button>
                      )}
                      {canCancel && (
                        <button
                          type="button"
                          onClick={() => onCancelOrder(order.id)}
                          className="px-2.5 py-1 text-[11px] font-semibold border border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C] hover:bg-[#FEE2E2] rounded-[2px] cursor-pointer transition-colors inline-flex items-center gap-1 whitespace-nowrap shrink-0"
                        >
                          <XCircle className="w-3 h-3" />
                          <span>Cancel Order</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Step-by-Step Tracking Timeline */}
                  {!isCancelled && (
                    <div className="px-5 py-3.5 bg-[#FAFAFA] border-b border-[#EBEBEB]">
                      <div className="grid grid-cols-3 gap-2">
                        {ORDER_STAGES.map((stage, idx) => {
                          const completed = idx <= currentStageIndex;
                          return (
                            <div key={stage} className="flex items-center gap-2">
                              <span
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                                  completed
                                    ? 'bg-[#0F766E] text-white'
                                    : 'bg-[#E5E7EB] text-[#757575]'
                                }`}
                              >
                                {completed ? <Check className="w-3 h-3" /> : idx + 1}
                              </span>
                              <span
                                className={`text-[12px] truncate ${
                                  completed ? 'text-[#222222] font-semibold' : 'text-[#757575]'
                                }`}
                              >
                                {stage}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="divide-y divide-[#F5F5F5] px-5">
                    {order.items.map((item) => (
                      <div
                        key={`${order.id}-${item.productId}-${item.variant}`}
                        className="py-3.5 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-16 h-16 border border-[#EBEBEB] rounded-[2px] overflow-hidden shrink-0">
                            <ProductVisual kind={item.visual} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[14px] text-[#222222] font-medium truncate">
                              {item.title}
                            </div>
                            <div className="text-[12px] text-[#757575] mt-0.5">
                              {item.shopName} · Variation: {item.variant}
                            </div>
                            <div className="text-[12px] text-[#222222] mt-0.5 tabular-nums">
                              x{item.quantity}
                            </div>
                          </div>
                        </div>
                        <div className="font-display font-semibold text-[15px] text-[#222222] tabular-nums shrink-0">
                          ${(item.unitPrice * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#FFFEFB] border-t border-[#EBEBEB] px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[13px]">
                    <div className="text-[#757575]">
                      Deliver to{' '}
                      <span className="text-[#222222] font-medium">{order.recipientName}</span>
                      {order.phone ? ` (${order.phone})` : ''} · {order.address}
                      {order.postalCode ? ` · Postal ${order.postalCode}` : ''} · Paid via{' '}
                      <span className="text-[#222222] font-medium">{order.paymentMethod}</span>
                    </div>
                    <div className="flex items-baseline gap-2 shrink-0">
                      <span className="text-[#555555]">Order Total:</span>
                      <span
                        className={`font-display text-[20px] font-bold tabular-nums ${
                          isCancelled ? 'text-[#757575] line-through' : 'text-[#EE4D2D]'
                        }`}
                      >
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // CHECKOUT VIEW
  if (mode === 'checkout') {
    const phoneValid = isValidPhone(phone);
    const postalValid = isValidPostalCode(postalCode);
    const nameValid = recipientName.trim().length >= 2;
    const addressValid = address.trim().length >= 6;
    const effectiveRecurring =
      checkoutRecurring !== 'none' ? checkoutRecurring : derivedCartRecurring;

    const handleConfirmOrder = (e: React.FormEvent) => {
      e.preventDefault();
      setTouchedCheckout(true);
      if (!nameValid) {
        setFormError('Please enter the recipient full name (at least 2 characters).');
        return;
      }
      if (!phoneValid) {
        setFormError(
          'Please enter a valid phone number (e.g. +65 9123 4567 or 8+ digits) so couriers can reach you.'
        );
        return;
      }
      if (!postalValid) {
        setFormError(
          'Please enter a valid 6-digit postal code (e.g. 018980) to prevent delivery disputes.'
        );
        return;
      }
      if (!addressValid) {
        setFormError('Please provide a complete street address and unit number.');
        return;
      }
      setFormError('');
      onPlaceOrder({
        recipientName: recipientName.trim(),
        phone: phone.trim(),
        postalCode: postalCode.trim(),
        address: address.trim(),
        paymentMethod,
        subtotal,
        shippingFee: finalShipping,
        voucherDiscount: voucherDiscount + shippingDiscount,
        total: totalPayable,
        recurringSchedule: effectiveRecurring,
      });
    };

    return (
      <form
        onSubmit={handleConfirmOrder}
        className="max-w-[1200px] mx-auto px-4 py-6 pb-16 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h1 className="font-display text-[22px] font-bold text-[#222222]">Checkout</h1>
          <button
            type="button"
            onClick={onBackToCart}
            className="text-[13px] text-[#05A] hover:text-[#EE4D2D] cursor-pointer"
          >
            &larr; Back to Shopping Cart
          </button>
        </div>

        {/* Delivery Address Block with Postal Code & Phone Verification (Error Prevention) */}
        <section className="bg-white border border-[#EBEBEB] rounded-[2px] p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2 text-[#EE4D2D] font-semibold text-[16px]">
              <MapPin className="w-4 h-4" />
              <span>Delivery Address &amp; Contact Verification</span>
            </div>
            <span className="text-[12px] text-[#0F766E] font-medium">
              Postal code &amp; phone verified before dispatch to avoid delivery disputes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[12px] text-[#757575] mb-1">Full Name</label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Recipient full name"
                className={`w-full h-[38px] px-3 text-[14px] border rounded-[2px] focus:outline-none ${
                  !nameValid && touchedCheckout
                    ? 'border-[#D0011B] bg-[#FFF5F5]'
                    : 'border-[#CCCCCC] focus:border-[#EE4D2D]'
                }`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[12px] text-[#757575]">Phone Number</label>
                {phoneValid ? (
                  <span className="text-[11px] font-semibold text-[#0F766E] inline-flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-[#D0011B] inline-flex items-center gap-0.5">
                    <AlertCircle className="w-3 h-3" /> Invalid format
                  </span>
                )}
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+65 9123 4567"
                className={`w-full h-[38px] px-3 text-[14px] border rounded-[2px] focus:outline-none tabular-nums ${
                  !phoneValid
                    ? 'border-[#D0011B] bg-[#FFF5F5]'
                    : 'border-[#CCCCCC] focus:border-[#EE4D2D]'
                }`}
              />
              {!phoneValid && (
                <p className="mt-1 text-[11px] text-[#D0011B]">
                  Enter a valid mobile number (e.g. +65 9123 4567).
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[12px] text-[#757575]">Postal Code (6 Digits)</label>
                {postalValid ? (
                  <span className="text-[11px] font-semibold text-[#0F766E] inline-flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-[#D0011B] inline-flex items-center gap-0.5">
                    <AlertCircle className="w-3 h-3" /> 6 digits required
                  </span>
                )}
              </div>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value.replace(/[^\d]/g, ''))}
                placeholder="018980"
                className={`w-full h-[38px] px-3 text-[14px] border rounded-[2px] focus:outline-none tabular-nums ${
                  !postalValid
                    ? 'border-[#D0011B] bg-[#FFF5F5]'
                    : 'border-[#CCCCCC] focus:border-[#EE4D2D]'
                }`}
              />
              {!postalValid && (
                <p className="mt-1 text-[11px] text-[#D0011B]">
                  Must be an exact 6-digit postal code (e.g. 018980).
                </p>
              )}
            </div>

            <div>
              <label className="block text-[12px] text-[#757575] mb-1">
                Street Address &amp; Unit
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Block, street & #unit"
                className={`w-full h-[38px] px-3 text-[14px] border rounded-[2px] focus:outline-none ${
                  !addressValid && touchedCheckout
                    ? 'border-[#D0011B] bg-[#FFF5F5]'
                    : 'border-[#CCCCCC] focus:border-[#EE4D2D]'
                }`}
              />
            </div>
          </div>

          {formError && (
            <div className="mt-3 px-3 py-2 bg-[#FEF2F2] border border-[#FECACA] rounded-[2px] text-[12px] text-[#B91C1C] flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}
        </section>

        {/* Products Ordered */}
        <section className="bg-white border border-[#EBEBEB] rounded-[2px] overflow-hidden">
          <div className="px-5 py-3 border-b border-[#EBEBEB] grid grid-cols-12 text-[13px] font-medium text-[#757575]">
            <div className="col-span-6">Products Ordered</div>
            <div className="col-span-2 text-right">Unit Price</div>
            <div className="col-span-2 text-right">Amount</div>
            <div className="col-span-2 text-right">Item Subtotal</div>
          </div>

          <div className="divide-y divide-[#F5F5F5]">
            {selectedItems.map(({ product, variant, quantity, recurringCadence }) => (
              <div
                key={`${product.id}-${variant}`}
                className="px-5 py-3.5 grid grid-cols-12 items-center text-[13px]"
              >
                <div className="col-span-6 flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-[2px] border border-[#EBEBEB] overflow-hidden shrink-0">
                    <ProductVisual kind={product.visual} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[#222222] font-medium truncate">{product.title}</div>
                    <div className="text-[12px] text-[#757575] flex flex-wrap items-center gap-2">
                      <span>
                        {product.shopName} · Variation: {variant}
                      </span>
                      {recurringCadence && recurringCadence !== 'none' && (
                        <span className="text-[11px] font-semibold text-[#0F766E] bg-[#F0FDFA] px-1.5 py-0.5 rounded-[2px]">
                          {RECURRING_LABELS[recurringCadence]}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-span-2 text-right tabular-nums">
                  ${product.price.toFixed(2)}
                </div>
                <div className="col-span-2 text-right tabular-nums">{quantity}</div>
                <div className="col-span-2 text-right font-display font-semibold tabular-nums">
                  ${(product.price * quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recurring Delivery Schedule Option + Payment Method & Price Summary */}
        <section className="bg-white border border-[#EBEBEB] rounded-[2px] p-5 space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div>
              <h2 className="text-[16px] font-semibold text-[#222222] mb-2">Payment Method</h2>
              <div className="flex flex-wrap gap-2.5">
                {[
                  { label: 'ShopeePay Wallet', icon: Wallet },
                  { label: 'Cash on Delivery (COD)', icon: Banknote },
                  { label: 'Credit / Debit Card', icon: CreditCard },
                ].map((method) => {
                  const Icon = method.icon;
                  const active = paymentMethod === method.label;
                  return (
                    <button
                      key={method.label}
                      type="button"
                      onClick={() => setPaymentMethod(method.label)}
                      className={`h-[40px] px-4 rounded-[2px] border text-[13px] font-medium inline-flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                        active
                          ? 'border-[#EE4D2D] bg-[#FFF5F1] text-[#EE4D2D]'
                          : 'border-[#CCCCCC] bg-white text-[#222222] hover:border-[#EE4D2D]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{method.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className="text-[16px] font-semibold text-[#222222] mb-2 inline-flex items-center gap-1.5">
                <Repeat className="w-4 h-4 text-[#0F766E]" />
                <span>Recurring Delivery Schedule (Groceries &amp; Essentials)</span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {(['none', 'weekly', 'biweekly', 'monthly'] as RecurringCadence[]).map((cadence) => {
                  const active = effectiveRecurring === cadence;
                  return (
                    <button
                      key={cadence}
                      type="button"
                      onClick={() => setCheckoutRecurring(cadence)}
                      className={`h-[40px] px-3.5 rounded-[2px] border text-[13px] font-medium cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                        active
                          ? 'border-[#0F766E] bg-[#F0FDFA] text-[#0F766E]'
                          : 'border-[#CCCCCC] bg-white text-[#555555] hover:border-[#0F766E]'
                      }`}
                    >
                      {RECURRING_LABELS[cadence]}
                    </button>
                  );
                })}
              </div>
              <p className="text-[12px] text-[#757575] mt-1.5">
                {effectiveRecurring === 'none'
                  ? 'One-time delivery. Choose Weekly, Every 2 Weeks, or Monthly for hands-free replenishment.'
                  : `Auto-reorder scheduled ${RECURRING_LABELS[effectiveRecurring].toLowerCase()}. You can pause or cancel anytime in Orders.`}
              </p>
            </div>
          </div>

          <div className="border-t border-[#EBEBEB] pt-4 flex flex-col items-end space-y-2 text-[14px]">
            <div className="w-full max-w-[360px] flex justify-between">
              <span className="text-[#757575]">Merchandise Subtotal:</span>
              <span className="tabular-nums font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="w-full max-w-[360px] flex justify-between">
              <span className="text-[#757575]">Shipping Fee:</span>
              <span className="tabular-nums font-medium text-[#0F766E]">
                {finalShipping === 0 ? 'Free ($0.00)' : `$${finalShipping.toFixed(2)}`}
              </span>
            </div>
            {voucherDiscount + shippingDiscount > 0 && (
              <div className="w-full max-w-[360px] flex justify-between text-[#EE4D2D]">
                <span>Voucher Applied in Cart ({activeVoucher?.code}):</span>
                <span className="tabular-nums font-semibold">
                  -${(voucherDiscount + shippingDiscount).toFixed(2)}
                </span>
              </div>
            )}
            <div className="w-full max-w-[360px] flex justify-between items-baseline pt-2 border-t border-[#EBEBEB]">
              <span className="text-[#222222] font-semibold">Final Total:</span>
              <span className="font-display text-[28px] font-extrabold text-[#EE4D2D] tabular-nums">
                ${totalPayable.toFixed(2)}
              </span>
            </div>

            <button
              type="submit"
              className="mt-3 h-[44px] w-full max-w-[360px] bg-[#EE4D2D] hover:bg-[#D73211] text-white font-semibold text-[15px] rounded-[2px] cursor-pointer transition-colors"
            >
              {effectiveRecurring === 'none'
                ? 'Place Order'
                : `Place Order & Set ${RECURRING_LABELS[effectiveRecurring]} Delivery`}
            </button>
          </div>
        </section>
      </form>
    );
  }

  // CART VIEW
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6 pb-16 space-y-4">
      <div className="bg-[#FFFBF8] border border-[#F9EDE5] rounded-[2px] px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-[13px] text-[#222222]">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-[#00BFA5]" />
          <span>
            {baseShipping === 0 && selectedItems.length > 0
              ? 'Free Shipping unlocked ($0.00 delivery fee).'
              : 'Free Shipping applies on orders $15+ or Official Brand Store Free-Shipping items.'}
          </span>
        </div>
        {nextUnlockVoucher && selectedItems.length > 0 && (
          <span className="text-[12px] text-[#B93815] font-medium tabular-nums">
            Add ${(nextUnlockVoucher.minSpend - subtotal).toFixed(2)} more to apply{' '}
            {nextUnlockVoucher.title} in cart
          </span>
        )}
      </div>

      {enrichedItems.length === 0 ? (
        <div className="bg-white border border-[#EBEBEB] rounded-[2px] py-16 text-center">
          <ShoppingBag className="w-12 h-12 text-[#CCCCCC] mx-auto mb-3" />
          <div className="font-display text-[18px] font-semibold text-[#222222]">
            Your shopping cart is empty
          </div>
          <p className="text-[13px] text-[#757575] mt-1">
            Explore today&apos;s Flash Deals and Intent-Led Picks to fill your cart.
          </p>
          <button
            type="button"
            onClick={onContinueShopping}
            className="mt-4 h-[40px] px-8 bg-[#EE4D2D] hover:bg-[#D73211] text-white text-[14px] font-medium rounded-[2px] cursor-pointer"
          >
            Go Shopping Now
          </button>
        </div>
      ) : (
        <>
          {/* Cart Table Header + One-Click Remove All Items */}
          <div className="bg-white border border-[#EBEBEB] rounded-[2px] px-5 py-3.5 grid grid-cols-12 items-center text-[13px] text-[#757575]">
            <div className="col-span-6 flex items-center gap-3">
              <button
                type="button"
                aria-label="Select all cart items"
                onClick={() => onToggleSelectAll(!allSelected)}
                className={`w-[16px] h-[16px] rounded-[2px] border flex items-center justify-center cursor-pointer ${
                  allSelected
                    ? 'bg-[#EE4D2D] border-[#EE4D2D] text-white'
                    : 'bg-white border-[#CCCCCC]'
                }`}
              >
                {allSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </button>
              <span className="text-[#222222] font-medium">Product</span>
            </div>
            <div className="col-span-2 text-center hidden sm:block">Unit Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-1 text-center hidden sm:block">Total</div>
            <div className="col-span-6 sm:col-span-1 text-right">
              <button
                type="button"
                onClick={onClearCart}
                className="text-[12px] font-semibold text-[#D0011B] hover:underline cursor-pointer whitespace-nowrap"
              >
                Remove All
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="space-y-3">
            {enrichedItems.map(
              ({ product, variant, quantity, selected, recurringCadence = 'none' }) => (
                <div
                  key={`${product.id}-${variant}`}
                  className="bg-white border border-[#EBEBEB] rounded-[2px] overflow-hidden"
                >
                  <div className="px-5 py-2.5 border-b border-[#F2F2F2] flex flex-wrap items-center justify-between gap-2 text-[13px]">
                    <div className="flex items-center gap-2">
                      {product.isMall && (
                        <span className="bg-[#D0011B] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[2px]">
                          Official Brand Store
                        </span>
                      )}
                      <Store className="w-3.5 h-3.5 text-[#555555]" />
                      <span className="font-medium text-[#222222]">{product.shopName}</span>
                    </div>
                    <span className="text-[11px] text-[#0F766E] font-medium">
                      Delivery: {product.deliveryEta}
                    </span>
                  </div>

                  <div className="px-5 py-4 grid grid-cols-12 items-center gap-2">
                    <div className="col-span-6 flex items-center gap-3 min-w-0">
                      <button
                        type="button"
                        aria-label={`Select ${product.title}`}
                        onClick={() => onToggleSelect(product.id, variant)}
                        className={`w-[16px] h-[16px] rounded-[2px] border flex items-center justify-center shrink-0 cursor-pointer ${
                          selected
                            ? 'bg-[#EE4D2D] border-[#EE4D2D] text-white'
                            : 'bg-white border-[#CCCCCC]'
                        }`}
                      >
                        {selected && <Check className="w-3 h-3 stroke-[3]" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => onSelectProduct(product)}
                        className="w-20 h-20 border border-[#EBEBEB] rounded-[2px] overflow-hidden shrink-0 cursor-pointer"
                      >
                        <ProductVisual kind={product.visual} />
                      </button>

                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() => onSelectProduct(product)}
                          className="text-[13px] leading-[18px] text-[#222222] hover:text-[#EE4D2D] line-clamp-2 text-left cursor-pointer font-medium"
                        >
                          {product.title}
                        </button>
                        <div className="text-[12px] text-[#757575] mt-1">
                          Variation: <span className="text-[#222222] font-medium">{variant}</span>
                        </div>
                        <div className="text-[11px] text-[#B93815] mt-0.5 truncate">
                          {product.offerCondition}
                        </div>

                        {/* Recurring Delivery Option per item */}
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          <span className="text-[11px] text-[#757575] inline-flex items-center gap-1">
                            <Repeat className="w-3 h-3 text-[#0F766E]" />
                            <span>Repeat:</span>
                          </span>
                          {(['none', 'weekly', 'biweekly', 'monthly'] as RecurringCadence[]).map(
                            (cadence) => {
                              const active = recurringCadence === cadence;
                              return (
                                <button
                                  key={cadence}
                                  type="button"
                                  onClick={() =>
                                    onUpdateItemRecurring(product.id, variant, cadence)
                                  }
                                  className={`px-2 py-0.5 text-[11px] rounded-[2px] border cursor-pointer transition-colors whitespace-nowrap ${
                                    active
                                      ? 'border-[#0F766E] bg-[#F0FDFA] text-[#0F766E] font-semibold'
                                      : 'border-[#E5E5E5] text-[#555555] hover:border-[#0F766E]'
                                  }`}
                                >
                                  {RECURRING_LABELS[cadence]}
                                </button>
                              );
                            }
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Unit Price */}
                    <div className="col-span-2 text-center hidden sm:block tabular-nums">
                      <span className="text-[12px] text-[#929292] line-through mr-1.5">
                        ${product.originalPrice.toFixed(0)}
                      </span>
                      <span className="text-[14px] text-[#222222] font-semibold">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>

                    {/* Quantity */}
                    <div className="col-span-4 sm:col-span-2 flex justify-center">
                      <div className="inline-flex items-center border border-[#D9D9D9] rounded-[2px] h-[30px]">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => onUpdateQty(product.id, variant, -1)}
                          className="w-[28px] h-full flex items-center justify-center text-[#555555] hover:bg-[#F5F5F5] border-r border-[#D9D9D9] cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-[38px] text-center text-[13px] font-medium tabular-nums">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => onUpdateQty(product.id, variant, 1)}
                          className="w-[28px] h-full flex items-center justify-center text-[#555555] hover:bg-[#F5F5F5] border-l border-[#D9D9D9] cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Line Total */}
                    <div className="col-span-1 text-center hidden sm:block font-display font-bold text-[15px] text-[#EE4D2D] tabular-nums">
                      ${(product.price * quantity).toFixed(2)}
                    </div>

                    {/* Remove */}
                    <div className="col-span-2 sm:col-span-1 text-right">
                      <button
                        type="button"
                        aria-label={`Remove ${product.title}`}
                        onClick={() => onRemoveItem(product.id, variant)}
                        className="text-[#757575] hover:text-[#D0011B] p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>

          {/* Vouchers Applied in Cart */}
          <div className="bg-white border border-[#EBEBEB] rounded-[2px] p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-[14px] font-semibold text-[#222222]">
                <Ticket className="w-4 h-4 text-[#EE4D2D]" />
                <span>Platform Vouchers (Applied in Cart)</span>
                {activeVoucher && subtotal >= activeVoucher.minSpend && (
                  <span className="text-[12px] font-semibold text-[#0F766E]">
                    · Applied in cart: {activeVoucher.code} (-$
                    {(voucherDiscount + shippingDiscount).toFixed(2)})
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {bestVoucherRecommendation.voucher &&
                  bestVoucherRecommendation.voucher.id !== selectedVoucherId && (
                    <button
                      type="button"
                      onClick={() => {
                        if (!claimedVoucherIds.includes(bestVoucherRecommendation.voucher!.id)) {
                          onClaimVoucher(bestVoucherRecommendation.voucher!.id);
                        }
                        onSelectVoucher(bestVoucherRecommendation.voucher!.id, true);
                      }}
                      className="text-[12px] font-semibold text-[#EE4D2D] hover:underline cursor-pointer"
                    >
                      Apply Best ({bestVoucherRecommendation.voucher.code} -$
                      {bestVoucherRecommendation.savings.toFixed(2)})
                    </button>
                  )}
                {selectedVoucherId && (
                  <button
                    type="button"
                    onClick={() => onSelectVoucher(null, true)}
                    className="text-[12px] text-[#757575] hover:text-[#EE4D2D] cursor-pointer"
                  >
                    Remove Voucher
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {vouchers.map((v) => {
                const claimed = claimedVoucherIds.includes(v.id);
                const eligible = subtotal >= v.minSpend;
                const applied = selectedVoucherId === v.id && eligible;
                const previewSavings = computeVoucherDiscount(v, subtotal, baseShipping);

                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      if (!claimed) {
                        onClaimVoucher(v.id);
                      }
                      if (eligible) {
                        onSelectVoucher(applied ? null : v.id, true);
                      }
                    }}
                    className={`p-2.5 rounded-[2px] border text-left transition-colors cursor-pointer ${
                      applied
                        ? 'border-[#EE4D2D] bg-[#FFF5F1]'
                        : eligible
                        ? 'border-[#E0E0E0] hover:border-[#EE4D2D] bg-white'
                        : 'border-[#EBEBEB] bg-[#FAFAFA] opacity-75'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-[14px] text-[#EE4D2D]">
                        {v.title}
                      </span>
                      <span className="text-[11px] font-semibold text-[#EE4D2D] tabular-nums">
                        {applied
                          ? `Applied (-$${previewSavings.toFixed(2)})`
                          : eligible
                          ? `Save $${previewSavings.toFixed(2)}`
                          : `Add $${(v.minSpend - subtotal).toFixed(2)}`}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#757575] mt-0.5 truncate">{v.subtitle}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Transparent Final Price Summary Bar + One-Click Remove All Items */}
          <div
            className="sticky bottom-0 z-30 bg-white border border-[#EBEBEB] rounded-[2px] px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            style={{ boxShadow: '0 -2px 12px rgba(0, 0, 0, 0.06)' }}
          >
            <div className="flex flex-wrap items-center gap-4 text-[13px]">
              <button
                type="button"
                onClick={() => onToggleSelectAll(!allSelected)}
                className="inline-flex items-center gap-2 cursor-pointer font-medium"
              >
                <span
                  className={`w-[16px] h-[16px] rounded-[2px] border flex items-center justify-center ${
                    allSelected
                      ? 'bg-[#EE4D2D] border-[#EE4D2D] text-white'
                      : 'bg-white border-[#CCCCCC]'
                  }`}
                >
                  {allSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </span>
                <span>Select All ({enrichedItems.length})</span>
              </button>

              <button
                type="button"
                onClick={onClearCart}
                className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#D0011B] hover:bg-[#FFF5F5] border border-[#FECACA] px-2.5 py-1 rounded-[2px] cursor-pointer whitespace-nowrap shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove All Items</span>
              </button>

              <span className="text-[#555555] tabular-nums">
                Shipping:{' '}
                <strong className="text-[#0F766E]">
                  {finalShipping === 0 ? 'Free' : `$${finalShipping.toFixed(2)}`}
                </strong>
              </span>

              <span className="text-[#555555] tabular-nums">
                Total Saved:{' '}
                <strong className="text-[#EE4D2D]">
                  ${(itemSavings + voucherDiscount + shippingDiscount).toFixed(2)}
                </strong>
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-4">
              <div className="text-right">
                <div className="flex items-baseline gap-2">
                  <span className="text-[14px] text-[#222222]">
                    Final Price ({selectedItems.reduce((s, i) => s + i.quantity, 0)} item
                    {selectedItems.reduce((s, i) => s + i.quantity, 0) === 1 ? '' : 's'}):
                  </span>
                  <span className="font-display text-[26px] font-extrabold text-[#EE4D2D] tabular-nums">
                    ${totalPayable.toFixed(2)}
                  </span>
                </div>
                {voucherDiscount + shippingDiscount > 0 && (
                  <div className="text-[11px] text-[#0F766E] font-medium tabular-nums">
                    Applied in cart: {activeVoucher?.code} (-$
                    {(voucherDiscount + shippingDiscount).toFixed(2)})
                  </div>
                )}
              </div>

              <button
                type="button"
                disabled={selectedItems.length === 0}
                onClick={onProceedCheckout}
                className="h-[42px] px-8 bg-[#EE4D2D] hover:bg-[#D73211] disabled:bg-[#CCCCCC] text-white text-[14px] font-semibold rounded-[2px] cursor-pointer disabled:cursor-not-allowed transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <span>Check Out</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
