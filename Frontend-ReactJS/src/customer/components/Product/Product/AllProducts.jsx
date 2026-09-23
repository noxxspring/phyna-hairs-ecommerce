import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';

// Icons
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { API_BASE_URL } from '../../../../config/api';

/* Helper function to resolve real Cloudinary image URL */
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

const AllProducts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Data States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  // Filter & Sort States
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortBy, setSortBy] = useState('best-selling');
  const [gridCols, setGridCols] = useState(4); // 4 columns grid view

  // Guarded Navigation Helper
  const handleProtectedNavigate = (targetPath) => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      navigate('/login');
    } else {
      navigate(targetPath);
    }
  };

  // Fetch Products live from Spring Boot API (No trailing slash)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/products`);
        const data = response.data?.content || response.data || [];
        setProducts(data);
      } catch (error) {
        console.error("Error fetching all products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle Brand Filter Toggle
  const handleBrandChange = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  // Toggle Wishlist
  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter((id) => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  // Filter Products Logic
  const filteredProducts = products.filter((item) => {
    const price = item.discountedPrice || item.price || 0;

    // Price Filter
    if (selectedPriceRange === '15-50' && (price < 15000 || price > 50000)) return false;
    if (selectedPriceRange === '50-150' && (price < 50000 || price > 150000)) return false;
    if (selectedPriceRange === '150-up' && price < 150000) return false;

    // In Stock Filter
    if (inStockOnly && item.quantity <= 0) return false;

    // Brand Filter
    if (selectedBrands.length > 0) {
      const itemBrand = (item.brand || item.color || '').toUpperCase();
      const matchesBrand = selectedBrands.some((b) => itemBrand.includes(b.toUpperCase()));
      if (!matchesBrand) return false;
    }

    return true;
  });

  // Sorted Products Logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.discountedPrice || a.price || 0;
    const priceB = b.discountedPrice || b.price || 0;

    if (sortBy === 'low-high') return priceA - priceB;
    if (sortBy === 'high-low') return priceB - priceA;
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#08080c] text-white overflow-x-hidden pt-6 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* BREADCRUMBS */}
        <nav className="text-xs text-gray-400 space-x-2">
          <span 
            onClick={() => navigate('/')} 
            className="hover:text-[#e6c687] cursor-pointer transition-colors"
          >
            Home
          </span>
          <span>/</span>
          <span className="text-gray-400">Collections</span>
          <span>/</span>
          <span className="text-white font-medium">All Products</span>
        </nav>

        {/* PAGE TITLE */}
        <div className="border-b border-white/10 pb-6">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            All Products
          </h1>
        </div>

        {/* TOOLBAR: Item Counter, Grid View Toggle & Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#12121a] p-4 rounded-xl border border-white/5">
          <span className="text-xs text-gray-300 font-medium">
            {sortedProducts.length} products
          </span>

          <div className="flex items-center space-x-4">
            {/* Grid Layout Toggles */}
            <div className="flex items-center space-x-1 bg-[#08080c] p-1 rounded-lg border border-white/10">
              <button
                onClick={() => setGridCols(3)}
                className={`p-1.5 rounded transition-colors ${gridCols === 3 ? 'bg-[#e6c687] text-black' : 'text-gray-400 hover:text-white'}`}
              >
                <GridViewIcon className="!text-sm" />
              </button>
              <button
                onClick={() => setGridCols(4)}
                className={`p-1.5 rounded transition-colors ${gridCols === 4 ? 'bg-[#e6c687] text-black' : 'text-gray-400 hover:text-white'}`}
              >
                <ViewListIcon className="!text-sm" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-[#08080c] text-xs text-white border border-white/10 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:border-[#e6c687] cursor-pointer"
              >
                <option value="best-selling">Sort: Best Selling</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
              <KeyboardArrowDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 !text-xs text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* SHOP BY PRICE QUICK PILLS */}
        <div className="flex flex-wrap items-center gap-3 py-2 border-b border-white/10">
          <span className="text-xs font-bold text-[#e6c687] uppercase tracking-wider mr-2">
            SHOP BY PRICE:
          </span>

          <button
            onClick={() => setSelectedPriceRange('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedPriceRange === 'all'
                ? 'bg-[#e6c687] text-black font-bold'
                : 'bg-[#12121a] text-gray-300 border border-white/10 hover:border-[#e6c687]'
            }`}
          >
            All Prices
          </button>

          <button
            onClick={() => setSelectedPriceRange('15-50')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedPriceRange === '15-50'
                ? 'bg-[#e6c687] text-black font-bold'
                : 'bg-[#12121a] text-gray-300 border border-white/10 hover:border-[#e6c687]'
            }`}
          >
            ₦15,000 – ₦50,000
          </button>

          <button
            onClick={() => setSelectedPriceRange('50-150')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedPriceRange === '50-150'
                ? 'bg-[#e6c687] text-black font-bold'
                : 'bg-[#12121a] text-gray-300 border border-white/10 hover:border-[#e6c687]'
            }`}
          >
            ₦50,000 – ₦150,000
          </button>

          <button
            onClick={() => setSelectedPriceRange('150-up')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedPriceRange === '150-up'
                ? 'bg-[#e6c687] text-black font-bold'
                : 'bg-[#12121a] text-gray-300 border border-white/10 hover:border-[#e6c687]'
            }`}
          >
            ₦150,000 & up
          </button>
        </div>

        {/* MAIN BODY: SIDEBAR + PRODUCT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-4">

          {/* LEFT SIDEBAR FILTERS */}
          <div className="space-y-8 bg-[#12121a] p-6 rounded-2xl border border-white/5 h-fit">
            
            {/* AVAILABILITY */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
                Availability
              </h3>
              <label className="flex items-center space-x-3 text-xs text-gray-300 cursor-pointer hover:text-white transition-colors">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-white/20 bg-[#08080c] text-[#ff2a85] focus:ring-0 cursor-pointer"
                />
                <span>In stock only</span>
              </label>
            </div>

            {/* BRAND / ORIGIN */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
                Brand
              </h3>
              {['CHINA', 'VIETNAM', 'Vietnam bonestraight'].map((brand) => (
                <label key={brand} className="flex items-center space-x-3 text-xs text-gray-300 cursor-pointer hover:text-white transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandChange(brand)}
                    className="rounded border-white/20 bg-[#08080c] text-[#ff2a85] focus:ring-0 cursor-pointer"
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>

          </div>

          {/* PRODUCT GRID */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-20 text-[#e6c687] font-serif">Loading products...</div>
            ) : sortedProducts.length > 0 ? (
              <div
                className={`grid grid-cols-2 ${
                  gridCols === 3 ? 'md:grid-cols-3' : 'md:grid-cols-3 lg:grid-cols-4'
                } gap-4 sm:gap-6`}
              >
                {sortedProducts.map((product) => {
                  const displayPrice = product.discountedPrice || product.price || 0;
                  const isWishlisted = wishlist.includes(product.id);

                  return (
                    <div
                      key={product.id}
                      className="group bg-[#12121a] rounded-2xl overflow-hidden border border-white/5 hover:border-[#e6c687]/40 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div className="relative h-48 sm:h-56 w-full bg-[#08080c] overflow-hidden">
                        
                        {/* Wishlist Heart Button */}
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors"
                        >
                          {isWishlisted ? (
                            <FavoriteIcon className="!text-sm text-[#ff2a85]" />
                          ) : (
                            <FavoriteBorderIcon className="!text-sm text-white" />
                          )}
                        </button>

                        <img
                          src={getProductImage(product)}
                          alt={product.title || product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                          onClick={() => handleProtectedNavigate(`/product/${product.id}`)}
                        />
                      </div>

                      <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                        <div>
                          {/* Brand Tag */}
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block truncate">
                            {product.brand || product.color || 'CHINA'}
                          </span>

                          {/* Title */}
                          <h4 
                            onClick={() => handleProtectedNavigate(`/product/${product.id}`)}
                            className="text-xs sm:text-sm font-bold text-white uppercase truncate cursor-pointer group-hover:text-[#e6c687] transition-colors"
                          >
                            {product.title || product.name}
                          </h4>

                          {/* Pricing */}
                          <div className="flex items-center space-x-2 pt-1">
                            <span className="text-sm sm:text-base font-bold text-[#e6c687]">
                              ₦{displayPrice.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons: Add to Bag & Details */}
                        <div className="grid grid-cols-2 gap-2 pt-3">
                          <button
                            onClick={() => handleProtectedNavigate('/cart')}
                            className="px-2 py-2 rounded-lg bg-[#27272a] hover:bg-[#ff2a85] text-white text-[11px] font-bold uppercase transition-colors"
                          >
                            Add to Bag
                          </button>
                          <button
                            onClick={() => handleProtectedNavigate(`/product/${product.id}`)}
                            className="px-2 py-2 rounded-lg border border-white/20 hover:border-[#e6c687] text-white text-[11px] font-bold uppercase transition-colors"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 bg-[#12121a] rounded-2xl text-gray-400">
                No products match the selected filters.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default AllProducts;