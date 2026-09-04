import React, { useState } from 'react';
import { Grid, Button, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AddressCard from '../adreess/AdreessCard';
import { createOrder } from '../../../Redux/Customers/Order/Action';

const textFieldStyle = {
  "& .MuiInputBase-input": { color: "white" },
  "& .MuiInputLabel-root": { color: "#a1a1aa" },
  "& .MuiOutlinedInput-root": {
    bgcolor: "rgba(255,255,255,0.03)",
    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
    "&:hover fieldset": { borderColor: "#ff2a85" },
    "&.Mui-focused fieldset": { borderColor: "#ff2a85" },
  },
};

const AddAddress = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auth } = useSelector((store) => store);

  // SAFE ADDRESS ARRAY EXTRACTION (Prevents 'map' crash!)
  const userAddresses = auth.user?.address || auth.user?.addresses || [];

  const [formData, setFormData] = useState({
    firstName: auth.user?.firstName || '',
    lastName: auth.user?.lastName || '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    mobile: auth.user?.mobile || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const orderData = { address: formData, navigate };
    dispatch(createOrder(orderData));
  };

  const handleSelectExistingAddress = (address) => {
    const orderData = { address, navigate };
    dispatch(createOrder(orderData));
  };

  return (
    <div className="bg-[#08080c] text-white min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* EXISTING ADDRESSES COLUMN */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-lg font-serif font-bold text-[#e6c687] border-b border-white/10 pb-3">
            Saved Delivery Addresses
          </h2>

          {userAddresses.length > 0 ? (
            userAddresses.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#12121a] border border-white/10 space-y-3">
                <AddressCard address={item} />
                <Button
                  onClick={() => handleSelectExistingAddress(item)}
                  variant="contained"
                  fullWidth
                  sx={{ bgcolor: '#ff2a85', color: 'white', fontWeight: 'bold', '&:hover': { bgcolor: '#d41f6e' } }}
                >
                  Deliver Here
                </Button>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400 font-light italic">No saved addresses found. Please enter your delivery address below.</p>
          )}
        </div>

        {/* NEW ADDRESS FORM COLUMN */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#12121a] border border-white/10 shadow-2xl">
            <h2 className="text-xl font-serif font-bold text-[#e6c687] mb-6">
              Enter Delivery Address
            </h2>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    sx={textFieldStyle}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    sx={textFieldStyle}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    multiline
                    rows={2}
                    label="Street Address"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleChange}
                    sx={textFieldStyle}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    sx={textFieldStyle}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="State / Province"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    sx={textFieldStyle}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Zip / Postal Code"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    sx={textFieldStyle}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Mobile Number"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    sx={textFieldStyle}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{ py: 1.8, mt: 2, bgcolor: '#e6c687', color: '#000', fontWeight: 'bold', '&:hover': { bgcolor: '#d4b475' } }}
                  >
                    Deliver Here & Proceed to Payment
                  </Button>
                </Grid>
              </Grid>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AddAddress;