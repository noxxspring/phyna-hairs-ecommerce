import React, { useState, useEffect } from 'react';
import { Grid, TextField, Button, Typography, Alert, CircularProgress, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register } from '../../../Redux/Auth/Action';

const textFieldStyle = {
  "& .MuiInputBase-input": { color: "white" },
  "& .MuiInputLabel-root": { color: "#a1a1aa" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#ff2a85" },
  "& .MuiOutlinedInput-root": {
    bgcolor: "rgba(255,255,255,0.03)",
    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
    "&:hover fieldset": { borderColor: "#ff2a85" },
    "&.Mui-focused fieldset": { borderColor: "#ff2a85" },
  },
};

const Register = ({ handleClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auth } = useSelector((store) => store);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    mobile: '',
    role: 'ROLE_CUSTOMER'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register(formData));
  };

  useEffect(() => {
    if (auth.jwt && handleClose) {
      handleClose();
    }
  }, [auth.jwt, handleClose]);

  // Extract display string safely
  const displayError = typeof auth.error === 'string' ? auth.error : auth.error?.message;

  return (
    <Box sx={{ color: "white" }}>
      <Typography variant="h5" align="center" fontFamily="serif" fontWeight="bold" gutterBottom sx={{ color: "#e6c687" }}>
        Create Account
      </Typography>
      <Typography variant="body2" align="center" sx={{ color: "#a1a1aa", mb: 3 }}>
        Join Phyna Hairs VIP Beauty Club
      </Typography>

      {/* ERROR ALERT BOX */}
      {displayError && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 2, 
            bgcolor: 'rgba(244, 63, 94, 0.15)', 
            color: '#f43f5e', 
            border: '1px solid rgba(244, 63, 94, 0.3)',
            fontSize: '0.8rem',
            fontWeight: 'bold'
          }}
        >
          {displayError}
        </Alert>
      )}

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
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              sx={textFieldStyle}
            />
          </Grid>
          <Grid item xs={12}>
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
            <TextField
              required
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
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
              disabled={auth.isLoading}
              sx={{ py: 1.5, mt: 1, bgcolor: '#e6c687', color: '#000', fontWeight: 'bold', '&:hover': { bgcolor: '#d4b475' } }}
            >
              {auth.isLoading ? <CircularProgress size={24} color="inherit" /> : 'REGISTER'}
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* TOGGLE TO LOGIN */}
      <Typography variant="body2" align="center" sx={{ mt: 3, color: "#a1a1aa" }}>
        Already have an account?{" "}
        <span
          onClick={() => navigate('/login')}
          className="text-[#ff2a85] font-bold cursor-pointer hover:underline"
        >
          Sign In Here
        </span>
      </Typography>
    </Box>
  );
};

export default Register;