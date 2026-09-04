import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';
import axios from 'axios';
import AddressCard from '../adreess/AdreessCard';
import CartItem from '../Cart/CartItem';
import { getOrderById } from '../../../Redux/Customers/Order/Action';
import { API_BASE_URL } from '../../../config/api';

const OrderSummary = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get("order_id");

  const { order } = useSelector((store) => store);
  const currentOrder = order?.order;

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderById(orderId));
    }
  }, [orderId, dispatch]);

  const handleFlutterwavePayment = async () => {
    try {
      const token = localStorage.getItem('jwt');
      const response = await axios.post(
        `${API_BASE_URL}/api/payments/flutterwave/${orderId || currentOrder?.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.payment_url) {
        // Redirect customer to Flutterwave Checkout Page
        window.location.href = response.data.payment_url;
      }
    } catch (error) {
      alert("Error generating payment link: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="bg-[#08080c] text-white min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Shipping Address Summary */}
        <div className="p-6 rounded-3xl bg-[#12121a] border border-white/10 shadow-2xl">
          <h2 className="text-lg font-serif font-bold text-[#e6c687] border-b border-white/10 pb-3 mb-4">
            Shipping Address
          </h2>
          {currentOrder?.shippingAddress && (
            <AddressCard address={currentOrder.shippingAddress} />
          )}
        </div>

        {/* Order Items & Pay Button */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-4">
            {currentOrder?.orderItems?.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="p-6 rounded-3xl bg-[#12121a] border border-white/10 shadow-2xl space-y-6">
              <h2 className="text-lg font-serif font-bold text-[#e6c687] border-b border-white/10 pb-3">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm font-light text-gray-300">
                <div className="flex justify-between">
                  <span>Items Total</span>
                  <span className="text-white font-semibold">₦{(currentOrder?.totalPrice || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className="text-green-400 font-semibold">-₦{(currentOrder?.discount || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-white text-base pt-2 border-t border-white/10">
                  <span>Total Amount</span>
                  <span className="text-[#ff2a85] text-xl">₦{(currentOrder?.totalDiscountedPrice || currentOrder?.totalPrice || 0).toLocaleString()}</span>
                </div>
              </div>

              <Button
                onClick={handleFlutterwavePayment}
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  py: 1.8,
                  borderRadius: '50px',
                  bgcolor: '#ff2a85',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  boxShadow: '0 8px 25px rgba(255, 42, 133, 0.4)',
                  '&:hover': { bgcolor: '#d41f6e' }
                }}
              >
                Pay With Flutterwave
              </Button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default OrderSummary;