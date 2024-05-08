import React, { useState, useEffect } from 'react';
import './page.css';
/* COMPONENTES */
import DataTable from '../components/tables/dataTable';
import EditButton from '../components/buttons/editButton';
import Header from '../components/header/header';
import AddButton from '../components/buttons/addButton';
import Search from '../components/textFields/search';
import StateChanger from '../components/stateChanger/stateChanger';
/* FIM COMPONENTES */
import NovaPub from '../modals/novaPub';

export default function ListaPublicacoes() {
    const [isNewModalOpen, setNewModalOpen] = useState(false);
    const [filtroText, setFiltroText] = useState('');

    const tableColumns = [
        { field: 'id', headerName: 'ID', width: 50, headerAlign: 'center' },
        { field: 'titulo', headerName: 'Título', flex: 2, headerAlign: 'center' },
        { field: 'dataHora', headerName: 'Data e Hora de Criação', type: 'dateTime', width: 200, headerAlign: 'center' },
        { field: 'criadoPor', headerName: 'Criado por', flex: 1, headerAlign: 'center' },
        { field: 'estado', headerName: 'Estado', flex: 0.5, headerAlign: 'center', renderCell: (row) => ( <StateChanger status={row.value} />) },
        { field: 'edit', headerName: ' ', width: 90, headerAlign: 'center', sortable: false , renderCell: (row) => ( <EditButton caption=' ' /*onclick={} id={row.id}*/ />)},
    ];
    
    const tableRows = [
        { id: 1, titulo: 'teste', dataHora: new Date('2023-12-19T20:00:00'), criadoPor:'asd', estado: 'Ativo' },
        { id: 2, titulo: 'teste', dataHora: new Date('2023-12-19T20:00:00'), criadoPor:'asd', estado: 'Inativo' },
    ];

    const handleOpenNewModal = () => {
        setNewModalOpen(true);
    };

    const handleCloseNewModal = () => {
        setNewModalOpen(false);
    };

    const handleTextFilter = (e) => {
        setFiltroText(e.target.value);
    };

    return(
        <div className="page-container">
            <Header caption='Publicações' />
            <div className="data-container">
                <div style={{marginBottom:'20px', paddingTop: '20px'}}>
                    <AddButton caption='Adicionar' onclick={handleOpenNewModal} />
                    <Search onchange={handleTextFilter} />
                </div>
                <div style={{ height: '65vh', width: '99%', overflowY: 'auto', paddingBottom: '40px',border: 'none', boxShadow: 'none'}}>
                    <DataTable rows={tableRows || []} columns={tableColumns}/>
                </div>
            </div>
            <NovaPub open={isNewModalOpen} onClose={handleCloseNewModal}/>
        </div>
    )
}