import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Avatar, Button, Menu, MenuItem, IconButton, Badge, Drawer, Box, List, ListItem, ListItemButton, ListItemText, Divider 
} from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

import { getUser, logout } from '../../../Redux/Auth/Action';
import AuthModal from '../Auth/AuthModal';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const { auth, cart } = useSelector((store) => store);
  const jwt = localStorage.getItem('jwt');

  // Fetch user profile if JWT exists
  useEffect(() => {
    if (jwt && !auth.user) {
      dispatch(getUser(jwt));
    }
  }, [jwt, dispatch, auth.user]);

  // Open Auth Modal if route is /login or /register
  useEffect(() => {
    if (location.pathname === '/login' || location.pathname === '/register') {
      setOpenAuthModal(true);
    }
  }, [location.pathname]);

  const handleCloseAuth = () => {
    setOpenAuthModal(false);
    if (location.pathname === '/login' || location.pathname === '/register') {
      navigate('/');
    }
  };

  const handleUserMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleUserMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleUserMenuClose();
    dispatch(logout());
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Human Hair Wigs', path: '/wigs/human-hair/frontal-wigs' },
    { name: 'Raw Hair Bundles', path: '/bundles/raw-hair/bundle-deals' },
    { name: 'HD Frontals & Closures', path: '/frontals/hd-lace/13x4-frontals' },
    { name: 'Wig Accessories & Tools', path: '/accessories/wig-care/bonnets' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0b0b0f]/95 backdrop-blur-md border-b border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* 1. MOBILE HAMBURGER BUTTON (Visible on Phones) */}
        <div className="flex items-center md:hidden">
          <IconButton onClick={() => setMobileDrawerOpen(true)} sx={{ color: 'white' }}>
            <MenuIcon />
          </IconButton>
        </div>

        {/* 2. BRAND LOGO */}
        <div 
          onClick={() => navigate('/')} 
          className="cursor-pointer flex items-center space-x-2"
        >
          <span className="text-xl sm:text-2xl font-serif font-bold bg-gradient-to-r from-[#ff2a85] to-[#e6c687] bg-clip-text text-transparent">
            ✨ Phyna Hairs
          </span>
        </div>

        {/* 3. DESKTOP NAVIGATION LINKS */}
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

        {/* 4. ACTIONS: CART & USER AUTH */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          
          {/* Shopping Cart Button */}
          <IconButton onClick={() => navigate('/cart')} sx={{ color: 'white' }}>
            <Badge badgeContent={cart?.cart?.totalItem || 0} color="secondary">
              <ShoppingBagIcon />
            </Badge>
          </IconButton>

          {/* User Logged-In State vs Guest State */}
          {auth.user ? (
            <div>
              <Button
                onClick={handleUserMenuClick}
                startIcon={
                  <Avatar 
                    sx={{ bgcolor: '#ff2a85', width: 32, height: 32, fontSize: '0.85rem' }}
                  >
                    {auth.user.firstName ? auth.user.firstName[0].toUpperCase() : 'U'}
                  </Avatar>
                }
                sx={{ color: 'white', textTransform: 'none', fontWeight: 'bold' }}
              >
                <span className="hidden sm:inline">{auth.user.firstName}</span>
              </Button>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleUserMenuClose}
                PaperProps={{
                  sx: { bgcolor: '#1a1a24', color: 'white', border: '1px solid rgba(255,255,255,0.1)', mt: 1 }
                }}
              >
                <MenuItem onClick={() => { handleUserMenuClose(); navigate('/account/order'); }}>My Orders</MenuItem>
                
                {auth.user.role === 'ROLE_ADMIN' && (
                  <MenuItem onClick={() => { handleUserMenuClose(); navigate('/admin'); }} sx={{ color: '#e6c687', fontWeight: 'bold' }}>
                    Admin Dashboard
                  </MenuItem>
                )}

                <MenuItem onClick={handleLogout} sx={{ color: '#f43f5e' }}>Logout</MenuItem>
              </Menu>
            </div>
          ) : (
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Button
                onClick={() => navigate('/login')}
                variant="text"
                sx={{ color: '#e6c687', fontWeight: 'bold', fontSize: '0.75rem', px: 1 }}
                startIcon={<PersonOutlineIcon />}
              >
                <span className="hidden sm:inline">Sign In</span>
              </Button>

              <Button
                onClick={() => navigate('/register')}
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

        </div>
      </div>

      {/* 5. MOBILE SLIDE-OUT DRAWER MENU */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        PaperProps={{
          sx: { width: 280, bgcolor: '#12121a', color: 'white', borderRight: '1px solid rgba(255,255,255,0.1)' }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="text-xl font-serif font-bold bg-gradient-to-r from-[#ff2a85] to-[#e6c687] bg-clip-text text-transparent">
            ✨ Phyna Hairs
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

      {/* AUTHENTICATION MODAL POPUP */}
      <AuthModal handleClose={handleCloseAuth} open={openAuthModal} />
    </header>
  );
};

export default Navigation;