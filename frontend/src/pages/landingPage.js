import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Grid, Paper, Box } from '@mui/material';
import { Group, PersonAdd, Chat } from '@mui/icons-material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import LoginModal from '../modals/loginModal';

function LandingPage() {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            {/* Header */}
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        SOFTSHARES
                    </Typography>
                    <Button color="inherit" onClick={handleOpen}>
                        Entrar
                    </Button>
                </Toolbar>
            </AppBar>
            <LoginModal open={open} handleClose={handleClose} />

            {/* Hero Section */}
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

            {/* Why SoftShares */}
            <Container sx={{ padding: '5% 0' }}>
                <Typography variant="h4" gutterBottom>
                    Porquê usar Softshares?
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ padding: '10%', textAlign: 'center' }}>
                            <Group fontSize="large" />
                            <Typography variant="h6">Conexão Unida</Typography>
                            <Typography>Simplifica a comunicação, proporcionando um espaço digital unido.</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ padding: '10%', textAlign: 'center' }}>
                            <PersonAdd fontSize="large" />
                            <Typography variant="h6">Integração Fácil</Typography>
                            <Typography>Facilita a entrada de novos elementos, com a proximidade de outros membros.</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ padding: '10%', textAlign: 'center' }}>
                            <Chat fontSize="large" />
                            <Typography variant="h6">Promove a ligação da equipa</Typography>
                            <Typography>Com recursos como chats, fóruns e eventos, fortalece os laços entre os membros da equipa.</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            {/* Statistics */}
            <Container sx={{ backgroundColor: '#e0e0e0', padding: '30px 0', width: '100%', maxWidth: '100%' }}>
                <Typography variant="h4" gutterBottom align="center">
                    Deixe as estatísticas falarem alto
                </Typography>
                <Grid container spacing={4} justifyContent="center">
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper elevation={3} sx={{ padding: '20px', textAlign: 'center' }}>
                            <Typography variant="h3">240%</Typography>
                            <Typography>Crescimento da Comunidade</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper elevation={3} sx={{ padding: '20px', textAlign: 'center' }}>
                            <Typography variant="h3">90%</Typography>
                            <Typography>Integração mais Rápida</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper elevation={3} sx={{ padding: '20px', textAlign: 'center' }}>
                            <Typography variant="h3">500+</Typography>
                            <Typography>Membros</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper elevation={3} sx={{ padding: '20px', textAlign: 'center' }}>
                            <Typography variant="h3">40%</Typography>
                            <Typography>Eficiência na Comunicação</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            {/* Call to Action */}
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

            {/* Footer */}
            <Box sx={{ backgroundColor: '#333', color: 'white', padding: '20px 0', textAlign: 'center' }}>
                <Typography variant="body1">&copy; 2024 SoftShares. All rights reserved.</Typography>
            </Box>
        </div>
    );
}

export default LandingPage;
