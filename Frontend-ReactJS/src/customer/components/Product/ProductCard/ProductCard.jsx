import React from 'react';
import { useNavigate } from 'react-router-dom';

/* Helper function to resolve real Cloudinary image URL */
const getProductImage = (product) => {
  if (!product) return "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500";
  if (product.imageUrl) return product.imageUrl;
  if (product.image) return product.image;
  if (product.image_url) return product.image_url;
  if (Array.isArray(product.images) && product.images.length > 0) return product.images[0];
  return "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500";
};

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const price = product?.discountedPrice || product?.price || 0;

  return (
    <div
      onClick={() => navigate(`/product/${product?.id}`)}
      className="group cursor-pointer bg-[#12121a] rounded-2xl overflow-hidden border border-white/5 hover:border-[#e6c687]/40 transition-all duration-300 flex flex-col justify-between"
    >
      <div className="relative h-52 sm:h-60 w-full bg-[#08080c] overflow-hidden">
        <img
          src={getProductImage(product)}
          alt={product?.title || product?.name || 'Product'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-4 text-left space-y-1">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block truncate">
          {product?.brand || product?.color || 'PREMIUM HAIR'}
        </span>

        <h4 className="text-xs sm:text-sm font-bold text-white uppercase truncate group-hover:text-[#e6c687] transition-colors">
          {product?.title || product?.name || 'HAIR PRODUCT'}
        </h4>

        <div className="flex items-center space-x-2 pt-1">
          <span className="text-sm sm:text-base font-bold text-[#e6c687]">
            ₦{price.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;