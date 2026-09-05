import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, 
  FormControlLabel, Checkbox, Grid, Typography, Paper, CircularProgress, Alert 
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { API_BASE_URL } from '../../../config/api';

const CreateProductForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [categoriesList, setCategoriesList] = useState([]);

  const initialFormState = {
    categoryId: '',
    title: '',
    description: '',
    price: '',
    discountedPrice: '',
    discountPercent: 0,
    quantity: 10,
    brand: 'Phyna Hairs',
    color: 'NATURAL_BLACK_1B',
    imageUrl: '',
    imagePublicId: '',
    hairType: 'Virgin Human Hair',
    hairTexture: 'Straight',
    laceType: 'FRONTAL_13X4',
    lengthInInches: 24,
    density: '180%',
    capSize: 'Medium (22.5")',
    prePlucked: false,
    knotsBleached: false,
    glueless: false,
    isSalonService: false,
    topLevelCategory: 'Products',
    secondLevelCategory: '',
    thirdLevelCategory: ''
  };

  const [productData, setProductData] = useState(initialFormState);

  // Fetch Categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/categories/`);
        setCategoriesList(res.data || []);
      } catch (e) {
        console.error("Error fetching categories:", e);
      }
    };
    fetchCats();
  }, []);

  // Image Upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'products');

    try {
      const token = localStorage.getItem('jwt');
      const response = await axios.post(`${API_BASE_URL}/api/admin/cloudinary/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      setProductData(prev => ({
        ...prev,
        imageUrl: response.data.imageUrl,
        imagePublicId: response.data.publicId
      }));

      setMessage({ type: 'success', text: 'Product photo uploaded to Cloudinary!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload photo.' });
    } finally {
      setUploadingImage(false);
    }
  };

  // Smart Price Calculator Handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setProductData((prev) => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };

      const regPrice = parseFloat(name === 'price' ? value : updated.price) || 0;
      const discPercent = parseFloat(name === 'discountPercent' ? value : updated.discountPercent) || 0;

      if (regPrice > 0 && discPercent > 0 && discPercent < 100) {
        const calculatedSalePrice = regPrice - (regPrice * (discPercent / 100));
        updated.discountedPrice = Math.round(calculatedSalePrice);
      } else if (discPercent === 0 && name !== 'discountedPrice') {
        updated.discountedPrice = regPrice;
      }

      return updated;
    });
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productData.imageUrl) {
      setMessage({ type: 'error', text: 'Please upload a photo before submitting!' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('jwt');
      await axios.post(`${API_BASE_URL}/api/admin/products/`, productData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setMessage({ type: 'success', text: '✨ Product created successfully! Redirecting...' });
      setProductData(initialFormState);

      setTimeout(() => {
        navigate('/admin/products');
      }, 1500);

    } catch (error) {
      setMessage({ type: 'error', text: 'Error saving product: ' + (error.response?.data?.message || error.message) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 900, margin: '1rem auto', borderRadius: 3, bgcolor: '#12121a', color: 'white', border: '1px solid rgba(255,255,255,0.08)' }}>
      <Typography variant="h5" align="center" fontFamily="serif" fontWeight="bold" gutterBottom sx={{ color: '#e6c687' }}>
        ✨ Add New Product / Salon Service
      </Typography>

      {message.text && (
        <Alert severity={message.type === 'error' ? 'error' : 'success'} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>

          {/* CLOUDINARY FILE UPLOADER */}
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.2)', borderStyle: 'dashed' }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>
                Product Photo Upload
              </Typography>
              
              {productData.imageUrl ? (
                <Box sx={{ mb: 2 }}>
                  <img 
                    src={productData.imageUrl} 
                    alt="Preview" 
                    style={{ maxHeight: 180, borderRadius: 12, objectFit: 'cover', margin: '0 auto' }} 
                  />
                </Box>
              ) : null}

              <Button
                variant="contained"
                component="label"
                startIcon={uploadingImage ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
                disabled={uploadingImage}
                sx={{ bgcolor: '#ff2a85', '&:hover': { bgcolor: '#d41f6e' }, fontWeight: 'bold' }}
              >
                {uploadingImage ? 'Uploading...' : 'Choose Image File'}
                <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
              </Button>
            </Paper>
          </Grid>

          {/* CATEGORY SELECTOR */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required sx={{ "& .MuiInputBase-input": { color: "white" }, "& .MuiInputLabel-root": { color: "#a1a1aa" }, "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "rgba(255,255,255,0.2)" } } }}>
              <InputLabel>Select Category</InputLabel>
              <Select
                name="categoryId"
                value={productData.categoryId || ''}
                onChange={handleChange}
                label="Select Category"
              >
                {categoriesList.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* TITLE */}
          <Grid item xs={12} sm={6}>
            <TextField 
              fullWidth 
              required 
              label="Product Title" 
              name="title" 
              value={productData.title} 
              onChange={handleChange} 
            />
          </Grid>

          {/* PRICE, DISCOUNT %, CALCULATED SALE PRICE */}
          <Grid item xs={12} sm={4}>
            <TextField 
              fullWidth 
              required 
              type="number" 
              label="Regular Price (NGN)" 
              name="price" 
              value={productData.price} 
              onChange={handleChange} 
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField 
              fullWidth 
              type="number" 
              label="Discount Percent (%)" 
              name="discountPercent" 
              value={productData.discountPercent} 
              onChange={handleChange} 
              helperText="E.g., enter 10 for 10% off"
              sx={{ "& .MuiFormHelperText-root": { color: "#a1a1aa" } }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField 
              fullWidth 
              type="number" 
              label="Final Sale Price (NGN)" 
              name="discountedPrice" 
              value={productData.discountedPrice} 
              onChange={handleChange} 
              helperText="Auto-calculated from discount %"
              sx={{ "& .MuiFormHelperText-root": { color: "#e6c687" } }}
            />
          </Grid>

          {/* STOCK QUANTITY */}
          <Grid item xs={12} sm={6}>
            <TextField 
              fullWidth 
              type="number" 
              label="Stock Quantity" 
              name="quantity" 
              value={productData.quantity} 
              onChange={handleChange} 
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField 
              fullWidth 
              label="Brand / Vendor" 
              name="brand" 
              value={productData.brand} 
              onChange={handleChange} 
            />
          </Grid>

          {/* DESCRIPTION */}
          <Grid item xs={12}>
            <TextField 
              fullWidth 
              multiline 
              rows={3} 
              label="Description" 
              name="description" 
              value={productData.description} 
              onChange={handleChange} 
            />
          </Grid>

          {/* SUBMIT BUTTON */}
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading || uploadingImage}
              sx={{ py: 1.8, bgcolor: '#e6c687', color: '#000', fontWeight: 'bold', '&:hover': { bgcolor: '#d4b475' } }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Product to Category'}
            </Button>
          </Grid>

        </Grid>
      </form>
    </Paper>
  );
};

export default CreateProductForm;