import React, { useState, useEffect } from 'react';
import { Grid, TextField, Button, Typography, Alert, CircularProgress, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../../Redux/Auth/Action';

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

const Login = ({ handleClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auth } = useSelector((store) => store);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
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
      <Typography variant="h5" align="center" fontFamily="serif" fontWeight="bold" gutterBottom sx={{ color: "#ff2a85" }}>
        Welcome Back
      </Typography>
      <Typography variant="body2" align="center" sx={{ color: "#a1a1aa", mb: 3 }}>
        Sign in to your Phyna Hairs account
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
              sx={{ py: 1.5, mt: 1, bgcolor: '#ff2a85', '&:hover': { bgcolor: '#d41f6e' }, fontWeight: 'bold' }}
            >
              {auth.isLoading ? <CircularProgress size={24} color="inherit" /> : 'SIGN IN'}
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* TOGGLE TO REGISTER */}
      <Typography variant="body2" align="center" sx={{ mt: 3, color: "#a1a1aa" }}>
        New to Phyna Hairs?{" "}
        <span
          onClick={() => navigate('/register')}
          className="text-[#e6c687] font-bold cursor-pointer hover:underline"
        >
          Create an Account
        </span>
      </Typography>
    </Box>
  );
};

export default Login;