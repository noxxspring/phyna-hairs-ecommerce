import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Divider } from '@mui/material';
import CartItem from './CartItem';
import { getCart } from '../../../Redux/Customers/Cart/Action';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart } = useSelector((store) => store);

  const cartData = cart?.cart;
  const cartItems = cartData?.cartItems ? Array.from(cartData.cartItems) : [];

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch, cart?.updateCartItem, cart?.deleteCartItem]);

  const handleCheckout = () => {
    navigate('/checkout?step=2');
  };

  return (
    <div className="bg-[#08080c] text-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div>
            <span className="text-xs font-bold text-[#ff2a85] uppercase tracking-widest">✦ Shopping Bag ✦</span>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white mt-1">Your Selected Hair Units</h1>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-xs font-bold text-[#e6c687] hover:text-[#ff2a85] uppercase tracking-wider transition-colors"
          >
            <ArrowBackIcon className="!text-sm" />
            <span>Continue Shopping</span>
          </button>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* 1. CART ITEMS LIST */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <CartItem key={item?.id} item={item} />
              ))}
            </div>

            {/* 2. ORDER PRICE SUMMARY */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 p-6 rounded-3xl bg-[#12121a] border border-white/10 shadow-2xl space-y-6">
                <h2 className="text-lg font-serif font-bold text-[#e6c687] border-b border-white/10 pb-3">
                  Price Details
                </h2>

                <div className="space-y-4 text-sm font-light text-gray-300">
                  <div className="flex justify-between">
                    <span>Price ({cartData?.totalItem || 0} items)</span>
                    <span className="text-white font-semibold">₦{(cartData?.totalPrice || 0).toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Discount</span>
                    <span className="text-green-400 font-semibold">-₦{(cartData?.discount || 0).toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    <span className="text-green-400 font-semibold">Free</span>
                  </div>

                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                  <div className="flex justify-between text-base font-bold text-white pt-1">
                    <span>Total Payable Amount</span>
                    <span className="text-[#ff2a85] text-xl">₦{(cartData?.totalDiscountedPrice || cartData?.totalPrice || 0).toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  variant="contained"
                  fullWidth
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    py: 1.8,
                    borderRadius: '50px',
                    bgcolor: '#ff2a85',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    boxShadow: '0 8px 25px rgba(255, 42, 133, 0.4)',
                    '&:hover': { bgcolor: '#d41f6e' },
                  }}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>

          </div>
        ) : (
          /* EMPTY CART STATE */
          <div className="text-center py-20 bg-[#12121a] rounded-3xl border border-white/10 space-y-4 max-w-xl mx-auto">
            <ShoppingBagIcon sx={{ fontSize: 60, color: '#ff2a85' }} />
            <h2 className="text-2xl font-serif font-bold text-white">Your Shopping Cart is Empty</h2>
            <p className="text-xs text-gray-400 font-light max-w-sm mx-auto">
              Explore our luxury collection of 100% Virgin Hair wigs, HD lace frontals, and bundles.
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-8 py-3 rounded-full bg-gradient-to-r from-[#ff2a85] to-[#e6c687] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-transform"
            >
              Explore Wig Collection
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Cart;