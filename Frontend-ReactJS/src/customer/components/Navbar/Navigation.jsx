import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';

// Material UI Components
import { 
  IconButton, Button, Avatar, Menu, MenuItem, Drawer, Box, 
  Divider, List, ListItem, ListItemButton, ListItemText, Badge 
} from '@mui/material';

// Material UI Icons
import SearchIcon from '@mui/icons-material/Search';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';

import { API_BASE_URL } from '../../../config/api';
import AuthModal from '../Auth/AuthModal';
import { getUser, logout } from '../../../Redux/Auth/Action';

// Navigation Links
const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Catalog', path: '/products' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Search & Modal States
  const [openSearch, setOpenSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // User Profile Menu State
  const [anchorEl, setAnchorEl] = useState(null);

  // Redux States
  const auth = useSelector((state) => state.auth) || {};
  const cart = useSelector((state) => state.cart);

  const cartItemCount = cart?.cart?.totalItem || cart?.cart?.cartItems?.length || cart?.cartItems?.length || 0;
  const jwt = localStorage.getItem('jwt');
  const isLoggedIn = Boolean(jwt || auth?.user);

  // Auto-fetch user profile if JWT token exists
  useEffect(() => {
    if (jwt && !auth?.user) {
      try {
        dispatch(getUser(jwt));
      } catch (e) {
        console.error("Error fetching user profile:", e);
      }
    }
  }, [jwt, auth?.user, dispatch]);

  // Auto-open AuthModal on /login or /register
  useEffect(() => {
    if ((location.pathname === '/login' || location.pathname === '/register') && !isLoggedIn) {
      setOpenAuthModal(true);
    } else if (isLoggedIn && (location.pathname === '/login' || location.pathname === '/register')) {
      setOpenAuthModal(false);
      navigate('/');
    }
  }, [location.pathname, isLoggedIn, navigate]);

  const handleUserMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleUserMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleUserMenuClose();
    if (dispatch && logout) {
      try { dispatch(logout()); } catch (e) {}
    }
    localStorage.removeItem('jwt');
    window.location.href = '/';
  };

  const handleCloseAuth = () => {
    setOpenAuthModal(false);
    if (location.pathname === '/login' || location.pathname === '/register') {
      navigate('/');
    }
  };

  // Live Instant Search Logic with Debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        setSearchLoading(true);
        try {
          const res = await axios.get(`${API_BASE_URL}/api/products/search?q=${searchQuery}`);
          setSearchResults(res.data || []);
        } catch (err) {
          try {
            const allRes = await axios.get(`${API_BASE_URL}/api/products/`);
            const allProds = allRes.data?.content || allRes.data || [];
            const filtered = allProds.filter(p => 
              (p.title || p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
              (p.brand || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
              (p.color || '').toLowerCase().includes(searchQuery.toLowerCase())
            );
            setSearchResults(filtered);
          } catch (e) {
            setSearchResults([]);
          }
        } finally {
          setSearchLoading(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <header className="sticky top-0 z-50 bg-[#0b0b0f]/95 backdrop-blur-md border-b border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

        {/* 1. BRAND LOGO */}
        <div 
          onClick={() => navigate('/')} 
          className="cursor-pointer flex items-center space-x-2"
        >
          <span className="text-lg sm:text-2xl font-serif font-bold bg-gradient-to-r from-[#ff2a85] to-[#e6c687] bg-clip-text text-transparent uppercase tracking-wider">
            ✨ PHYNA HAIRS AND COLLECTIBLES
          </span>
        </div>

        {/* 2. DESKTOP NAVIGATION LINKS */}
        <nav className="hidden md:flex items-center space-x-8 text-xs font-bold uppercase tracking-wider">
          {navLinks.map((link) => (
            <button 
              key={link.name} 
              onClick={() => navigate(link.path)} 
              className="hover:text-[#ff2a85] transition-colors"
            >
              {link.name}
            </button>
          ))}
        </nav>

        {/* 3. ACTIONS: SEARCH, CART & USER AVATAR / AUTH */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          
          {/* SEARCH BUTTON */}
          <IconButton onClick={() => setOpenSearch(true)} sx={{ color: 'white' }} title="Search Products">
            <SearchIcon />
          </IconButton>

          {/* SHOPPING CART BUTTON */}
          <IconButton onClick={() => navigate('/cart')} sx={{ color: 'white' }} title="Cart">
            <Badge badgeContent={cartItemCount} color="secondary">
              <ShoppingBagIcon />
            </Badge>
          </IconButton>

          {/* USER AVATAR MENU (LOGGED IN) vs GUEST SIGN IN / REGISTER */}
          {isLoggedIn ? (
            <div>
              <Button
                onClick={handleUserMenuClick}
                startIcon={
                  <Avatar 
                    sx={{ bgcolor: '#ff2a85', width: 34, height: 34, fontSize: '0.9rem', fontWeight: 'bold', border: '1px solid #e6c687' }}
                  >
                    {auth?.user?.firstName ? auth.user.firstName[0].toUpperCase() : 'U'}
                  </Avatar>
                }
                sx={{ color: 'white', textTransform: 'none', fontWeight: 'bold' }}
              >
                <span className="hidden sm:inline text-sm">{auth?.user?.firstName || 'Account'}</span>
              </Button>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleUserMenuClose}
                PaperProps={{
                  sx: { bgcolor: '#1a1a24', color: 'white', border: '1px solid rgba(255,255,255,0.1)', mt: 1, minWidth: 160 }
                }}
              >
                <MenuItem onClick={() => { handleUserMenuClose(); navigate('/account/order'); }}>
                  My Orders
                </MenuItem>
                
                {(auth?.user?.role === 'ROLE_ADMIN' || auth?.user?.role === 'ADMIN') && (
                  <MenuItem onClick={() => { handleUserMenuClose(); navigate('/admin'); }} sx={{ color: '#e6c687', fontWeight: 'bold' }}>
                    Admin Dashboard
                  </MenuItem>
                )}

                <MenuItem onClick={handleLogout} sx={{ color: '#f43f5e', fontWeight: 'bold' }}>
                  Logout
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Button
                onClick={() => { setOpenAuthModal(true); navigate('/login'); }}
                variant="text"
                sx={{ color: '#e6c687', fontWeight: 'bold', fontSize: '0.75rem', px: 1 }}
              >
                <span className="hidden sm:inline">Sign In</span>
              </Button>

              <Button
                onClick={() => { setOpenAuthModal(true); navigate('/register'); }}
                variant="contained"
                sx={{ 
                  bgcolor: '#ff2a85', 
                  color: 'white', 
                  fontWeight: 'bold', 
                  fontSize: '0.75rem',
                  borderRadius: '20px',
                  px: 2,
                  '&:hover': { bgcolor: '#d41f6e' } 
                }}
              >
                Register
              </Button>
            </div>
          )}

          {/* MOBILE MENU TOGGLE BUTTON */}
          <div className="md:hidden flex items-center">
            <IconButton onClick={() => setMobileDrawerOpen(true)} sx={{ color: 'white' }}>
              <MenuIcon />
            </IconButton>
          </div>

        </div>
      </div>

      {/* 4. MOBILE SLIDE-OUT DRAWER MENU */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        PaperProps={{
          sx: { width: 280, bgcolor: '#12121a', color: 'white', borderRight: '1px solid rgba(255,255,255,0.1)' }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="text-lg font-serif font-bold bg-gradient-to-r from-[#ff2a85] to-[#e6c687] bg-clip-text text-transparent">
            ✨ PHYNA HAIRS AND COLLECTIBLES
          </span>
          <IconButton onClick={() => setMobileDrawerOpen(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

        <List sx={{ px: 1, py: 2 }}>
          {navLinks.map((link) => (
            <ListItem key={link.name} disablePadding sx={{ mb: 1 }}>
              <ListItemButton 
                onClick={() => {
                  navigate(link.path);
                  setMobileDrawerOpen(false);
                }}
                sx={{ borderRadius: 2, '&:hover': { bgcolor: 'rgba(255,42,133,0.15)' } }}
              >
                <ListItemText 
                  primary={link.name} 
                  primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'white' }} 
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* 5. INSTANT SEARCH OVERLAY MODAL */}
      {openSearch && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-16 px-4">
          <div className="bg-[#12121a] text-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl border border-white/10 p-6 relative">
            
            {/* Close Button */}
            <IconButton 
              onClick={() => { setOpenSearch(false); setSearchQuery(''); setSearchResults([]); }}
              sx={{ position: 'absolute', top: 12, right: 12, color: 'gray' }}
            >
              <CloseIcon />
            </IconButton>

            {/* Search Input */}
            <div className="flex items-center border-b-2 border-[#ff2a85] pb-2 pt-2">
              <SearchIcon className="text-gray-400 mr-3 !text-2xl" />
              <input
                type="text"
                placeholder="Search wigs, bundles, frontals, nails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full text-lg font-serif outline-none bg-transparent text-white placeholder-gray-500"
              />
            </div>

            {/* Live Search Results List */}
            <div className="max-h-96 overflow-y-auto space-y-3 pt-4">
              {searchLoading ? (
                <div className="text-center py-8 text-[#e6c687] font-serif text-sm">Searching inventory...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      navigate(`/product/${item.id}`);
                      setOpenSearch(false);
                      setSearchQuery('');
                    }}
                    className="flex items-center space-x-4 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/10"
                  >
                    <img 
                      src={item.imageUrl || item.images?.[0] || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500'} 
                      alt={item.title || item.name} 
                      className="w-14 h-14 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-white uppercase">{item.title || item.name}</h4>
                      <p className="text-xs text-gray-400">{item.brand || item.color || 'PREMIUM HAIR'}</p>
                    </div>
                    <span className="font-bold text-sm text-[#e6c687]">
                      ₦{(item.discountedPrice || item.price || 0).toLocaleString()}
                    </span>
                  </div>
                ))
              ) : searchQuery.trim().length > 1 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No products found for "{searchQuery}".
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-gray-400">
                  Type at least 2 characters to search...
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* AUTHENTICATION MODAL POPUP */}
      <AuthModal handleClose={handleCloseAuth} open={openAuthModal} />
    </header>
  );
};

export default Navigation;