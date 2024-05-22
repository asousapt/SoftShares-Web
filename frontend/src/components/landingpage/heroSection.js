import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const HeroSection = () => {
  return (
    <Box sx={{ backgroundColor: '#1976d2', color: 'white', padding: '50px 0' }}>
      <Container>
        <Typography variant="h3" gutterBottom>
          Torne a sua empresa mais próxima com SoftShares
        </Typography>
        <Typography variant="h6">
          Junte-se a nós na utilização de SoftShares e descubra como podemos transformar a maneira como sua empresa se conecta, colabora e cresce. Sem distâncias e sem fronteiras!
        </Typography>
      </Container>
    </Box>
  );
};

export default HeroSection;
