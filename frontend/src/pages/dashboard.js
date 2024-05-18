import React, { useState, useEffect } from 'react';
import './page.css';
/* COMPONENTES */
import Header from '../components/header/header';
import ChartPieUsers from '../components/charts/chartpieUsers';
import ChartpieRegistos from '../components/charts/chartpieRegistos';
import ChartpieRegistos2 from '../components/charts/chartpieRegistos2';
/* FIM COMPONENTES */
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ForumIcon from '@mui/icons-material/Forum';
import EventIcon from '@mui/icons-material/Event';
import { Grid } from '@mui/material';

export default function Dashboard() {
    const [numPoiAprovar, setNumPoiAprovar] = useState('13');
    const [numPubAprovar, setNumPubAprovar] = useState('35');
    const [numEventoAprovar, setNumEventoAprovar] = useState('9');

    return (
        <div className="page-container">
            <Header caption='Painel de Controlo' />
            <div className="data-container">
                <div style={{ display: 'flex', textAlign: 'center', alignItems: 'center', flexDirection: 'column', paddingBottom: 20 }}>
                    <h3>Registo por Aprovar</h3>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '50%', marginRight: '5%' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ display: 'flex' }}>
                                <LocationOnIcon />
                                <h4 style={{ color: '#656262', margin: '0', padding: '0' }}>{numPoiAprovar}</h4>
                            </div>
                            <h4 style={{ color: 'black', margin: '0', padding: '0', marginTop: '0.5rem' }}>Pontos de Interesse</h4>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', whiteSpace: 'nowrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <ForumIcon />
                                <h4 style={{ color: '#656262', margin: '0', padding: '0' }}>{numPubAprovar}</h4>
                            </div>
                            <h4 style={{ color: 'black', margin: '0', padding: '0', marginTop: '0.5rem' }}>Publicações</h4>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', whiteSpace: 'nowrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <EventIcon />
                                <h4 style={{ color: '#656262', margin: '0', padding: '0' }}>{numEventoAprovar}</h4>
                            </div>
                            <h4 style={{ color: 'black', margin: '0', padding: '0', marginTop: '0.5rem' }}>Eventos</h4>
                        </div>
                    </div>
                </div>
                <div style={{ height: '65vh', width: '99%', overflowY: 'auto', paddingBottom: '40px', border: 'none', boxShadow: 'none' }}>
                    <Grid container spacing={1} wrap="wrap">
                        <Grid item xs={12} md={4} style={{ display: 'flex', justifyContent: 'center', maxWidth: '100%' }}>
                            <ChartPieUsers style={{ maxWidth: '100%' }} />
                        </Grid>
                        <Grid item xs={12} md={4} style={{ display: 'flex', justifyContent: 'center', maxWidth: '100%' }}>
                            <ChartpieRegistos style={{ maxWidth: '100%' }} />
                        </Grid>
                        <Grid item xs={12} md={4} style={{ display: 'flex', justifyContent: 'center', maxWidth: '100%' }}>
                            <ChartpieRegistos2 style={{ maxWidth: '100%' }} />
                        </Grid>
                    </Grid>
                </div>
            </div>
        </div>
    )
}
