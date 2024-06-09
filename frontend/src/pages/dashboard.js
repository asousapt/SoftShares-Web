import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './page.css';
/* COMPONENTES */
import Header from '../components/header/header';
import ChartPie from '../components/charts/chartpie';
/* FIM COMPONENTES */
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventIcon from '@mui/icons-material/Event';
import { Grid } from '@mui/material';

export default function Dashboard() {
    const [numPoiAprovar, setNumPoiAprovar] = useState('13');
    const [numEventoAprovar, setNumEventoAprovar] = useState('9');
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);
    const [total, setTotal] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = sessionStorage.getItem('token');

                const polosResponse = await axios.get('http://localhost:8000/utilizadores/totalpolo', {
                    headers: {
                        Authorization: `${token}`
                    }
                });
                const polosCount = polosResponse.data.data;
                
                setTotal(polosCount.reduce((acc, polo) => acc + parseFloat(polo.value), 0));
                
                const formattedData = polosCount.map((polo) => ({
                    value: Math.round((parseFloat(polo.value) / parseFloat(total)) * 100),
                    label: polo.label
                }));
                
                setData(formattedData);
            } catch (error) {
                setError(error);
            }
        };
    
        fetchData();
    }, [total]);

    return (
        <div className="page-container">
            <Header caption='Painel de Controlo' />
            <div className="data-container">
                <div style={{ display: 'flex', textAlign: 'center', alignItems: 'center', flexDirection: 'column', paddingBottom: 20 }}>
                    <h3>Registo por Aprovar</h3>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '25%', marginRight: '5%' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ display: 'flex' }}>
                                <LocationOnIcon />
                                <h4 style={{ color: '#656262', margin: '0', padding: '0' }}>{numPoiAprovar}</h4>
                            </div>
                            <h4 style={{ color: 'black', margin: '0', padding: '0', marginTop: '0.5rem' }}>Pontos de Interesse</h4>
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
                            <ChartPie style={{ maxWidth: '100%' }} chartData={data} total={total} label='Utilizadores' />
                        </Grid>
                        <Grid item xs={12} md={4} style={{ display: 'flex', justifyContent: 'center', maxWidth: '100%' }}>
                            <ChartPie style={{ maxWidth: '100%' }} chartData={[]} total={0} label='Registos' />
                        </Grid>
                        <Grid item xs={12} md={4} style={{ display: 'flex', justifyContent: 'center', maxWidth: '100%' }}>
                            <ChartPie style={{ maxWidth: '100%' }} chartData={[]} total={0} label='Registos' />
                        </Grid>
                    </Grid>
                </div>
            </div>
        </div>
    )
}
