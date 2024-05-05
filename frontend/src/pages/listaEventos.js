import React, { useState, useEffect } from 'react';
import './page.css';
import DataTable from '../components/tables/dataTable';
import EditButton from '../components/buttons/editButton';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function ListaEventos() {

    const tableColumns = [
        { field: 'id', headerName: 'ID', width: 50 },
        { field: 'titulo', headerName: 'Título', flex: 2 },
        { field: 'nParticipantes', headerName: '# Participantes', flex: 0.5 },
        { field: 'dataHora', headerName: 'Data e Hora de Começo', type: 'dateTime', width: 200 },
        { field: 'localizacao', headerName: 'Localização', flex: 1 },
        { field: 'edit', headerName: ' ', width: 90, renderCell: (row) => ( <EditButton caption=' ' /*onclick={} id={row.id}*/ />), sortable: false},
    ];

    const tableRows = [
        { id: 1, titulo: 'teste', nParticipantes: '10 / -', dataHora: new Date('2023-12-19T20:00:00'), localizacao: 'teste' },
    ];

    return(
        <div className="page-container">
            <div className="header">
                <h1 className="title">Eventos</h1>
                <div className="user-options">
                    <NotificationsIcon /* onClick={handleNotificationsClick} */ />
                    <AccountCircleIcon /* onClick={handleAccountClick} */ />
                </div>
            </div>
            <div className="data-container">
                <DataTable rows={tableRows || []} columns={tableColumns} />
            </div>
        </div>
    )
}