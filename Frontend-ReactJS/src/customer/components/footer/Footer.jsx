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
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-2.22V8.16a6.34 6.34 0 1 0 6.34 6.34V9.32a8.28 8.28 0 0 0 4.77 1.47V7.34a4.85 4.85 0 0 1-1.00-.65z"/>
  </svg>
);

const Footer = () => {
  const navigate = useNavigate();


  // ======================================================
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
        bgcolor: '#050508', 
        color: 'white', 
        pt: 8, 
        pb: 4, 
        borderTop: '1px solid rgba(255, 255, 255, 0.1)' 
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5} justifyContent="space-between">
          
          {/* COLUMN 1: BRANDING & CONTACT INFO */}
          <Grid item xs={12} sm={6} md={3.5}>
            <Typography 
              variant="h5" 
              fontFamily="serif" 
              fontWeight="bold" 
              gutterBottom 
              sx={{
                background: 'linear-gradient(90deg, #ff2a85, #e6c687)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}
            >
              ✨ Phyna Hairs
            </Typography>

            <Typography variant="body2" sx={{ color: '#a1a1aa', mt: 1, mb: 2, fontWeight: 300, leadingHeight: 1.6 }}>
              Where Beauty Meets Luxury. Premium 100% Virgin Hair Wigs, HD Lace Frontals, and Custom Master Salon Installation Services.
            </Typography>

            {/* Contact Details */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#a1a1aa', fontSize: '0.85rem' }}>
                <PhoneIcon sx={{ color: '#ff2a85', fontSize: '1.1rem' }} />
                <span>+234 810 089 0306</span>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#a1a1aa', fontSize: '0.85rem' }}>
                <EmailIcon sx={{ color: '#e6c687', fontSize: '1.1rem' }} />
                <span>Phina809@gmail.com</span>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#a1a1aa', fontSize: '0.85rem' }}>
                <LocationOnIcon sx={{ color: '#ff2a85', fontSize: '1.1rem' }} />
                <span>No 7 Mcc road by Mcc junction off wetheral opposite MTN office,Owerri Nigeria</span>
              </Box>
            </Box>
          </Grid>

          {/* COLUMN 2: SHOP COLLECTIONS */}
          <Grid item xs={12} sm={6} md={2.5}>
            <Typography variant="subtitle1" fontFamily="serif" fontWeight="bold" sx={{ color: '#e6c687', mb: 2.5, uppercase: true, letterSpacing: '1px' }}>
              Shop Collections
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography 
                onClick={() => navigate('/wigs/human-hair/frontal-wigs')} 
                variant="body2" 
                sx={{ color: '#a1a1aa', cursor: 'pointer', '&:hover': { color: '#ff2a85' }, transition: 'color 0.2s' }}
              >
                Human Hair Wigs
              </Typography>

              <Typography 
                onClick={() => navigate('/bundles/raw-hair/bundle-deals')} 
                variant="body2" 
                sx={{ color: '#a1a1aa', cursor: 'pointer', '&:hover': { color: '#ff2a85' }, transition: 'color 0.2s' }}
              >
                Raw Virgin Bundles
              </Typography>

              <Typography 
                onClick={() => navigate('/frontals/hd-lace/13x4-frontals')} 
                variant="body2" 
                sx={{ color: '#a1a1aa', cursor: 'pointer', '&:hover': { color: '#ff2a85' }, transition: 'color 0.2s' }}
              >
                HD Frontals & Closures
              </Typography>

              <Typography 
                onClick={() => navigate('/accessories/wig-care/bonnets')} 
                variant="body2" 
                sx={{ color: '#a1a1aa', cursor: 'pointer', '&:hover': { color: '#ff2a85' }, transition: 'color 0.2s' }}
              >
                Wig Care & Tools
              </Typography>
            </Box>
          </Grid>

          {/* COLUMN 3: SALON & CUSTOMER CARE */}
          <Grid item xs={12} sm={6} md={2.5}>
            <Typography variant="subtitle1" fontFamily="serif" fontWeight="bold" sx={{ color: '#e6c687', mb: 2.5, uppercase: true, letterSpacing: '1px' }}>
              Customer Service
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography 
                onClick={() => navigate('/account/order')} 
                variant="body2" 
                sx={{ color: '#a1a1aa', cursor: 'pointer', '&:hover': { color: '#e6c687' }, transition: 'color 0.2s' }}
              >
                Track My Orders
              </Typography>

              <Typography 
                onClick={() => navigate('/privacy-policy')} 
                variant="body2" 
                sx={{ color: '#a1a1aa', cursor: 'pointer', '&:hover': { color: '#e6c687' }, transition: 'color 0.2s' }}
              >
                Privacy & Shipping Policy
              </Typography>

              <Typography 
                onClick={() => navigate('/terms-condition')} 
                variant="body2" 
                sx={{ color: '#a1a1aa', cursor: 'pointer', '&:hover': { color: '#e6c687' }, transition: 'color 0.2s' }}
              >
                Terms & Conditions
              </Typography>

              <Typography 
                onClick={() => navigate('/contact')} 
                variant="body2" 
                sx={{ color: '#a1a1aa', cursor: 'pointer', '&:hover': { color: '#e6c687' }, transition: 'color 0.2s' }}
              >
                Contact Salon Team
              </Typography>
            </Box>
          </Grid>

          {/* COLUMN 4: SOCIAL MEDIA & CHAT */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontFamily="serif" fontWeight="bold" sx={{ color: '#e6c687', mb: 2.5, uppercase: true, letterSpacing: '1px' }}>
              Connect With Us
            </Typography>

            <Typography variant="body2" sx={{ color: '#a1a1aa', mb: 2, fontWeight: 300 }}>
              You can reach out to us in any of our social account to serve you better or follow us for daily updates on wigs and hair care.
            </Typography>

            {/* Social Media Icon Buttons */}
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              
              {/* WHATSAPP LINK */}
              <IconButton 
                component="a" 
                href={socialLinks.whatsapp} 
                target="_blank" 
                rel="noopener noreferrer"
                sx={{ 
                  bgcolor: 'rgba(37, 211, 102, 0.15)', 
                  color: '#25D366', 
                  border: '1px solid rgba(37, 211, 102, 0.3)',
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
                  bgcolor: 'rgba(255, 42, 133, 0.15)', 
                  color: '#ff2a85', 
                  border: '1px solid rgba(255, 42, 133, 0.3)',
                  '&:hover': { bgcolor: '#ff2a85', color: 'white', transform: 'scale(1.1)' },
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
                  bgcolor: 'rgba(24, 119, 242, 0.15)', 
                  color: '#1877F2', 
                  border: '1px solid rgba(24, 119, 242, 0.3)',
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
                  bgcolor: 'rgba(230, 198, 135, 0.15)', 
                  color: '#e6c687', 
                  border: '1px solid rgba(230, 198, 135, 0.3)',
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
        <Box sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', mt: 6, pt: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="caption" sx={{ color: '#71717a' }}>
            © {new Date().getFullYear()} Phyna Hairs & Beauty Salon. All rights reserved.
          </Typography>

          <Typography variant="caption" sx={{ color: '#71717a' }}>
            Designed for Luxury Beauty & E-Commerce Experience
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;