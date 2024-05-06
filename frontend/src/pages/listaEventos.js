import React, { useState, useEffect } from 'react';
import './page.css';
import DataTable from '../components/tables/dataTable';
import EditButton from '../components/buttons/editButton';
import Header from '../components/header/header';
import AddButton from '../components/buttons/addButton';
import NovoEvento from '../modals/novoEvento';

export default function ListaEventos() {
    const [isNewModalOpen, setNewModalOpen] = useState(false);

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


    const handleOpenNewModal = () => {
        setNewModalOpen(true);
    };

    const handleCloseNewModal = () => {
        setNewModalOpen(false);
    };

    return(
        <div className="page-container">
            <Header caption='Eventos' />
            <div className="data-container">
                <AddButton caption='Adicionar' onclick={handleOpenNewModal} />
                <DataTable rows={tableRows || []} columns={tableColumns} />
            </div>
            <NovoEvento open={isNewModalOpen} onClose={handleCloseNewModal}/>
        </div>
    )
}