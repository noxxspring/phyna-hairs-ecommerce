import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Chip, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddressCard from '../adreess/AdreessCard';
import OrderTraker from './OrderTraker';
import { getOrderById } from '../../../Redux/Customers/Order/Action';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { order } = useSelector((store) => store);
  const currentOrder = order?.order;

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderById(orderId));
    }
  }, [orderId, dispatch]);

  const activeStep = currentOrder?.orderStatus === 'DELIVERED' ? 4 
                   : currentOrder?.orderStatus === 'SHIPPED' ? 3 
                   : currentOrder?.orderStatus === 'CONFIRMED' ? 2 
                   : 1;

  return (
    <div className="bg-[#08080c] text-white min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <button onClick={() => navigate('/account/order')} className="flex items-center space-x-2 text-xs font-bold text-[#e6c687] hover:text-[#ff2a85] transition-colors">
            <ArrowBackIcon className="!text-sm" />
            <span>Back to My Orders</span>
          </button>
          <span className="font-mono text-xs text-gray-400">ID: <strong className="text-white">{currentOrder?.orderId || orderId}</strong></span>
        </div>

        {/* 1. VISUAL ORDER TRACKER */}
        <div className="p-8 rounded-3xl bg-[#12121a] border border-white/10 shadow-2xl">
          <h3 className="text-lg font-serif font-bold text-[#e6c687] mb-6">Order Status Tracking</h3>
          <OrderTraker activeStep={activeStep} />
        </div>

        {/* 2. SHIPPING ADDRESS CARD */}
        {currentOrder?.shippingAddress && (
          <div className="p-6 rounded-3xl bg-[#12121a] border border-white/10 shadow-2xl">
            <h3 className="text-lg font-serif font-bold text-[#e6c687] mb-4">Delivery Address</h3>
            <AddressCard address={currentOrder.shippingAddress} />
          </div>
        )}

        {/* 3. ORDER ITEMS LIST */}
        <div className="p-6 rounded-3xl bg-[#12121a] border border-white/10 shadow-2xl space-y-4">
          <h3 className="text-lg font-serif font-bold text-[#e6c687] border-b border-white/10 pb-3">Purchased Items</h3>
          
          {currentOrder?.orderItems?.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center space-x-4">
                <img
                  src={item?.product?.imageUrl || item?.product?.image}
                  alt={item?.product?.title}
                  className="w-16 h-20 object-cover object-top rounded-xl border border-white/10"
                />
                <div>
                  <h4 className="text-sm font-semibold text-white">{item?.product?.title}</h4>
                  <p className="text-xs text-gray-400">Option: <span className="text-[#e6c687]">{item?.size}</span></p>
                  <p className="text-xs text-gray-400">Quantity: {item?.quantity}</p>
                </div>
              </div>
              <p className="text-base font-bold text-[#ff2a85]">₦{(item?.discountedPrice || item?.price || 0).toLocaleString()}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default OrderDetails;