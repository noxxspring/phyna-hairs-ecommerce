import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Customer Components
import HomeCarousel from '../customer/components/Carousel/HomeCarousel';
import { homeCarouselData } from '../customer/components/Carousel/HomeCaroselData';
import { API_BASE_URL } from '../config/api';

// Material UI Icons
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';

/* Smart Helper to resolve real Cloudinary image URL */
const getProductImage = (product) => {
  if (!product) return "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500";

  if (product.imageUrl && typeof product.imageUrl === 'string' && product.imageUrl.trim() !== '') {
    return product.imageUrl;
  }
  if (product.image && typeof product.image === 'string' && product.image.trim() !== '') {
    return product.image;
  }
  if (product.image_url && typeof product.image_url === 'string' && product.image_url.trim() !== '') {
    return product.image_url;
  }

  if (Array.isArray(product.images) && product.images.length > 0) {
    const firstImg = product.images[0];
    return typeof firstImg === 'string' ? firstImg : (firstImg?.imageUrl || firstImg?.url);
  }

  return "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500";
};

const Homepage = () => {
  const navigate = useNavigate();
  
  // Data States
  const [categories, setCategories] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Protected / Guest Navigation Helper
  const handleProtectedNavigate = (targetPath) => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      navigate('/login');
    } else {
      navigate(targetPath);
    }
  };

  // Fetch Live Homepage Data from Backend
  useEffect(() => {
    const fetchHomepageData = async () => {
      setLoading(true);
      try {
        const catRes = await axios.get(`${API_BASE_URL}/api/categories/`);
        setCategories(catRes.data || []);

        const [bestRes, newRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/products/best-sellers`),
          axios.get(`${API_BASE_URL}/api/products/new-arrivals`)
        ]);

        setBestSellers(bestRes.data || []);
        setNewArrivals(newRes.data || []);

      } catch (error) {
        console.error("Error loading homepage dynamic data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomepageData();
  }, []);

  return (
    <div className="min-h-screen bg-[#08080c] text-white overflow-x-hidden pb-20">
      
      {/* 1. HERO BANNER SLIDER */}
      <div className="relative border-b border-white/10">
        <HomeCarousel images={homeCarouselData} />
      </div>

      {/* 2. WHITE SUB-NAVBAR / QUICK ACTION BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-16 sm:mb-20">
        <div 
          onClick={() => handleProtectedNavigate('/products')}
          className="group cursor-pointer bg-white rounded-2xl py-6 px-6 sm:px-10 shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 text-black group-hover:text-gray-500 transition-colors duration-300">
              <ShoppingBagOutlinedIcon className="!text-xl sm:!text-2xl text-black group-hover:text-gray-500 transition-colors duration-300" />
              <span className="font-semibold text-sm sm:text-base tracking-wide text-black group-hover:text-gray-500 transition-colors duration-300">
                Shop All Products
              </span>
            </div>
            
            <div className="flex items-center space-x-2 text-black group-hover:text-gray-500 transition-colors duration-300 text-xs sm:text-sm font-medium tracking-wide">
              <span className="text-black group-hover:text-gray-500 transition-colors duration-300">
                Browse entire collection
              </span>
              <ArrowForwardIcon className="!text-sm text-black group-hover:text-gray-500 group-hover:translate-x-1 transition-all duration-300" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. SHOP BY CATEGORY */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 sm:mb-28">
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-white/10">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">Shop by Category</h2>
          <button
            onClick={() => handleProtectedNavigate('/categories')}
            className="flex items-center space-x-1 text-xs font-semibold text-gray-400 hover:text-[#e6c687] transition-colors uppercase tracking-wider"
          >
            <span>View All</span>
            <ArrowForwardIcon className="!text-xs" />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-[#e6c687] font-serif">Loading categories...</div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => handleProtectedNavigate(`/category/${cat.id}`)}
                className="group cursor-pointer bg-[#12121a] rounded-2xl overflow-hidden border border-white/5 hover:border-[#e6c687]/40 transition-all duration-300"
              >
                <div className="h-36 sm:h-44 w-full overflow-hidden bg-[#08080c] relative">
                  <img
                    src={cat.imageUrl || "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500"}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 text-left">
                  <h3 className="font-semibold text-sm sm:text-base text-white group-hover:text-[#e6c687] transition-colors truncate">
                    {cat.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-[#12121a] rounded-2xl text-gray-400 text-xs">
            No categories found.
          </div>
        )}
      </div>

      {/* 4. BEST SELLERS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-20 sm:my-28">
        <div className="bg-[#2f313d] rounded-3xl p-8 sm:p-12 shadow-2xl">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-white/20">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">Best Sellers</h2>
            <button
              onClick={() => handleProtectedNavigate('/products')}
              className="flex items-center space-x-1 text-xs font-semibold text-[#e6c687] hover:text-[#ff2a85] transition-colors uppercase tracking-wider"
            >
              <span>Shop All</span>
              <ArrowForwardIcon className="!text-xs" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.map((item, idx) => (
              <ProductCardItem key={item.id || idx} product={item} onNavigate={handleProtectedNavigate} />
            ))}
          </div>
        </div>
      </div>

      {/* 5. NEW ARRIVALS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-20 sm:my-28">
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-white/10">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">New Arrivals</h2>
          <button
            onClick={() => handleProtectedNavigate('/products')}
            className="flex items-center space-x-1 text-xs font-semibold text-gray-400 hover:text-[#e6c687] transition-colors uppercase tracking-wider"
          >
            <span>View All</span>
            <ArrowForwardIcon className="!text-xs" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.map((item, idx) => (
            <ProductCardItem key={item.id || idx} product={item} onNavigate={handleProtectedNavigate} />
          ))}
        </div>
      </div>

      {/* 6. WHY SHOP WITH US */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-12 pb-6 border-t border-white/10 text-center">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-8">
          Why Shop With Us
        </span>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#e6c687]">100%</h3>
            <p className="text-xs text-gray-300">Authentic Products</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#e6c687]">24/7</h3>
            <p className="text-xs text-gray-300">Customer Support</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#e6c687]">Fast</h3>
            <p className="text-xs text-gray-300">Nationwide Delivery</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#e6c687]">Secure</h3>
            <p className="text-xs text-gray-300">Payment Gateway</p>
          </div>
        </div>
      </div>

    </div>
  );
};

/* Reusable Product Card Component without Discount Badge */
const ProductCardItem = ({ product, onNavigate }) => {
  const displayPrice = product?.discountedPrice || product?.price || 0;

  return (
    <div
      onClick={() => onNavigate(`/product/${product.id}`)}
      className="group cursor-pointer bg-[#12121a] rounded-2xl overflow-hidden border border-white/5 hover:border-[#e6c687]/40 transition-all duration-300 flex flex-col justify-between"
    >
      <div className="relative h-44 sm:h-56 w-full bg-[#08080c] overflow-hidden">
        <img
          src={getProductImage(product)}
          alt={product.title || product.name || 'Product'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-4 text-left space-y-1">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block truncate">
          {product.brand || product.color || 'PREMIUM HAIR'}
        </span>

        <h4 className="text-xs sm:text-sm font-bold text-white uppercase truncate group-hover:text-[#e6c687] transition-colors">
          {product.title || product.name || 'HAIR PRODUCT'}
        </h4>

        <div className="flex items-center space-x-2 pt-1">
          <span className="text-sm sm:text-base font-bold text-[#e6c687]">
            ₦{displayPrice.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Homepage;