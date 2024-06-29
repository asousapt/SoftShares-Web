import React, { useState, useEffect } from 'react';
import './page.css';
/* COMPONENTES */
import Header from '../components/header/header';
/* FIM COMPONENTES */
import NovoEvento from '../modals/eventos/novoEvento';
import { Grid } from '@mui/material';

export default function StatsDenuncias() {
    const [isNewModalOpen, setNewModalOpen] = useState(false);

    const handleCloseNewModal = () => {
        setNewModalOpen(false);
    };

    return (
        <div className="page-container">
            <Header caption='Painel de Controlo' />
            <div className="data-container">
                <div style={{ marginBottom: '40px' }}>
                    <h2 style={{ marginBottom: '20px', textAlign: 'center' }} >Estatísticas Denúncias</h2>
                </div>
                <div style={{ height: '65vh', width: '99%', overflowY: 'auto', paddingBottom: '40px', border: 'none', boxShadow: 'none' }}>

                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                            
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            
                        </Grid>
                    </Grid>

                </div>
            </div>
            <NovoEvento open={isNewModalOpen} onClose={handleCloseNewModal} />
        </div>
    )
}