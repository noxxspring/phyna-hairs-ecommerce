import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, CircularProgress, Alert, Box } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import axios from 'axios';

import { API_BASE_URL } from '../../../config/api';
import { getOrderById } from '../../../Redux/Customers/Order/Action';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const searchParams = new URLSearchParams(location.search);
  const status = searchParams.get('status');
  const txRef = searchParams.get('tx_ref');
  const transactionId = searchParams.get('transaction_id');

  const { order } = useSelector((store) => store);
  const currentOrder = order?.order;

  useEffect(() => {
    const verifyPayment = async () => {
      if (!transactionId || !txRef) {
        setLoading(false);
        setErrorMessage('Missing transaction details from payment gateway.');
        return;
      }

      try {
        const token = localStorage.getItem('jwt');
        const response = await axios.get(
          `${API_BASE_URL}/api/payments/flutterwave/callback?status=${status}&tx_ref=${txRef}&transaction_id=${transactionId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (response.data?.status) {
          setIsVerified(true);
          
          // Extract base order ID (e.g. PHYNA-ORD-XXXX_172810 -> PHYNA-ORD-XXXX)
          const baseOrderId = txRef.contains('_') ? txRef.split('_')[0] : txRef;
          dispatch(getOrderById(baseOrderId));
        } else {
          setErrorMessage('Payment verification failed.');
        }
      } catch (error) {
        setErrorMessage(error.response?.data?.message || 'Payment verification failed.');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [location.search, status, txRef, transactionId, dispatch]);

  if (loading) {
    return (
      <div className="bg-[#08080c] min-h-screen text-white flex flex-col items-center justify-center space-y-4">
        <CircularProgress sx={{ color: '#ff2a85' }} size={60} />
        <h2 className="text-xl font-serif text-[#e6c687]">Verifying Your Flutterwave Payment...</h2>
        <p className="text-xs text-gray-400 font-light">Please wait while we confirm your order with the bank.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#08080c] text-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {isVerified ? (
          /* SUCCESS STATE */
          <div className="p-8 sm:p-12 rounded-3xl bg-[#12121a] border border-white/10 shadow-2xl text-center space-y-6">
            <CheckCircleOutlineIcon sx={{ fontSize: 80, color: '#10b981' }} />
            
            <div>
              <span className="text-xs font-bold text-[#e6c687] uppercase tracking-widest">✦ Order Confirmed ✦</span>
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white mt-1">Payment Successful!</h1>
              <p className="text-xs text-gray-400 font-light mt-2">
                Thank you for shopping with Phyna Hairs. Your payment has been received and your wig unit is now being processed.
              </p>
            </div>

            <Alert severity="success" sx={{ bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', width: 'fit-content', mx: 'auto', borderRadius: '50px' }}>
              Transaction Reference: <strong className="font-mono">{txRef}</strong>
            </Alert>

            {/* ORDER BREAKDOWN SUMMARY */}
            {currentOrder && (
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-left space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Order ID:</span>
                  <span className="font-mono text-[#e6c687] font-bold">{currentOrder.orderId || currentOrder.id}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Total Paid:</span>
                  <span className="font-bold text-[#ff2a85]">₦{(currentOrder.totalDiscountedPrice || currentOrder.totalPrice || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Payment Status:</span>
                  <span className="text-green-400 font-bold">COMPLETED (Flutterwave)</span>
                </div>
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                onClick={() => navigate('/account/order')}
                variant="contained"
                startIcon={<ReceiptLongIcon />}
                sx={{ py: 1.5, px: 4, borderRadius: '50px', bgcolor: '#ff2a85', fontWeight: 'bold', '&:hover': { bgcolor: '#d41f6e' } }}
              >
                View My Orders
              </Button>

              <Button
                onClick={() => navigate('/')}
                variant="outlined"
                startIcon={<ShoppingBagIcon />}
                sx={{ py: 1.5, px: 4, borderRadius: '50px', color: '#e6c687', borderColor: 'rgba(230,198,135,0.4)', fontWeight: 'bold' }}
              >
                Continue Shopping
              </Button>
            </div>

          </div>
        ) : (
          /* FAILED STATE */
          <div className="p-8 sm:p-12 rounded-3xl bg-[#12121a] border border-white/10 shadow-2xl text-center space-y-6">
            <ErrorOutlineIcon sx={{ fontSize: 80, color: '#f43f5e' }} />
            
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">Payment Verification Failed</h1>
              <p className="text-xs text-gray-400 font-light mt-2">{errorMessage}</p>
            </div>

            <Button
              onClick={() => navigate('/cart')}
              variant="contained"
              sx={{ py: 1.5, px: 4, borderRadius: '50px', bgcolor: '#ff2a85', fontWeight: 'bold' }}
            >
              Return to Cart & Retry
            </Button>
          </div>
        )}

      </div>
    </div>
  );
};

export default PaymentSuccess;