import React, { useState } from 'react';
import { X, Scale, Check, ShoppingCart, Star, Truck, ShieldCheck } from 'lucide-react';
import { Product, Voucher } from '../types/marketplace';
import { getBestVoucherForSubtotal } from '../data/marketplaceData';
import { ProductVisual } from './ProductVisual';

interface CompareBarProps {
  comparedProducts: Product[];
  onRemoveCompare: (productId: string) => void;
  onClearCompare: () => void;
  onOpenModal: () => void;
}

export const CompareBar: React.FC<CompareBarProps> = ({
  comparedProducts,
  onRemoveCompare,
  onClearCompare,
  onOpenModal,
}) => {
  if (comparedProducts.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-32px)] max-w-[820px] bg-[#222222] text-white rounded-[3px] px-4 py-2.5 flex items-center justify-between gap-3 border border-[#3B3B3B]"
      style={{ boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)' }}
    >
      <div className="flex items-center gap-3 min-w-0 overflow-x-auto">
        <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#FFE97A] shrink-0">
          <Scale className="w-4 h-4" />
          <span>Shortlist ({comparedProducts.length}/4)</span>
        </div>

        <div className="flex items-center gap-2">
          {comparedProducts.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-1.5 bg-white/10 rounded-[2px] pl-1 pr-1.5 py-1 shrink-0"
            >
              <div className="w-6 h-6 rounded-[1px] overflow-hidden bg-white shrink-0">
                <ProductVisual kind={p.visual} />
              </div>
              <span className="text-[11px] max-w-[110px] truncate">{p.title}</span>
              <button
                type="button"
                aria-label={`Remove ${p.title} from shortlist`}
                onClick={() => onRemoveCompare(p.id)}
                className="text-white/70 hover:text-white cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onClearCompare}
          className="px-2.5 py-1.5 text-[11px] text-white/80 hover:text-white cursor-pointer"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={onOpenModal}
          className="h-[34px] px-4 bg-[#EE4D2D] hover:bg-[#D73211] text-white text-[12px] font-semibold rounded-[2px] cursor-pointer whitespace-nowrap"
        >
          Compare Now ({comparedProducts.length})
        </button>
      </div>
    </div>
  );
};

interface CompareModalProps {
  open: boolean;
  comparedProducts: Product[];
  vouchers: Voucher[];
  onClose: () => void;
  onRemoveCompare: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, variant: string, quantity: number) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  open,
  comparedProducts,
  vouchers,
  onClose,
  onRemoveCompare,
  onSelectProduct,
  onAddToCart,
}) => {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  if (!open) return null;

  const getChosenVariant = (p: Product) =>
    selectedVariants[p.id] ?? p.variants.options[0];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Side-by-side product comparison"
    >
      <div className="bg-white border border-[#EBEBEB] rounded-[3px] w-full max-w-[1060px] max-h-[88vh] flex flex-col overflow-hidden shadow-xl">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#EBEBEB] flex items-center justify-between bg-[#FAFAFA]">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#EE4D2D]" />
            <h2 className="font-display text-[17px] font-bold text-[#222222]">
              Compare Shortlisted Deals ({comparedProducts.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close comparison"
            className="p-1.5 text-[#555555] hover:text-[#222222] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {comparedProducts.length === 0 ? (
          <div className="py-16 px-6 text-center">
            <Scale className="w-10 h-10 text-[#CCCCCC] mx-auto mb-3" />
            <div className="text-[16px] font-semibold text-[#222222]">
              No products shortlisted yet
            </div>
            <p className="text-[13px] text-[#757575] mt-1">
              Click &ldquo;Compare&rdquo; on any product card to evaluate price, offer conditions, delivery, and variant fit side by side.
            </p>
          </div>
        ) : (
          <div className="overflow-auto flex-1">
            <table className="w-full border-collapse text-left min-w-[680px]">
              <thead>
                <tr className="border-b border-[#EBEBEB]">
                  <th className="w-[170px] p-4 bg-[#FAFAFA] text-[12px] font-semibold text-[#757575] align-top">
                    Comparison Criteria
                  </th>
                  {comparedProducts.map((p) => (
                    <th
                      key={p.id}
                      className="p-4 align-top border-l border-[#EBEBEB] min-w-[210px]"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[11px] font-semibold text-[#757575]">
                          {p.isMall ? 'Official Brand Store' : p.isPreferred ? 'Preferred' : p.shopName}
                        </span>
                        <button
                          type="button"
                          onClick={() => onRemoveCompare(p.id)}
                          className="text-[11px] text-[#757575] hover:text-[#D0011B] cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onSelectProduct(p);
                        }}
                        className="group text-left cursor-pointer block w-full"
                      >
                        <div className="w-24 h-24 mx-auto mb-2.5 border border-[#EBEBEB] rounded-[2px] overflow-hidden">
                          <ProductVisual kind={p.visual} />
                        </div>
                        <div className="text-[13px] font-medium text-[#222222] group-hover:text-[#EE4D2D] line-clamp-2 leading-[18px]">
                          {p.title}
                        </div>
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#EBEBEB] text-[13px]">
                {/* Price & Offer Condition */}
                <tr>
                  <td className="p-3.5 bg-[#FAFAFA] font-medium text-[#555555]">
                    Price &amp; Offer Condition
                  </td>
                  {comparedProducts.map((p) => {
                    const baseShip = p.freeShipping ? 0 : 4.5;
                    const best = getBestVoucherForSubtotal(vouchers, p.price, baseShip);
                    const netPrice = Math.max(0, p.price - best.savings);
                    return (
                      <td key={p.id} className="p-3.5 border-l border-[#EBEBEB] align-top">
                        <div className="flex items-baseline gap-2">
                          <span className="font-display text-[20px] font-extrabold text-[#EE4D2D] tabular-nums">
                            ${p.price.toFixed(2)}
                          </span>
                          <span className="text-[12px] text-[#888888] line-through tabular-nums">
                            ${p.originalPrice.toFixed(0)}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#B93815] font-medium mt-1">
                          {p.offerCondition}
                        </div>
                        {best.voucher && best.savings > 0 && (
                          <div className="mt-1.5 text-[11px] text-[#0F766E] font-semibold tabular-nums">
                            Est. ${netPrice.toFixed(2)} w/ {best.voucher.code}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* Delivery & Shipping */}
                <tr>
                  <td className="p-3.5 bg-[#FAFAFA] font-medium text-[#555555]">
                    Shipping &amp; ETA
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3.5 border-l border-[#EBEBEB]">
                      <div className="flex items-center gap-1.5 text-[#0F766E] font-medium">
                        <Truck className="w-3.5 h-3.5" />
                        <span>{p.deliveryEta}</span>
                      </div>
                      <div className="text-[11px] text-[#757575] mt-0.5">
                        {p.freeShipping ? 'Free Shipping ($15+ min)' : 'Standard ($4.50)'} · Ships from {p.shipsFrom}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Compatibility & Exact Variant Picker */}
                <tr>
                  <td className="p-3.5 bg-[#FAFAFA] font-medium text-[#555555] align-top">
                    Select Exact {comparedProducts[0]?.variants.label ?? 'Variant'}
                  </td>
                  {comparedProducts.map((p) => {
                    const chosen = getChosenVariant(p);
                    return (
                      <td key={p.id} className="p-3.5 border-l border-[#EBEBEB] align-top">
                        {p.compatibility && p.compatibility.length > 0 && (
                          <div className="text-[11px] text-[#555555] mb-1.5">
                            Fits: {p.compatibility.join(' · ')}
                          </div>
                        )}
                        <div className="flex flex-col gap-1">
                          {p.variants.options.map((opt) => {
                            const active = chosen === opt;
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() =>
                                  setSelectedVariants((prev) => ({ ...prev, [p.id]: opt }))
                                }
                                className={`px-2 py-1 text-[11px] text-left rounded-[2px] border flex items-center justify-between gap-1 cursor-pointer ${
                                  active
                                    ? 'border-[#EE4D2D] bg-[#FFF5F1] text-[#EE4D2D] font-semibold'
                                    : 'border-[#E0E0E0] text-[#222222] hover:border-[#EE4D2D]'
                                }`}
                              >
                                <span className="truncate">{opt}</span>
                                {active && <Check className="w-3 h-3 shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Key Highlight & Specs */}
                <tr>
                  <td className="p-3.5 bg-[#FAFAFA] font-medium text-[#555555]">
                    Key Specifications
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3.5 border-l border-[#EBEBEB] align-top">
                      <div className="font-medium text-[#222222]">{p.keyHighlight}</div>
                      <ul className="mt-1 space-y-0.5 text-[11px] text-[#757575]">
                        {p.specs.slice(0, 2).map((s) => (
                          <li key={s.label}>
                            {s.label}: {s.value}
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* Rating & Trust */}
                <tr>
                  <td className="p-3.5 bg-[#FAFAFA] font-medium text-[#555555]">
                    Rating &amp; Trust
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3.5 border-l border-[#EBEBEB]">
                      <div className="flex items-center gap-1.5 tabular-nums">
                        <Star className="w-3.5 h-3.5 fill-[#FFCE3D] text-[#FFCE3D]" />
                        <span className="font-semibold text-[#222222]">{p.rating.toFixed(1)}</span>
                        <span className="text-[#757575]">({p.ratingCount.toLocaleString()})</span>
                        <span className="text-[#757575]">· {p.soldDisplay}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-[#555555] mt-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#D0011B]" />
                        <span>{p.isMall ? 'Official Mall Warranty' : 'Shopee Guarantee'}</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Direct Action */}
                <tr>
                  <td className="p-3.5 bg-[#FAFAFA] font-medium text-[#555555]">Action</td>
                  {comparedProducts.map((p) => {
                    const chosen = getChosenVariant(p);
                    return (
                      <td key={p.id} className="p-3.5 border-l border-[#EBEBEB]">
                        <button
                          type="button"
                          onClick={() => onAddToCart(p, chosen, 1)}
                          className="w-full h-[36px] bg-[#EE4D2D] hover:bg-[#D73211] text-white text-[12px] font-semibold rounded-[2px] inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Add Selected Variant</span>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
