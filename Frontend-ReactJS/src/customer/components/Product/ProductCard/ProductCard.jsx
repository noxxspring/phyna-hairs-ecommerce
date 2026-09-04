import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  // Smart Price Calculator
  const parsePrice = (val) => {
    if (val === null || val === undefined) return 0;
    if (typeof val === 'number') return val;
    const cleaned = String(val).replace(/[^0-9.]/g, '');
    return parseFloat(cleaned) || 0;
  };

  const originalPrice = parsePrice(product?.price);
  let rawDiscPrice = parsePrice(product?.discountedPrice || product?.discountPrice);
  const discPercent = parsePrice(product?.discountPercent || product?.discountedPercent);

  // If discount is a small digit (< 100) while original price is large (> 1000), calculate actual sale price
  if (rawDiscPrice > 0 && rawDiscPrice <= 99 && originalPrice > 1000) {
    rawDiscPrice = originalPrice - (originalPrice * (rawDiscPrice / 100));
  } else if (discPercent > 0 && discPercent < 100 && (rawDiscPrice === 0 || rawDiscPrice === originalPrice)) {
    rawDiscPrice = originalPrice - (originalPrice * (discPercent / 100));
  }

  const hasDiscount = rawDiscPrice > 0 && rawDiscPrice < originalPrice;
  const mainSellingPrice = hasDiscount ? rawDiscPrice : (originalPrice > 0 ? originalPrice : rawDiscPrice);
  const strikethroughPrice = (hasDiscount && originalPrice > rawDiscPrice) ? originalPrice : null;

  const imageUrl = product?.imageUrl || product?.image || "https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=800&auto=format&fit=crop";

  const handleCardClick = (e) => {
    e.stopPropagation();
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      navigate('/login');
    } else {
      navigate(`/product/${product?.id || 1}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="cursor-pointer flex flex-col justify-between bg-[#12121a] rounded-2xl overflow-hidden border border-white/10 hover:border-[#ff2a85]/50 hover:shadow-2xl transition-all duration-300 w-full group"
    >
      <div className="h-[280px] sm:h-[320px] w-full relative overflow-hidden bg-[#08080c]">
        <img
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          src={imageUrl}
          alt={product?.title || "Product"}
        />
        
        <span className="absolute top-3 left-3 bg-[#ff2a85] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
          {product?.category?.name || "Beauty Product"}
        </span>

        {hasDiscount && (
          <span className="absolute top-3 right-3 bg-[#e6c687] text-black text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-md">
            SALE
          </span>
        )}
      </div>

      <div className="p-4 w-full flex flex-col justify-between flex-grow bg-[#12121a]">
        <div>
          <p className="text-[11px] font-bold text-[#ff2a85] uppercase tracking-wider">
            {product?.brand || "Phyna Hairs"}
          </p>
          <h3 className="text-sm font-semibold text-white line-clamp-2 mt-1 leading-snug group-hover:text-[#e6c687] transition-colors">
            {product?.title || "Product Unit"}
          </h3>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
          <div>
            <p className="text-base font-extrabold text-[#e6c687]">
              ₦{Math.round(mainSellingPrice).toLocaleString()}
            </p>
            {strikethroughPrice && (
              <p className="text-[11px] text-gray-500 line-through">
                ₦{Math.round(strikethroughPrice).toLocaleString()}
              </p>
            )}
          </div>

          <button className="px-3.5 py-1.5 bg-white/10 group-hover:bg-[#ff2a85] text-white text-xs font-semibold rounded-xl transition-all">
            View Unit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;