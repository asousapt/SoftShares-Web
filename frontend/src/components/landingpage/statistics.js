import React from 'react';
import { Container, Grid, Paper, Typography } from '@mui/material';

const Statistics = () => {
  return (
    <Container sx={{ backgroundColor: '#e0e0e0', padding: '50px 0' }}>
      <Typography variant="h4" gutterBottom>
        Deixe as estatísticas falarem alto
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ padding: '20px', textAlign: 'center' }}>
            <Typography variant="h3">240%</Typography>
            <Typography>Crescimento da Comunidade</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ padding: '20px', textAlign: 'center' }}>
            <Typography variant="h3">90%</Typography>
            <Typography>Integração mais Rápida</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ padding: '20px', textAlign: 'center' }}>
            <Typography variant="h3">500+</Typography>
            <Typography>Membros</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ padding: '20px', textAlign: 'center' }}>
            <Typography variant="h3">40%</Typography>
            <Typography>Eficiência na Comunicação</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Statistics;
