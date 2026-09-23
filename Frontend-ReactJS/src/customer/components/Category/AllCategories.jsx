import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { API_BASE_URL } from '../../../config/api';

const AllCategories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Guarded Navigation Helper
  const handleProtectedNavigate = (targetPath) => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      navigate('/login');
    } else {
      navigate(targetPath);
    }
  };

  // Fetch all categories live from backend
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/categories/`);
        setCategories(res.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-[#08080c] text-white pt-6 pb-20">
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
          <span className="text-white font-medium">All Categories</span>
        </nav>

        {/* PAGE TITLE */}
        <div className="border-b border-white/10 pb-6">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Shop by Collections & Categories
          </h1>
          <p className="text-sm text-gray-400 mt-2 font-light">
            Explore our full range of luxury wigs, virgin bundles, frontals, and beauty salon services.
          </p>
        </div>

        {/* CATEGORIES GRID */}
        {loading ? (
          <div className="text-center py-20 text-[#e6c687] font-serif">Loading categories...</div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => handleProtectedNavigate(`/category/${cat.id}`)}
                className="group cursor-pointer bg-[#12121a] rounded-2xl overflow-hidden border border-white/5 hover:border-[#e6c687]/50 transition-all duration-300 shadow-lg flex flex-col justify-between"
              >
                <div className="h-48 sm:h-56 w-full overflow-hidden bg-[#08080c] relative">
                  <img
                    src={cat.imageUrl || "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500"}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 text-left space-y-2">
                  <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-[#e6c687] transition-colors truncate">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="text-xs text-gray-400 line-clamp-2 font-light leading-relaxed">
                      {cat.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-2 text-xs font-semibold text-[#e6c687] group-hover:text-[#ff2a85] transition-colors">
                    <span>Explore Collection</span>
                    <ArrowForwardIcon className="!text-xs group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#12121a] rounded-2xl text-gray-400">
            No categories available.
          </div>
        )}

      </div>
    </div>
  );
};

export default AllCategories;