import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HomeCarousel from '../customer/components/Carousel/HomeCarousel';
import { homeCarouselData } from '../customer/components/Carousel/HomeCaroselData';
import HomeProductSection from '../customer/components/Home/HomeProductSection';

// Material UI Icons
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { API_BASE_URL } from '../config/api';


const Homepage = () => {
  const navigate = useNavigate();
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const [categoryProductsMap, setCategoryProductsMap] = useState({});
  const [loading, setLoading] = useState(true);

  // Guarded Navigation Helper (Prompts guest to log in if not authenticated)
  const handleProtectedNavigate = (targetPath) => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      navigate('/login');
    } else {
      navigate(targetPath);
    }
  };

  // Fetch Featured Categories & their Products live from PostgreSQL
  useEffect(() => {
    const loadDynamicHomepageData = async () => {
      setLoading(true);
      try {
        // 1. Fetch categories from Spring Boot API
        const catRes = await axios.get(`${API_BASE_URL}/api/categories/featured`);
        const cats = catRes.data || [];
        setFeaturedCategories(cats);

        // 2. Fetch products for each featured category
        const prodMap = {};
        for (const cat of cats) {
          try {
            const prodRes = await axios.get(`${API_BASE_URL}/api/products/category/${cat.id}`);
            prodMap[cat.id] = (prodRes.data || []).slice(0, 4); // Top 4 items per section
          } catch (e) {
            prodMap[cat.id] = [];
          }
        }
        setCategoryProductsMap(prodMap);
      } catch (error) {
        console.error("Error fetching homepage dynamic data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDynamicHomepageData();
  }, []);

  return (
    <div className="min-h-screen bg-[#08080c] text-white overflow-x-hidden">
      
      {/* 1. Hero Banner Slider */}
      <div className="relative border-b border-white/10">
        <HomeCarousel images={homeCarouselData} />
      </div>

      {/* 2. DYNAMIC CATEGORIES & PRODUCT SECTIONS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

        {loading ? (
          <div className="text-center py-20 text-[#e6c687] font-serif">Loading shop collections...</div>
        ) : featuredCategories.length > 0 ? (
          featuredCategories.map((cat) => (
            <div key={cat.id}>
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/10">
                <div>
                  <span className="text-xs font-bold text-[#ff2a85] uppercase tracking-widest">✦ Collection ✦</span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">✨ {cat.name}</h2>
                </div>
                <button
                  onClick={() => handleProtectedNavigate(`/category/${cat.id}`)}
                  className="flex items-center space-x-2 text-xs font-bold text-[#e6c687] hover:text-[#ff2a85] uppercase tracking-wider transition-colors group"
                >
                  <span>Explore More</span>
                  <ArrowForwardIcon className="!text-sm group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Product Section for this Category */}
              <HomeProductSection data={categoryProductsMap[cat.id] || []} />
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-[#12121a] rounded-3xl border border-white/10 space-y-3">
            <h3 className="text-xl font-serif font-bold text-white">No Categories Created Yet</h3>
            <p className="text-xs text-gray-400 font-light">Go to Admin Dashboard $\rightarrow$ Categories to create your first category!</p>
          </div>
        )}

        {/* VIP SALON BOOKING BANNER */}
        <div className="relative rounded-3xl overflow-hidden border border-[#ff2a85]/40 bg-gradient-to-r from-[#1f0016] via-[#120010] to-[#08080c] p-8 sm:p-12 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            <div className="space-y-3 text-center lg:text-left max-w-xl">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#e6c687]">
                ✦ Exclusive Salon Service ✦
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                Book Your Custom Wig Installation
              </h2>
              <p className="text-gray-300 text-sm">
                Get your unit professionally installed by our master stylists. Includes hairline plucking, bleached knots, and glueless melting.
              </p>
            </div>
            <button
              onClick={() => handleProtectedNavigate('/salon')}
              className="flex items-center space-x-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#ff2a85] to-[#e6c687] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-transform"
            >
              <CalendarMonthIcon className="!text-base" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Homepage;