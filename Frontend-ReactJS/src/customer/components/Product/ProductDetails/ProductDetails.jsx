import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Rating, Button, Grid, Typography, Alert } from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ShieldCheckIcon from '@mui/icons-material/VerifiedUser';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

import { findProductById } from '../../../../Redux/Customers/Product/Action';
import { addItemToCart } from '../../../../Redux/Customers/Cart/Action';
import ProductReviewCard from './ProductReviewCard';

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { customersProduct } = useSelector((store) => store);
  const product = customersProduct?.product;

  // Selected Customization Options
  const [selectedSize, setSelectedSize] = useState('24 inches');
  const [selectedCapSize, setSelectedCapSize] = useState('Medium (22.5")');
  const [activeImage, setActiveImage] = useState('');
  const [message, setMessage] = useState('');

  // 1. Strict Category Detection (Only returns true IF category name contains "wig")
  const categoryName = (product?.category?.name || product?.topLevelCategory || '').toLowerCase();
  const isWigProduct = categoryName.includes('wig');

  // 2. Safe Image URL Extraction (Handles product.imageUrl or product.image)
  const mainImage = product?.imageUrl || product?.image || "https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=800&auto=format&fit=crop";

  // Gallery array
  const gallery = (product?.galleryUrls && product.galleryUrls.length > 0)
    ? product.galleryUrls
    : [mainImage];

  // Fetch product from backend by ID
  useEffect(() => {
    if (productId) {
      dispatch(findProductById({ productId }));
    }
  }, [productId, dispatch]);

  // Set active main image once product loads
  useEffect(() => {
    if (product) {
      setActiveImage(product?.imageUrl || product?.image || mainImage);
    }
  }, [product, mainImage]);

  // Handle "Add to Cart"
  const handleAddToCart = () => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      navigate('/login');
      return;
    }

    const data = {
      productId: product?.id || Number(productId) || 1,
      size: isWigProduct ? `${selectedSize} / ${selectedCapSize}` : 'Standard Unit',
      quantity: 1,
    };

    dispatch(addItemToCart(data));
    navigate('/cart');
  };

  // Safe Price Formatting
  const displayPrice = product?.discountedPrice || product?.discountPrice || product?.price || 0;
  const numericPrice = typeof displayPrice === 'number' ? displayPrice : (parseFloat(displayPrice) || 0);
  const formattedPrice = numericPrice.toLocaleString();

  return (
    <div className="bg-[#08080c] text-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {message && (
          <Alert severity="success" sx={{ mb: 4, bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            {message}
          </Alert>
        )}

        <Grid container spacing={6}>

          {/* 1. PRODUCT IMAGES GALLERY */}
          <Grid item xs={12} lg={6}>
            <div className="flex flex-col-reverse sm:flex-row gap-4">
              
              {/* Thumbnail List (Only shows if multiple gallery images exist) */}
              {gallery.length > 1 && (
                <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible">
                  {gallery.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`cursor-pointer w-20 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                        activeImage === img ? 'border-[#ff2a85] scale-105' : 'border-white/10 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover object-top" />
                    </div>
                  ))}
                </div>
              )}

              {/* Active Cover Image */}
              <div className="flex-1 h-[450px] sm:h-[550px] rounded-3xl overflow-hidden border border-white/10 bg-[#12121a] relative">
                <img
                  src={activeImage || mainImage}
                  alt={product?.title || "Product Image"}
                  className="w-full h-full object-cover object-top"
                />
                
                <span className="absolute top-4 left-4 bg-[#ff2a85] text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-lg">
                  {product?.category?.name || "Beauty Product"}
                </span>
              </div>

            </div>
          </Grid>

          {/* 2. PRODUCT DETAILS & OPTIONS */}
          <Grid item xs={12} lg={6}>
            <div className="space-y-6">
              
              <div>
                <p className="text-xs font-bold text-[#ff2a85] uppercase tracking-widest">
                  {product?.brand || "Phyna Hairs"}
                </p>
                <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white mt-1 leading-tight">
                  {product?.title || "Product Title"}
                </h1>
              </div>

              {/* RATINGS & REVIEWS */}
              <div className="flex items-center space-x-3">
                <Rating value={4.8} precision={0.5} readOnly size="small" sx={{ color: '#e6c687' }} />
                <span className="text-xs text-gray-400 font-light">(Customer Verified Product)</span>
              </div>

              {/* PRICE */}
              <div className="flex items-baseline space-x-4 pt-2 border-t border-white/10">
                <span className="text-3xl font-extrabold text-[#e6c687]">₦{formattedPrice}</span>
                {product?.price && Number(product.price) > numericPrice && (
                  <span className="text-lg text-gray-500 line-through">₦{Number(product.price).toLocaleString()}</span>
                )}
              </div>

              {/* WIG-ONLY CUSTOMIZATION BOX (Only shows if Category Name contains "wig") */}
              {isWigProduct && (
                <div className="p-4 rounded-2xl bg-[#12121a] border border-white/10 space-y-2">
                  <p className="text-xs font-bold text-[#e6c687] uppercase tracking-wider mb-2 flex items-center">
                    <AutoAwesomeIcon className="!text-sm mr-1" /> Built-in Salon Customization:
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                    <span className="flex items-center"><ShieldCheckIcon className="!text-base text-[#ff2a85] mr-1.5" /> Pre-Plucked Natural Hairline</span>
                    <span className="flex items-center"><ShieldCheckIcon className="!text-base text-[#e6c687] mr-1.5" /> Bleached Invisible Knots</span>
                    <span className="flex items-center"><ShieldCheckIcon className="!text-base text-[#ff2a85] mr-1.5" /> 100% Virgin Human Hair</span>
                    <span className="flex items-center"><ShieldCheckIcon className="!text-base text-[#e6c687] mr-1.5" /> Ready-to-Wear Glueless Cap</span>
                  </div>
                </div>
              )}

              {/* WIG-ONLY LENGTH SELECTOR */}
              {isWigProduct && (
                <div>
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-2">
                    Select Length: <span className="text-[#e6c687]">{selectedSize}</span>
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {['18 inches', '22 inches', '24 inches', '28 inches', '30 inches'].map((len) => (
                      <button
                        key={len}
                        onClick={() => setSelectedSize(len)}
                        className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                          selectedSize === len
                            ? 'bg-[#ff2a85] text-white border-[#ff2a85] shadow-lg shadow-[#ff2a85]/30'
                            : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/30'
                        }`}
                      >
                        {len}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* WIG-ONLY CAP SIZE SELECTOR */}
              {isWigProduct && (
                <div>
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-2">
                    Select Cap Size: <span className="text-[#e6c687]">{selectedCapSize}</span>
                  </label>
                  <div className="flex gap-3">
                    {['Small (21.5")', 'Medium (22.5")', 'Large (23.5")'].map((cap) => (
                      <button
                        key={cap}
                        onClick={() => setSelectedCapSize(cap)}
                        className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                          selectedCapSize === cap
                            ? 'bg-[#e6c687] text-black border-[#e6c687] shadow-lg shadow-[#e6c687]/20'
                            : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/30'
                        }`}
                      >
                        {cap}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ADD TO CART BUTTON */}
              <div className="pt-4">
                <Button
                  onClick={handleAddToCart}
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={<ShoppingBagIcon />}
                  sx={{
                    py: 2,
                    borderRadius: '50px',
                    bgcolor: '#ff2a85',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    boxShadow: '0 10px 25px rgba(255, 42, 133, 0.4)',
                    '&:hover': { bgcolor: '#d41f6e' },
                  }}
                >
                  {isWigProduct ? 'Add Wig to Shopping Cart' : 'Add to Shopping Cart'}
                </Button>
              </div>

              {/* DESCRIPTION */}
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Unit Details & Description</p>
                <p className="text-sm text-gray-300 font-light leading-relaxed">
                  {product?.description || "High quality product crafted with luxury and perfection."}
                </p>
              </div>

            </div>
          </Grid>

        </Grid>

        {/* REVIEWS SECTION */}
        <div className="mt-20 border-t border-white/10 pt-12">
          <Typography variant="h5" fontFamily="serif" fontWeight="bold" sx={{ color: '#e6c687', mb: 4 }}>
            Customer Reviews & Feedback
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <ProductReviewCard />
            </Grid>
          </Grid>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;