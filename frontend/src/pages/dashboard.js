import React, { useState, useEffect } from 'react';
import './page.css';
/* COMPONENTES */
import DataTable from '../components/tables/dataTable';
import EditButton from '../components/buttons/editButton';
import Header from '../components/header/header';
import AddButton from '../components/buttons/addButton';
import Search from '../components/textFields/search';
/* FIM COMPONENTES */
import NovoEvento from '../modals/novoEvento';
import ChartPie from '../components/charts/chartpie';
import ChartPie1 from '../components/charts/chartpie1';
import ChartPie2 from '../components/charts/chartpie2';
import { Grid } from '@mui/material';

export default function Dashboard() {
    const [isNewModalOpen, setNewModalOpen] = useState(false);
    const [filtroText, setFiltroText] = useState('');

    const handleOpenNewModal = () => {
        setNewModalOpen(true);
    };

    const handleCloseNewModal = () => {
        setNewModalOpen(false);
    };

    return (
        <div className="page-container">
            <Header caption='Painel de Controlo' />
            <div className="data-container">
                <div style={{ marginBottom: '40px'}}>
                <h2 style={{ marginBottom: '20px', textAlign: 'center'}} >Registos por Aprovar</h2>
                </div>
                <div style={{ height: '65vh', width: '99%', overflowY: 'auto', paddingBottom: '40px', border: 'none', boxShadow: 'none' }}>
                    
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                            <ChartPie />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <ChartPie1 />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <ChartPie2 />
                        </Grid>
                    </Grid>

                </div>
            </div>
            <NovoEvento open={isNewModalOpen} onClose={handleCloseNewModal} />
        </div>
    )
}