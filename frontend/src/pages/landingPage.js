import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Grid, Paper, Box } from '@mui/material';
import { Group, PersonAdd, Chat } from '@mui/icons-material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import LoginModal from '../modals/loginModal';
import QrCodeModal from '../modals/qrcodeModal';

function LandingPage() {
    const [open, setOpen] = useState(false);
    const [qrCodeOpen, setQrCodeOpen] = useState(false);
    
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleQrCodeOpen = () => {
        setQrCodeOpen(true);
    };

    const handleQrCodeClose = () => {
        setQrCodeOpen(false);
    };

    return (
        <div>
            {/* Header */}
            <AppBar position="static" sx={{ backgroundColor: '#003366' }}>
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1, fontWeight: 'bold' }}>
                        <span style={{ color: '#4D9CFA' }}>SOFT</span>
                        <span style={{ color: '#FFFFFF' }}>SHARES</span>
                    </Typography>
                    <Button color="inherit" onClick={handleOpen}>
                        Entrar
                    </Button>
                </Toolbar>
            </AppBar>
            <LoginModal open={open} handleClose={handleClose} />

            {/* Hero Section */}
            <Box sx={{
                background: 'linear-gradient(135deg, #0056b3 30%, #003366 90%)',
                color: 'white',
                padding: '60px 0',
                textAlign: 'center'
            }}>
                <Container>
                    <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Torne a sua empresa mais próxima com SoftShares
                    </Typography>
                    <Typography variant="h6">
                        Junte-se a nós na utilização de SoftShares e descubra como podemos transformar a maneira como sua empresa se conecta, colabora e cresce. Sem distâncias e sem fronteiras!
                    </Typography>
                </Container>
            </Box>

            {/* Why SoftShares */}
            <Container sx={{ padding: '5% 0' }}>
                <Typography variant="h4" gutterBottom align="center">
                    Porquê usar SoftShares?
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ padding: '20px', textAlign: 'center' }}>
                            <Group fontSize="large" sx={{ color: '#4D9CFA', marginBottom: '10px' }} />
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Conexão Unida</Typography>
                            <Typography>Simplifica a comunicação, proporcionando um espaço digital unido.</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ padding: '20px', textAlign: 'center' }}>
                            <PersonAdd fontSize="large" sx={{ color: '#4D9CFA', marginBottom: '10px' }} />
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Integração Fácil</Typography>
                            <Typography>Facilita a entrada de novos elementos, com a proximidade de outros membros.</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ padding: '20px', textAlign: 'center' }}>
                            <Chat fontSize="large" sx={{ color: '#4D9CFA', marginBottom: '10px' }} />
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Promove a ligação da equipa</Typography>
                            <Typography>Com recursos como chats, fóruns e eventos, fortalece os laços entre os membros da equipa.</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            {/* Statistics */}
            <Container sx={{
                backgroundColor: '#f0f0f0',
                padding: '50px 0',
                maxWidth: '100%'
            }}>
                 {/* <Container sx={{ backgroundColor: '#f0f0f0', padding: '30px 0', width: '100%', maxWidth: { xs: '100%', md: '1200px' }, '@media (min-width: 1200px)': { maxWidth: '100%', }, }}></Container> */}
                <Typography variant="h4" gutterBottom align="center">
                    Deixe as estatísticas falarem alto
                </Typography>
                <Grid container spacing={4} justifyContent="center">
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper elevation={3} sx={{ padding: '20px', textAlign: 'center' }}>
                            <Typography variant="h3" sx={{ color: '#003366' }}>240%</Typography>
                            <Typography>Crescimento da Comunidade</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper elevation={3} sx={{ padding: '20px', textAlign: 'center' }}>
                            <Typography variant="h3" sx={{ color: '#003366' }}>90%</Typography>
                            <Typography>Integração mais Rápida</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper elevation={3} sx={{ padding: '20px', textAlign: 'center' }}>
                            <Typography variant="h3" sx={{ color: '#003366' }}>500+</Typography>
                            <Typography>Membros</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper elevation={3} sx={{ padding: '20px', textAlign: 'center' }}>
                            <Typography variant="h3" sx={{ color: '#003366' }}>40%</Typography>
                            <Typography>Eficiência na Comunicação</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            {/* Call to Action */}
            <Box sx={{
                background: 'linear-gradient(135deg, #0056b3 30%, #003366 90%)',
                color: 'white',
                padding: '50px 0',
                textAlign: 'center'
            }}>
                <Container>
                    <Typography variant="h4" gutterBottom>
                        Aproveite e junte-se a nós!
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Descarregue a nossa app
                    </Typography>
                    <Button variant="contained" color="secondary" startIcon={<QrCodeScannerIcon />} onClick={handleQrCodeOpen}>
                        SCAN ME
                    </Button>
                </Container>
            </Box>
            <QrCodeModal open={qrCodeOpen} handleClose={handleQrCodeClose} />

            {/* Footer */}
            <Box sx={{ backgroundColor: '#333', color: 'white', padding: '20px 0', textAlign: 'center' }}>
                <Typography variant="body1">&copy; 2024 SoftShares. All rights reserved.</Typography>
            </Box>
        </div>
    );
}

export default LandingPage;
