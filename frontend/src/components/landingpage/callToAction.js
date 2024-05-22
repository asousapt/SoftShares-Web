import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';

const CallToAction = () => {
  return (
    <Box sx={{ backgroundColor: '#1976d2', color: 'white', padding: '50px 0' }}>
      <Container sx={{ textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Aproveite e junte-se a nós!
        </Typography>
        <Typography variant="h6" gutterBottom>
          Descarregue a nossa app
        </Typography>
        <Button variant="contained" color="secondary" startIcon={<QrCodeScannerIcon />}>
          SCAN ME
        </Button>
      </Container>
    </Box>
  );
};

export default CallToAction;
