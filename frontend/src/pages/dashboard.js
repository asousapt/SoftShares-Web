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
    const [numPoiAprovar, setNumPoiAprovar] = useState(0);
    const [numEventoAprovar, setNumEventoAprovar] = useState(0);
    const [error, setError] = useState(null);
    const [data1, setData1] = useState([]);
    const [total1, setTotal1] = useState(0);
    const [data3, setData3] = useState([]);
    const [total3, setTotal3] = useState(0);
    const [data2, setData2] = useState([]);
    const [total2, setTotal2] = useState(0);

    useEffect(() => {
        const fetchDataPieCharts = async () => {
            try {
                const token = sessionStorage.getItem('token');

                const polosResponse = await axios.get('http://localhost:8000/utilizadores/totalpolo', {
                    headers: {
                        Authorization: `${token}`
                    }
                });
                const polosCount = polosResponse.data.data;

                setTotal1(polosCount.reduce((acc, polo) => acc + parseFloat(polo.value), 0));

                const formattedData = polosCount.map((polo) => ({
                    value: Math.round((parseFloat(polo.value) / parseFloat(total1)) * 100),
                    label: polo.label
                }));

                setData1(formattedData);

                const eventosResponse = await axios.get('http://localhost:8000/evento', {
                    headers: {
                        Authorization: `${token}`
                    }
                });
                const eventosCount = eventosResponse.data.data.length;

                const poiResponse = await axios.get('http://localhost:8000/pontoInteresse', {
                    headers: {
                        Authorization: `${token}`
                    }
                });
                const poiCount = poiResponse.data.data.length;

                const publicacoesResponse = await axios.get('http://localhost:8000/thread', {
                    headers: {
                        Authorization: `${token}`
                    }
                });
                const publicacoesCount = publicacoesResponse.data.data.length;

                const total = eventosCount + poiCount + publicacoesCount
                setTotal3(total);

                const formattedData3 = [
                    { value: (poiCount / total) * 100, label: 'Pontos de Interesse' },
                    { value: (publicacoesCount / total) * 100, label: 'Publicações no Fórum' },
                    { value: (eventosCount / total) * 100, label: 'Eventos' }
                ];

                setData3(formattedData3.map(item => ({
                    ...item,
                    value: parseFloat(item.value.toFixed(0))
                })));

                const denunciaResponse = await axios.get('http://localhost:8000/denuncia/count', {
                    headers: {
                        Authorization: `${token}`
                    }
                });
                const denunciaCount = denunciaResponse.data.data;

                const totalDenuncia = denunciaCount.reduce((acc, item) => acc + parseFloat(item.count), 0);
                setTotal2(totalDenuncia);

                const formattedData2 = denunciaCount.map((item) => ({
                    value: (parseFloat(item.count) / totalDenuncia) * 100,
                    label: item.descricao
                }));
                setData2(formattedData2.map(item => ({
                    ...item,
                    value: parseFloat(item.value.toFixed(0))
                })));

            } catch (error) {
                setError(error);
            }
        };

        fetchDataPieCharts();
    }, [total1, total3]);

    useEffect(() => {
        const fetchDataAprovar = async () => {
            try {
                const token = sessionStorage.getItem('token');

                const eventosResponse = await axios.get('http://localhost:8000/evento/porAprovar', {
                    headers: {
                        Authorization: `${token}`
                    },
                    params: {
                        descricao: ''
                    }
                });
                const eventosCount = eventosResponse.data.data.length;
                setNumEventoAprovar(eventosCount);

                const PoiResponse = await axios.get('http://localhost:8000/pontoInteresse/porAprovar', {
                    headers: {
                        Authorization: `${token}`
                    },
                    params: {
                        descricao: ''
                    }
                });
                const PoiCount = PoiResponse.data.data.length;
                setNumPoiAprovar(PoiCount);
            } catch (error) {
                setError(error);
            }
        };

        fetchDataAprovar();
    }, [])

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
                            <ChartPie style={{ maxWidth: '100%' }} chartData={data1} total={total1} label='Utilizadores' />
                        </Grid>
                        <Grid item xs={12} md={4} style={{ display: 'flex', justifyContent: 'center', maxWidth: '100%' }}>
                            <ChartPie style={{ maxWidth: '100%' }} chartData={data2} total={total2} label='Denúnicas Polo' />
                        </Grid>
                        <Grid item xs={12} md={4} style={{ display: 'flex', justifyContent: 'center', maxWidth: '100%' }}>
                            <ChartPie style={{ maxWidth: '100%' }} chartData={data3} total={total3} label='Nº Registos' />
                        </Grid>
                    </Grid>
                </div>
            </div>
        </div>
    )
}
