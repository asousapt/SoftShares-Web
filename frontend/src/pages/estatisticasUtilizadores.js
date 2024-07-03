import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './page.css';
/* COMPONENTES */
import Header from '../components/header/header';
import ListUsersComents from '../components/charts/listaUsersComents';
import ListUsersPub from '../components/charts/listaUsersPub';
import LineChart from '../components/charts/linechart';
import BarChart from '../components/charts/barchart';
import ListInfo from '../components/charts/info';
/* FIM COMPONENTES */
import NovoEvento from '../modals/eventos/novoEvento';

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
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Estatísticas Gerais</h2>
                    <div style={{ height: '69vh', width: '99%', overflowY: 'auto', paddingBottom: '40px', border: 'none', boxShadow: 'none' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', maxWidth: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'center', flex: '1', maxWidth: '100%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', flex: '4', maxWidth: '100%', textAlign: 'center', gap: '20px'}}>
                                        <ListUsersComents />
                                        <ListUsersPub />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'center', flex: '4', maxWidth: '100%', textAlign: 'center' }}>
                                        <ListInfo />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', maxWidth: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', flex: '1', maxWidth: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'center', flex: '2', maxWidth: '100%', textAlign: 'center', gap: '20px' }}>
                                    <LineChart />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', flex: '2', maxWidth: '100%', textAlign: 'center' }}>
                                    <BarChart /> 
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <NovoEvento open={isNewModalOpen} onClose={handleCloseNewModal} />
            </div>
        </div>
    );
}