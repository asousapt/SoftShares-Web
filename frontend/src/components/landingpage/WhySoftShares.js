import React from 'react';
import { Container, Grid, Paper, Typography } from '@mui/material';
import { Group, PersonAdd, Chat } from '@mui/icons-material';

const WhySoftShares = () => {
  return (
    <Container sx={{ padding: '50px 0' }}>
      <Typography variant="h4" gutterBottom>
        Porquê usar Softshares?
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ padding: '20px', textAlign: 'center' }}>
            <Group fontSize="large" />
            <Typography variant="h6">Conexão Unida</Typography>
            <Typography>Simplifica a comunicação, proporcionando um espaço digital unido.</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ padding: '20px', textAlign: 'center' }}>
            <PersonAdd fontSize="large" />
            <Typography variant="h6">Integração Fácil</Typography>
            <Typography>Facilita a entrada de novos elementos, com a proximidade de outros membros.</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ padding: '20px', textAlign: 'center' }}>
            <Chat fontSize="large" />
            <Typography variant="h6">Promove a ligação da equipa</Typography>
            <Typography>Com recursos como chats, fóruns e eventos, fortalece os laços entre os membros da equipa.</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default WhySoftShares;
