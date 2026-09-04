import React from 'react';
import { Grid } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useNavigate } from 'react-router-dom';

const OrderCard = ({ item, order }) => {
  const navigate = useNavigate();

  const imageUrl = item?.product?.imageUrl || item?.product?.image || "https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=800&auto=format&fit=crop";

  const isDelivered = order?.orderStatus === "DELIVERED";

  return (
    <div 
      onClick={() => navigate(`/account/order/${order?.id}`)}
      className="cursor-pointer p-5 rounded-2xl bg-[#12121a] border border-white/10 hover:border-[#ff2a85]/50 hover:shadow-2xl transition-all duration-300 text-white group"
    >
      <Grid container spacing={2} alignItems="center">
        
        {/* Product Image & Details */}
        <Grid item xs={12} sm={6}>
          <div className="flex items-center space-x-4">
            <img 
              src={imageUrl} 
              alt={item?.product?.title} 
              className="w-16 h-20 object-cover object-top rounded-xl border border-white/10"
            />
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-[#ff2a85] uppercase tracking-wider">
                {item?.product?.brand || "Phyna Hairs"}
              </p>
              <h3 className="text-sm font-semibold text-white group-hover:text-[#e6c687] transition-colors line-clamp-1">
                {item?.product?.title || "Luxury Hair Unit"}
              </h3>
              <p className="text-xs text-gray-400">
                Option: <span className="text-[#e6c687]">{item?.size || "24 inches"}</span>
              </p>
            </div>
          </div>
        </Grid>

        {/* Price */}
        <Grid item xs={6} sm={2}>
          <p className="text-base font-extrabold text-[#e6c687]">
            ₦{(item?.discountedPrice || item?.price || 0).toLocaleString()}
          </p>
        </Grid>

        {/* Status Indicator */}
        <Grid item xs={6} sm={4}>
          <div className="flex items-center justify-end space-x-2">
            <FiberManualRecordIcon 
              sx={{ 
                fontSize: "0.75rem", 
                color: isDelivered ? "#10b981" : "#e6c687" 
              }} 
            />
            <p className="text-xs font-bold text-gray-300">
              {isDelivered 
                ? "Delivered Unit" 
                : "Status: " + (order?.orderStatus || "PENDING")}
            </p>
          </div>
        </Grid>

      </Grid>
    </div>
  );
};

export default OrderCard;