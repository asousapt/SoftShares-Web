import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: '#333', color: 'white', padding: '20px 0', textAlign: 'center' }}>
      <Typography variant="body1">&copy; 2024 SoftShares. All rights reserved.</Typography>
    </Box>
  );
};

export default Footer;
