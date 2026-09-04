import React from 'react';
import { IconButton, Button } from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useDispatch } from 'react-redux';
import { removeCartItem, updateCartItem, getCart } from '../../../Redux/Customers/Cart/Action';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const handleUpdateQuantity = async (num) => {
    const newQty = (item?.quantity || 1) + num;
    if (newQty > 0) {
      await dispatch(updateCartItem({ cartItemId: item.id, data: { quantity: newQty } }));
      dispatch(getCart()); // RE-FETCH FRESH TOTALS FROM BACKEND
    }
  };

  const handleRemove = async () => {
    await dispatch(removeCartItem(item.id));
    dispatch(getCart()); // RE-FETCH FRESH TOTALS FROM BACKEND
  };

  const imageUrl = item?.product?.imageUrl || item?.product?.image || "https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=800&auto=format&fit=crop";

  return (
    <div className="p-5 rounded-2xl bg-[#12121a] border border-white/10 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-white">
      
      {/* Product Thumbnail & Details */}
      <div className="flex items-center space-x-4 w-full sm:w-auto">
        <img
          src={imageUrl}
          alt={item?.product?.title}
          className="w-24 h-28 object-cover object-top rounded-xl border border-white/10"
        />
        <div className="space-y-1">
          <p className="text-[11px] font-bold text-[#ff2a85] uppercase tracking-wider">
            {item?.product?.brand || "Phyna Hairs"}
          </p>
          <h3 className="text-sm font-semibold text-white line-clamp-1">
            {item?.product?.title || "Luxury Wig Unit"}
          </h3>
          <p className="text-xs text-gray-400">
            Selected Option: <span className="text-[#e6c687] font-semibold">{item?.size || "24 inches"}</span>
          </p>
          <p className="text-base font-extrabold text-[#e6c687] pt-1">
            ₦{(item?.discountedPrice || item?.price || 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Quantity & Removal Controls */}
      <div className="flex items-center justify-between w-full sm:w-auto space-x-6 border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
        
        {/* Quantity Toggle */}
        <div className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
          <IconButton 
            onClick={() => handleUpdateQuantity(-1)}
            disabled={item?.quantity <= 1}
            size="small" 
            sx={{ color: 'white', '&.Mui-disabled': { color: 'rgba(255,255,255,0.2)' } }}
          >
            <RemoveCircleOutlineIcon fontSize="small" />
          </IconButton>
          
          <span className="text-sm font-bold px-2">{item?.quantity || 1}</span>

          <IconButton 
            onClick={() => handleUpdateQuantity(1)}
            size="small" 
            sx={{ color: 'white' }}
          >
            <AddCircleOutlineIcon fontSize="small" />
          </IconButton>
        </div>

        {/* Remove Button */}
        <Button
          onClick={handleRemove}
          size="small"
          color="error"
          startIcon={<DeleteOutlineIcon />}
          sx={{ textTransform: 'none', color: '#f43f5e', fontSize: '0.75rem' }}
        >
          Remove
        </Button>

      </div>

    </div>
  );
};

export default CartItem;