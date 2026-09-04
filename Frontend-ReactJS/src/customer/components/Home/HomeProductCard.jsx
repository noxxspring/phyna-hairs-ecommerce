import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomeProductCard = ({ product }) => {
  const navigate = useNavigate();

  const parsePrice = (val) => {
    if (val === null || val === undefined) return 0;
    if (typeof val === 'number') return val;
    const cleaned = String(val).replace(/[^0-9.]/g, '');
    return parseFloat(cleaned) || 0;
  };

  const originalPrice = parsePrice(product?.price);
  const discountPrice = parsePrice(product?.discountedPrice || product?.discountPrice);

  const hasDiscount = discountPrice > 0 && (originalPrice === 0 || discountPrice < originalPrice);
  const mainSellingPrice = hasDiscount ? discountPrice : (originalPrice > 0 ? originalPrice : discountPrice);
  const strikethroughPrice = (hasDiscount && originalPrice > discountPrice) ? originalPrice : null;

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
      className="cursor-pointer flex flex-col justify-between bg-[#1a1a24] rounded-2xl overflow-hidden border border-white/10 hover:border-[#ff2a85]/50 hover:shadow-2xl transition-all duration-300 w-full max-w-[540px] mx-auto group"
    >
      <div className="h-[360px] w-full relative overflow-hidden bg-[#0d0d14]">
        <img
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          src={imageUrl}
          alt={product?.title || "Product"}
        />
        
        {(product?.laceType || product?.category?.name || product?.topLavelCategory) && (
          <span className="absolute top-3 left-3 bg-[#ff2a85] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
            {String(product?.laceType ? product.laceType : (product?.category?.name || product?.topLavelCategory || "Product")).replace(/_/g, ' ')}
          </span>
        )}
      </div>

      <div className="p-5 w-full flex flex-col justify-between bg-[#1a1a24]">
        <div>
          <p className="text-[11px] font-bold text-[#ff2a85] uppercase tracking-wider">
            {product?.brand || "Phyna Hairs"}
          </p>
          <h3 className="text-base font-semibold text-white line-clamp-1 mt-1 group-hover:text-[#e6c687] transition-colors">
            {product?.title || "Beauty Product"}
          </h3>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
          <div>
            <p className="text-lg font-extrabold text-[#e6c687]">
              ₦{mainSellingPrice.toLocaleString()}
            </p>
            {strikethroughPrice && (
              <p className="text-xs text-gray-500 line-through">
                ₦{strikethroughPrice.toLocaleString()}
              </p>
            )}
          </div>

          <button className="px-4 py-2 bg-white/10 hover:bg-[#ff2a85] text-white text-xs font-semibold rounded-xl transition-all group-hover:bg-[#ff2a85]">
            View Unit
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeProductCard;