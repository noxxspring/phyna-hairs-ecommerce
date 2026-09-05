import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../Product/ProductCard/ProductCard';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

const API_BASE_URL = 'http://208.68.39.160:9000';

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [categoryInfo, setCategoryInfo] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      setLoading(true);
      try {
        // 1. Fetch Category Info
        const catRes = await axios.get(`${API_BASE_URL}/api/categories/${categoryId}`);
        setCategoryInfo(catRes.data);

        // 2. Fetch Category Products
        const prodRes = await axios.get(`${API_BASE_URL}/api/products/category/${categoryId}`);
        setProducts(prodRes.data || []);
      } catch (error) {
        console.error("Error loading category products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchCategoryAndProducts();
    }
  }, [categoryId]);

  return (
    <div className="bg-[#08080c] text-white min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* LUXURY CATEGORY HERO BANNER */}
        <div className="relative rounded-3xl overflow-hidden border border-[#ff2a85]/30 p-8 sm:p-12 bg-gradient-to-r from-[#1f0016] via-[#120010] to-[#08080c] shadow-2xl">
          
          <button 
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-xs font-bold text-[#e6c687] hover:text-[#ff2a85] transition-colors mb-6"
          >
            <ArrowBackIcon className="!text-sm" />
            <span>Back to Storefront</span>
          </button>

          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="space-y-3 text-center md:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#ff2a85]/10 border border-[#ff2a85]/30 text-[#ff2a85] text-xs font-semibold uppercase tracking-wider">
                <AutoAwesomeIcon className="!text-sm text-[#e6c687]" />
                <span>Featured Collection</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
                {categoryInfo?.name || "Category Products"}
              </h1>

              <p className="text-sm text-gray-300 font-light max-w-xl leading-relaxed">
                {categoryInfo?.description || "Explore our luxury hand-picked collection crafted with perfection."}
              </p>

              <div className="pt-2 text-xs text-[#e6c687] font-bold">
                Showing {products.length} Items Available
              </div>
            </div>

            {/* Category Cover Photo */}
            {categoryInfo?.imageUrl && (
              <div className="flex-shrink-0">
                <img 
                  src={categoryInfo.imageUrl} 
                  alt={categoryInfo.name} 
                  className="w-36 h-36 sm:w-48 sm:h-48 object-cover rounded-2xl border-2 border-[#e6c687]/40 shadow-2xl shadow-[#ff2a85]/20" 
                />
              </div>
            )}
          </div>
        </div>

        {/* PRODUCTS GRID */}
        {loading ? (
          <div className="text-center py-20 text-[#e6c687] font-serif text-lg">Loading category items...</div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        ) : (
          /* EMPTY CATEGORY STATE */
          <div className="text-center py-20 bg-[#12121a] rounded-3xl border border-white/10 space-y-4 max-w-xl mx-auto">
            <ShoppingBagIcon sx={{ fontSize: 50, color: '#ff2a85' }} />
            <h3 className="text-2xl font-serif font-bold text-white">No Products in This Category Yet</h3>
            <p className="text-xs text-gray-400 font-light">
              Our stylists are adding new inventory daily. Check back soon or explore other collections!
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-8 py-3 rounded-full bg-gradient-to-r from-[#ff2a85] to-[#e6c687] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-transform"
            >
              Back to Home
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default CategoryProducts;