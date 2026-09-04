import React, { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import OrderCard from "./OrderCard";
import { getOrderHistory } from "../../../Redux/Customers/Order/Action";

const orderStatusOptions = [
  { label: "Pending Confirmation", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "On The Way / Shipped", value: "SHIPPED" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const Order = () => {
  const dispatch = useDispatch();
  const { order } = useSelector((store) => store);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  useEffect(() => {
    dispatch(getOrderHistory());
  }, [dispatch]);

  // Handle Checkbox Filter Selection
  const handleFilterChange = (value) => {
    if (selectedStatuses.includes(value)) {
      setSelectedStatuses(selectedStatuses.filter((status) => status !== value));
    } else {
      setSelectedStatuses([...selectedStatuses, value]);
    }
  };

  const rawOrders = order?.orders || [];

  // Filter orders based on checked statuses
  const filteredOrders = selectedStatuses.length > 0
    ? rawOrders.filter((ord) => selectedStatuses.includes(ord.orderStatus))
    : rawOrders;

  return (
    <div className="bg-[#08080c] text-white min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="border-b border-white/10 pb-4 mb-8">
          <span className="text-xs font-bold text-[#ff2a85] uppercase tracking-widest">✦ Purchase History ✦</span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white mt-1">My Hair Orders</h1>
        </div>

        <Grid container spacing={4}>
          
          {/* 1. FILTER SIDEBAR COLUMN */}
          <Grid item xs={12} md={3}>
            <div className="p-6 rounded-3xl bg-[#12121a] border border-white/10 shadow-2xl sticky top-28 space-y-6">
              <Typography variant="h6" fontFamily="serif" fontWeight="bold" sx={{ color: "#e6c687" }}>
                Filter Orders
              </Typography>

              <div className="space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Order Status
                </p>

                {orderStatusOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      id={`status-${option.value}`}
                      type="checkbox"
                      checked={selectedStatuses.includes(option.value)}
                      onChange={() => handleFilterChange(option.value)}
                      className="h-4 w-4 rounded border-gray-600 bg-white/5 text-[#ff2a85] focus:ring-[#ff2a85] cursor-pointer"
                    />
                    <label 
                      htmlFor={`status-${option.value}`} 
                      className="text-xs text-gray-300 font-light cursor-pointer hover:text-white"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </Grid>

          {/* 2. ORDER CARDS LIST COLUMN */}
          <Grid item xs={12} md={9}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((ord) =>
                  ord?.orderItems?.map((item, index) => (
                    <OrderCard key={item?.id || index} item={item} order={ord} />
                  ))
                )
              ) : (
                <div className="text-center py-20 bg-[#12121a] rounded-3xl border border-white/10 space-y-3">
                  <h3 className="text-lg font-serif font-bold text-white">No Orders Found</h3>
                  <p className="text-xs text-gray-400 font-light">No orders match your selected status filters.</p>
                </div>
              )}
            </Box>
          </Grid>

        </Grid>

      </div>
    </div>
  );
};

export default Order;