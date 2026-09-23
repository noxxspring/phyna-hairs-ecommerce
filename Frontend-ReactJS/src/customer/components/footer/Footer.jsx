import React from 'react';
import { Grid, Typography, Box, Container, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Material UI Icons
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// Custom SVG Icon for TikTok
const TikTokIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-2.22V8.16a6.34 6.34 0 1 0 6.34 6.34V9.32a8.28 8.28 0 0 0 4.77 1.47V7.34a4.85 4.85 0 0 1-1.00-.65z"/>
  </svg>
);

const Footer = () => {
  const navigate = useNavigate();

  // Social Links (Preserved)
  const socialLinks = {
    whatsapp: "https://wa.me/message/FX6PVWCDU6AMH1",   
    instagram: "https://www.instagram.com/phynahairs_collectibles?igsi=NDVmbTFxZG9yc3hx", 
    facebook: "https://www.facebook.com/share/19kUHr34Au/?mibextid=wwXIfr",  
    tiktok: "https://www.tiktok.com/@phynahairs_collectibles?_r=1&_t=ZS-99SYdoFwG93",     
  };

  return (
    <Box 
      component="footer" 
      sx={{ 
        background: 'linear-gradient(180deg, #ffb3d9 0%, #3b001a 25%, #08080c 100%)', 
        color: 'white', 
        pt: 8, 
        pb: 4, 
        borderTop: '2px solid #ffb3d9' 
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          
          {/* COLUMN 1: BRANDING & ABOUT */}
          <Grid item xs={12} sm={6} md={3.5}>
            <Typography 
              variant="h5" 
              fontFamily="serif" 
              fontWeight="bold" 
              gutterBottom 
              sx={{
                color: '#ffffff',
                textShadow: '0px 2px 4px rgba(0,0,0,0.5)',
                letterSpacing: '0.5px'
              }}
            >
              PHYNA HAIRS AND COLLECTIBLES
            </Typography>

            <Typography variant="body2" sx={{ color: '#e4e4e7', mt: 1.5, mb: 3, fontWeight: 300, lineHeight: 1.7 }}>
              We offer hairs in wholesale and retail (bundles and wigs) with hair accessories. We bring old wigs to life, (revamping) coloring and styling of all types of hairs, machine wigging and hand wigging. Ventilation of all types of closures. Frontal installation, bridal hairs with customizations. We train as well in all areas of our expertise.
            </Typography>

            {/* Quick WhatsApp Icon Button */}
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <IconButton 
                component="a" 
                href={socialLinks.whatsapp} 
                target="_blank" 
                rel="noopener noreferrer"
                sx={{ 
                  bgcolor: 'rgba(37, 211, 102, 0.25)', 
                  color: '#25D366', 
                  border: '1px solid rgba(37, 211, 102, 0.5)',
                  '&:hover': { bgcolor: '#25D366', color: 'black', transform: 'scale(1.08)' },
                  transition: 'all 0.3s'
                }}
              >
                <WhatsAppIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* COLUMN 2: SHOP */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle2" fontFamily="serif" fontWeight="bold" sx={{ color: '#e6c687', mb: 2.5, uppercase: true, letterSpacing: '1.5px' }}>
              SHOP
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography 
                onClick={() => navigate('/products')} 
                variant="body2" 
                sx={{ color: '#d4d4d8', cursor: 'pointer', '&:hover': { color: '#ffb3d9' }, transition: 'color 0.2s' }}
              >
                All Products
              </Typography>
              <Typography 
                onClick={() => navigate('/products')} 
                variant="body2" 
                sx={{ color: '#d4d4d8', cursor: 'pointer', '&:hover': { color: '#ffb3d9' }, transition: 'color 0.2s' }}
              >
                Wigs & Bundles
              </Typography>
              <Typography 
                onClick={() => navigate('/products')} 
                variant="body2" 
                sx={{ color: '#d4d4d8', cursor: 'pointer', '&:hover': { color: '#ffb3d9' }, transition: 'color 0.2s' }}
              >
                Frontals & Closures
              </Typography>
            </Box>
          </Grid>

          {/* COLUMN 3: HELP & NAVIGATION */}
          <Grid item xs={12} sm={6} md={2.5}>
            <Typography variant="subtitle2" fontFamily="serif" fontWeight="bold" sx={{ color: '#e6c687', mb: 2.5, uppercase: true, letterSpacing: '1.5px' }}>
              HELP
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography 
                onClick={() => navigate('/about')} 
                variant="body2" 
                sx={{ color: '#d4d4d8', cursor: 'pointer', '&:hover': { color: '#ffb3d9' }, transition: 'color 0.2s' }}
              >
                About Us
              </Typography>

              <Typography 
                onClick={() => navigate('/contact')} 
                variant="body2" 
                sx={{ color: '#d4d4d8', cursor: 'pointer', '&:hover': { color: '#ffb3d9' }, transition: 'color 0.2s' }}
              >
                Contact Us
              </Typography>

              <Typography 
                onClick={() => navigate('/account/order')} 
                variant="body2" 
                sx={{ color: '#d4d4d8', cursor: 'pointer', '&:hover': { color: '#ffb3d9' }, transition: 'color 0.2s' }}
              >
                Track Orders
              </Typography>

              <Typography 
                onClick={() => navigate('/privacy-policy')} 
                variant="body2" 
                sx={{ color: '#d4d4d8', cursor: 'pointer', '&:hover': { color: '#ffb3d9' }, transition: 'color 0.2s' }}
              >
                Privacy Policy
              </Typography>

              <Typography 
                onClick={() => navigate('/terms-condition')} 
                variant="body2" 
                sx={{ color: '#d4d4d8', cursor: 'pointer', '&:hover': { color: '#ffb3d9' }, transition: 'color 0.2s' }}
              >
                Terms of Service
              </Typography>
            </Box>
          </Grid>

          {/* COLUMN 4: CONTACT & SOCIAL MEDIA */}
          <Grid item xs={12} sm={6} md={3.5}>
            <Typography variant="subtitle2" fontFamily="serif" fontWeight="bold" sx={{ color: '#e6c687', mb: 2.5, uppercase: true, letterSpacing: '1.5px' }}>
              CONTACT & SOCIALS
            </Typography>

            {/* Contact Details */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#e4e4e7', fontSize: '0.85rem' }}>
                <EmailIcon sx={{ color: '#e6c687', fontSize: '1.1rem' }} />
                <span>Phina809@gmail.com</span>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#e4e4e7', fontSize: '0.85rem' }}>
                <PhoneIcon sx={{ color: '#25D366', fontSize: '1.1rem' }} />
                <span>+234 810 089 0306</span>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, color: '#e4e4e7', fontSize: '0.85rem' }}>
                <LocationOnIcon sx={{ color: '#ffb3d9', fontSize: '1.1rem', mt: 0.2 }} />
                <span>No 7 MCC Road, Off Wetheral Road, Owerri, Imo State, Nigeria</span>
              </Box>
            </Box>

            {/* Social Media Links */}
            <Box sx={{ display: 'flex', gap: 1.2 }}>
              
              {/* WHATSAPP LINK */}
              <IconButton 
                component="a" 
                href={socialLinks.whatsapp} 
                target="_blank" 
                rel="noopener noreferrer"
                sx={{ 
                  bgcolor: 'rgba(37, 211, 102, 0.2)', 
                  color: '#25D366', 
                  border: '1px solid rgba(37, 211, 102, 0.4)',
                  '&:hover': { bgcolor: '#25D366', color: 'black', transform: 'scale(1.1)' },
                  transition: 'all 0.3s'
                }}
              >
                <WhatsAppIcon />
              </IconButton>

              {/* INSTAGRAM LINK */}
              <IconButton 
                component="a" 
                href={socialLinks.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                sx={{ 
                  bgcolor: 'rgba(255, 179, 217, 0.2)', 
                  color: '#ffb3d9', 
                  border: '1px solid rgba(255, 179, 217, 0.4)',
                  '&:hover': { bgcolor: '#ffb3d9', color: 'black', transform: 'scale(1.1)' },
                  transition: 'all 0.3s'
                }}
              >
                <InstagramIcon />
              </IconButton>

              {/* FACEBOOK LINK */}
              <IconButton 
                component="a" 
                href={socialLinks.facebook} 
                target="_blank" 
                rel="noopener noreferrer"
                sx={{ 
                  bgcolor: 'rgba(24, 119, 242, 0.2)', 
                  color: '#1877F2', 
                  border: '1px solid rgba(24, 119, 242, 0.4)',
                  '&:hover': { bgcolor: '#1877F2', color: 'white', transform: 'scale(1.1)' },
                  transition: 'all 0.3s'
                }}
              >
                <FacebookIcon />
              </IconButton>

              {/* TIKTOK LINK */}
              <IconButton 
                component="a" 
                href={socialLinks.tiktok} 
                target="_blank" 
                rel="noopener noreferrer"
                sx={{ 
                  bgcolor: 'rgba(230, 198, 135, 0.2)', 
                  color: '#e6c687', 
                  border: '1px solid rgba(230, 198, 135, 0.4)',
                  '&:hover': { bgcolor: '#e6c687', color: 'black', transform: 'scale(1.1)' },
                  transition: 'all 0.3s'
                }}
              >
                <TikTokIcon />
              </IconButton>

            </Box>
          </Grid>

        </Grid>

        {/* BOTTOM COPYRIGHT ROW */}
        <Box 
          sx={{ 
            borderTop: '1px solid rgba(255, 255, 255, 0.12)', 
            mt: 6, 
            pt: 4, 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            gap: 2 
          }}
        >
          <Typography variant="caption" sx={{ color: '#a1a1aa' }}>
            © {new Date().getFullYear()} Phyna Hairs & Beauty Salon. All rights reserved.
          </Typography>

          <Typography variant="caption" sx={{ color: '#a1a1aa' }}>
            Designed for Luxury Beauty & E-Commerce Experience
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;