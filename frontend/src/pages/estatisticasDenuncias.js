import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './page.css';
/* COMPONENTES */
import Header from '../components/header/header';
import ChartPie from '../components/charts/chartpie';
/* FIM COMPONENTES */
import NovoEvento from '../modals/eventos/novoEvento';
import { Grid } from '@mui/material';

export default function StatsDenuncias() {
    const [isNewModalOpen, setNewModalOpen] = useState(false);
    const [data1, setData1] = useState([]);
    const [total1, setTotal1] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDataPieCharts = async () => {
            try {
                const token = sessionStorage.getItem('token');

                const denunciaResponse = await axios.get(`${process.env.REACT_APP_API_URL}/denuncia/count`, {
                    headers: {
                        Authorization: `${token}`
                    }
                });
                const denunciaCount = denunciaResponse.data.data;

                const totalDenuncia = denunciaCount.reduce((acc, item) => acc + parseFloat(item.count), 0);
                setTotal1(totalDenuncia);

                const formattedData2 = denunciaCount.map((item) => ({
                    value: (parseFloat(item.count) / totalDenuncia) * 100,
                    label: item.descricao
                }));
                setData1(formattedData2.map(item => ({
                    ...item,
                    value: parseFloat(item.value.toFixed(0))
                })));

            } catch (error) {
                setError(error);
            }
        };

        fetchDataPieCharts();
    }, [total1]);

    const handleCloseNewModal = () => {
        setNewModalOpen(false);
    };

    return (
        <div className="page-container">
            <Header caption='Painel de Controlo' />
            <div className="data-container">
                <div style={{ display: 'flex', textAlign: 'center', alignItems: 'center', flexDirection: 'column', paddingBottom: 20 }}>
                <h2 style={{ marginBottom: '20px', textAlign: 'center'}} >Estatísticas Denúncias</h2>
                    <div style={{ height: '65vh', width: '99%', overflowY: 'auto', paddingBottom: '40px', border: 'none', boxShadow: 'none' }}>
                        <Grid container spacing={1} wrap="wrap">
                            <Grid item xs={12} md={4} style={{ display: 'flex', justifyContent: 'center', maxWidth: '100%' }}>
                                <ChartPie style={{ maxWidth: '100%' }} chartData={data1} total={total1} label='Denúnicas Polo' />
                            </Grid>

                            <Grid item xs={12} md={4} style={{ display: 'flex', justifyContent: 'center', maxWidth: '100%' }}>
                                <ChartPie style={{ maxWidth: '100%' }} chartData={[]} total={0} label='Denúnicas Users' />
                            </Grid>

                            <Grid item xs={12} md={4} style={{ display: 'flex', justifyContent: 'center', maxWidth: '100%' }}>
                                <ChartPie style={{ maxWidth: '100%' }} chartData={[]} total={0} label='Denúnicas ???' />
                            </Grid>
                        </Grid>
                    </div>
                </div>
                <NovoEvento open={isNewModalOpen} onClose={handleCloseNewModal} />
            </div>
        </div>
    )
}