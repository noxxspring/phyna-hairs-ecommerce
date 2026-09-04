import React from 'react';
import { Box, Modal } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Login from './Login';
import Register from './Register';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
  bgcolor: '#1a1a24',
  color: 'white',
  boxShadow: 24,
  p: 4,
  borderRadius: 3,
  outline: 'none',
  border: '1px solid rgba(255,255,255,0.1)'
};

const AuthModal = ({ handleClose, open }) => {
  const location = useLocation();

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="auth-modal-title"
    >
      <Box sx={style}>
        {location.pathname === '/register' ? (
          <Register handleClose={handleClose} />
        ) : (
          <Login handleClose={handleClose} />
        )}
      </Box>
    </Modal>
  );
};

export default AuthModal;