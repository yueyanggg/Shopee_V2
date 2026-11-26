import React from 'react';
import { ShieldCheck, Truck, CreditCard, RotateCcw } from 'lucide-react';
import { ScreenView } from '../types/marketplace';

interface FooterProps {
  onNavigate: (screen: ScreenView) => void;
  onQuickFilter: (type: 'mall' | 'flash' | 'freeShipping' | 'all') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onQuickFilter }) => {
  return (
    <footer className="bg-[#FBFBFB] border-t-4 border-[#EE4D2D] mt-10 text-[#555555]">
      {/* Trust Pillars Bar */}
      <div className="bg-white border-b border-[#EBEBEB]">
        <div className="max-w-[1200px] mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFF5F1] text-[#EE4D2D] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[13px] font-semibold text-[#222222]">Shopee Guarantee</div>
              <div className="text-[12px] text-[#757575]">Payment released after delivery</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFF5F1] text-[#EE4D2D] flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[13px] font-semibold text-[#222222]">15-Day Free Returns</div>
              <div className="text-[12px] text-[#757575]">Hassle-free Mall returns</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFF5F1] text-[#EE4D2D] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[13px] font-semibold text-[#222222]">Next-Day Express</div>
              <div className="text-[12px] text-[#757575]">Free shipping from $15</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFF5F1] text-[#EE4D2D] flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[13px] font-semibold text-[#222222]">Secure Checkout</div>
              <div className="text-[12px] text-[#757575]">ShopeePay, Cards &amp; COD</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Directory Columns */}
      <div className="max-w-[1200px] mx-auto px-4 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8 text-[12px]">
        <div>
          <h3 className="font-bold text-[#222222] uppercase mb-3 tracking-[0.02em]">
            Customer Service
          </h3>
          <ul className="space-y-2">
            <li>
              <button
                type="button"
                onClick={() => onNavigate('orders')}
                className="hover:text-[#EE4D2D] cursor-pointer"
              >
                Track My Order
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onNavigate('cart')}
                className="hover:text-[#EE4D2D] cursor-pointer"
              >
                Shopping Cart &amp; Vouchers
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onQuickFilter('freeShipping')}
                className="hover:text-[#EE4D2D] cursor-pointer"
              >
                Free Shipping Program
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onQuickFilter('mall')}
                className="hover:text-[#EE4D2D] cursor-pointer"
              >
                15-Day Mall Return Policy
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-[#222222] uppercase mb-3 tracking-[0.02em]">
            Marketplace
          </h3>
          <ul className="space-y-2">
            <li>
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="hover:text-[#EE4D2D] cursor-pointer"
              >
                Daily Discover
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onQuickFilter('flash')}
                className="hover:text-[#EE4D2D] cursor-pointer"
              >
                Flash Sale Deals
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onQuickFilter('mall')}
                className="hover:text-[#EE4D2D] cursor-pointer"
              >
                Official Brand Stores
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onQuickFilter('all')}
                className="hover:text-[#EE4D2D] cursor-pointer"
              >
                All Product Categories
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-[#222222] uppercase mb-3 tracking-[0.02em]">
            Payment Partners
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {['ShopeePay', 'VISA', 'Mastercard', 'AMEX', 'PayNow', 'COD'].map((p) => (
              <span
                key={p}
                className="px-2 py-1 bg-white border border-[#EBEBEB] rounded-[2px] text-[11px] font-medium text-[#222222]"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-[#222222] uppercase mb-3 tracking-[0.02em]">
            Logistics
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {['Shopee Express', 'Ninja Van', 'J&T Express', 'SingPost', 'SPX Locker'].map(
              (l) => (
                <span
                  key={l}
                  className="px-2 py-1 bg-white border border-[#EBEBEB] rounded-[2px] text-[11px] font-medium text-[#222222]"
                >
                  {l}
                </span>
              )
            )}
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-[#EBEBEB] bg-[#F5F5F5]">
        <div className="max-w-[1200px] mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[12px] text-[#757575]">
          <span>&copy; 2026 Shopee Marketplace Desktop. All Rights Reserved.</span>
          <span>Country &amp; Region: Singapore · Malaysia · Thailand · Indonesia · Vietnam · Philippines</span>
        </div>
      </div>
    </footer>
  );
};
