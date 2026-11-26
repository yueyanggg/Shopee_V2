import React from 'react';
import { Star, ShoppingCart, Scale, Check, Trash2 } from 'lucide-react';
import { Product } from '../types/marketplace';
import { ProductVisual } from './ProductVisual';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickAdd?: (product: Product) => void;
  cartQty?: number;
  onRemoveFromCart?: (product: Product) => void;
  isCompared?: boolean;
  onToggleCompare?: (product: Product) => void;
  activeCompatibility?: string;
  flashSaleMode?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onQuickAdd,
  cartQty = 0,
  onRemoveFromCart,
  isCompared = false,
  onToggleCompare,
  activeCompatibility,
  flashSaleMode = false,
}) => {
  const wholePrice = product.price.toFixed(2);
  const origPrice = product.originalPrice.toFixed(0);

  const matchingVariant = activeCompatibility
    ? product.variants.options.find((opt) =>
        opt.toLowerCase().includes(activeCompatibility.toLowerCase())
      ) ?? product.variants.options[0]
    : undefined;

  return (
    <div
      onClick={() => onSelect(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(product);
        }
      }}
      className={`shopee-card group relative flex flex-col cursor-pointer overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EE4D2D] ${
        isCompared ? 'ring-1 ring-[#EE4D2D] border-[#EE4D2D]' : ''
      }`}
    >
      {/* 1:1 Studio Thumbnail */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#F9F9F9]">
        <ProductVisual
          kind={product.visual}
          className="transition-transform duration-200 group-hover:scale-[1.03]"
        />

        {/* Top-left Plain-Language Store Verification Tag */}
        {product.isMall ? (
          <span className="absolute top-2 left-0 bg-[#D0011B] text-white text-[10px] font-bold leading-none px-1.5 py-1 rounded-r-[2px] tracking-[0.01em] shadow-xs">
            Official Store
          </span>
        ) : product.isPreferred ? (
          <span className="absolute top-2 left-0 bg-[#EE4D2D] text-white text-[10px] font-bold leading-none px-1.5 py-1 rounded-r-[2px] tracking-[0.01em]">
            Preferred
          </span>
        ) : null}

        {/* Top-right Discount Ribbon */}
        {product.discountPercent > 0 && (
          <div className="discount-ribbon absolute top-0 right-0 w-[36px] bg-[#FFE97A] pt-1 pb-1 text-center">
            <div className="text-[11px] font-bold leading-[12px] text-[#EE4D2D] tabular-nums">
              {product.discountPercent}%
            </div>
            <div className="text-[9px] font-bold leading-[10px] text-[#222222] uppercase">
              OFF
            </div>
          </div>
        )}

        {/* Compare Toggle */}
        {onToggleCompare && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(product);
            }}
            aria-label={
              isCompared
                ? `Remove ${product.title} from comparison`
                : `Add ${product.title} to comparison`
            }
            className={`absolute bottom-2 left-2 px-2 py-1 rounded-[2px] text-[10px] font-semibold inline-flex items-center gap-1 transition-all cursor-pointer shadow-xs ${
              isCompared
                ? 'bg-[#222222] text-white opacity-100'
                : 'bg-white/95 text-[#222222] border border-[#DCDCDC] opacity-90 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 hover:border-[#EE4D2D] hover:text-[#EE4D2D]'
            }`}
          >
            {isCompared ? <Check className="w-3 h-3 text-[#FFE97A]" /> : <Scale className="w-3 h-3" />}
            <span>{isCompared ? 'Shortlisted' : 'Compare'}</span>
          </button>
        )}

        {/* Direct Add OR Direct Remove from Cart (Principle 3: User Control & Freedom) */}
        {cartQty > 0 && onRemoveFromCart ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveFromCart(product);
            }}
            aria-label={`Remove ${product.title} from cart`}
            className="absolute bottom-2 right-2 bg-[#222222] hover:bg-[#D0011B] text-white px-2 py-1 rounded-[2px] shadow-xs flex items-center gap-1 text-[10px] font-semibold cursor-pointer transition-colors"
            title={`In cart (${cartQty}) — Click to remove`}
          >
            <Trash2 className="w-3 h-3" />
            <span>Remove ({cartQty})</span>
          </button>
        ) : (
          onQuickAdd && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickAdd(product);
              }}
              aria-label={`Add ${product.title} to cart`}
              className="absolute bottom-2 right-2 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 transition-opacity duration-150 bg-[#EE4D2D] hover:bg-[#D73211] text-white px-2 py-1 rounded-[2px] shadow-xs flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
            >
              <ShoppingCart className="w-3 h-3" />
              <span>Add</span>
            </button>
          )
        )}
      </div>

      {/* Card Body */}
      <div className="p-2.5 flex flex-col flex-1 justify-between gap-2">
        <div>
          <h3 className="text-[12px] leading-[16px] text-[#222222] font-medium line-clamp-2 min-h-[32px]">
            {product.title}
          </h3>

          <div className="mt-1 text-[11px] leading-[15px] text-[#555555] truncate">
            {matchingVariant ? (
              <span className="text-[#0F766E] font-medium">
                Exact variant: {matchingVariant}
              </span>
            ) : (
              product.keyHighlight
            )}
          </div>
        </div>

        {/* Prominent Price + Offer Condition Adjacent to Price */}
        <div className="pt-1 border-t border-[#F4F4F4] space-y-1">
          <div className="flex items-baseline justify-between gap-1.5">
            <div className="flex items-baseline text-[#EE4D2D] font-display font-extrabold tabular-nums">
              <span className="text-[13px] mr-[1px]">$</span>
              <span className="text-[19px] leading-[22px] tracking-[-0.02em]">
                {wholePrice}
              </span>
            </div>
            <span className="text-[11px] leading-[14px] text-[#888888] line-through tabular-nums">
              ${origPrice}
            </span>
          </div>

          <div className="text-[10px] leading-[13px] text-[#B93815] font-medium truncate">
            {product.offerCondition}
          </div>

          {/* Principle 1 & 4: Absolute Sold & Remaining Stock + Consistent Timeline */}
          {flashSaleMode ? (
            <div className="mt-1 space-y-1">
              <div className="relative h-[15px] w-full rounded-full bg-[#FFBDB8] overflow-hidden">
                <div
                  className="h-full bg-[#EE4D2D] rounded-full transition-all"
                  style={{ width: `${product.flashSaleSoldPercent ?? 70}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold tracking-[0.01em] text-white tabular-nums">
                  {product.soldCount.toLocaleString()} sold · {product.stock} left
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between text-[10px] leading-[13px] text-[#757575] pt-0.5 tabular-nums">
              <span className="inline-flex items-center gap-0.5">
                <Star className="w-2.5 h-2.5 fill-[#FFCE3D] text-[#FFCE3D]" />
                <span className="font-medium text-[#222222]">{product.rating.toFixed(1)}</span>
                <span>·</span>
                <span>{product.soldCount.toLocaleString()} sold</span>
              </span>
              <span className="text-[#0F766E] font-medium">{product.stock} left</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
