import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  TextField, Button, Box, Grid, Typography, Paper, CircularProgress, 
  Alert, FormControlLabel, Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar 
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { API_BASE_URL } from '../../../config/api';

const CreateCategoryForm = () => {
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [categoryData, setCategoryData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    imagePublicId: '',
    featured: true,
    level: 1
  });

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/categories/`);
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'categories');

    try {
      const token = localStorage.getItem('jwt');
      const response = await axios.post(`${API_BASE_URL}/api/admin/cloudinary/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      setCategoryData(prev => ({
        ...prev,
        imageUrl: response.data.imageUrl,
        imagePublicId: response.data.publicId
      }));

      setMessage({ type: 'success', text: 'Category cover photo uploaded!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload cover photo.' });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCategoryData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryData.name) {
      setMessage({ type: 'error', text: 'Category Name is required!' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('jwt');
      await axios.post(`${API_BASE_URL}/api/admin/categories/`, categoryData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setMessage({ type: 'success', text: `✨ Category "${categoryData.name}" created successfully!` });
      
      setCategoryData({
        name: '',
        description: '',
        imageUrl: '',
        imagePublicId: '',
        featured: true,
        level: 1
      });

      fetchCategories();

    } catch (error) {
      setMessage({ type: 'error', text: 'Error creating category: ' + (error.response?.data?.message || error.message) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 1, color: 'white' }}>
      <Grid container spacing={4}>
        
        {/* LEFT FORM COLUMN */}
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3, bgcolor: '#12121a', color: 'white', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Typography variant="h6" fontFamily="serif" fontWeight="bold" gutterBottom sx={{ color: '#e6c687' }}>
              ✨ Create New Category
            </Typography>

            {message.text && (
              <Alert severity={message.type === 'error' ? 'error' : 'success'} sx={{ mb: 3 }}>
                {message.text}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={2.5}>

                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.2)', borderStyle: 'dashed' }}>
                    {categoryData.imageUrl ? (
                      <Box sx={{ mb: 2 }}>
                        <img 
                          src={categoryData.imageUrl} 
                          alt="Cover Preview" 
                          style={{ maxHeight: 120, borderRadius: 8, objectFit: 'cover', margin: '0 auto' }} 
                        />
                      </Box>
                    ) : null}

                    <Button
                      variant="contained"
                      component="label"
                      size="small"
                      startIcon={uploadingImage ? <CircularProgress size={16} color="inherit" /> : <CloudUploadIcon />}
                      disabled={uploadingImage}
                      sx={{ bgcolor: '#ff2a85', '&:hover': { bgcolor: '#d41f6e' }, fontWeight: 'bold' }}
                    >
                      {uploadingImage ? 'Uploading...' : 'Upload Cover Photo'}
                      <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                    </Button>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <TextField 
                    fullWidth 
                    required 
                    label="Category Name (e.g., Nails & Pedicure)" 
                    name="name" 
                    value={categoryData.name} 
                    onChange={handleChange} 
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField 
                    fullWidth 
                    multiline 
                    rows={2} 
                    label="Description" 
                    name="description" 
                    value={categoryData.description} 
                    onChange={handleChange} 
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel 
                    control={
                      <Checkbox 
                        checked={categoryData.featured} 
                        onChange={handleChange} 
                        name="featured" 
                        sx={{ color: 'rgba(255,255,255,0.4)', '&.Mui-checked': { color: '#ff2a85' } }} 
                      />
                    } 
                    label={<span style={{ color: 'white', fontSize: '0.85rem' }}>Feature on Homepage</span>} 
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading || uploadingImage}
                    startIcon={<AddCircleIcon />}
                    sx={{ py: 1.8, bgcolor: '#e6c687', color: '#000', fontWeight: 'bold', '&:hover': { bgcolor: '#d4b475' } }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Category'}
                  </Button>
                </Grid>

              </Grid>
            </form>
          </Paper>
        </Grid>

        {/* RIGHT CATEGORIES LIST TABLE */}
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, bgcolor: '#12121a', color: 'white', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Typography variant="h6" fontFamily="serif" fontWeight="bold" gutterBottom sx={{ color: '#e6c687', mb: 2 }}>
              Active Categories List
            </Typography>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Cover</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>ID</TableCell>
                    <TableCell align="center">Featured</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categories.map((cat) => (
                    <TableRow key={cat.id} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                      <TableCell>
                        <Avatar src={cat.imageUrl} alt={cat.name} variant="rounded" sx={{ width: 40, height: 40, borderRadius: 2 }} />
                      </TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>{cat.name}</TableCell>
                      <TableCell sx={{ color: '#a1a1aa', fontFamily: 'monospace' }}>#{cat.id}</TableCell>
                      <TableCell align="center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${cat.featured ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                          {cat.featured ? 'YES' : 'NO'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

      </Grid>
    </Box>
  );
};

export default CreateCategoryForm;