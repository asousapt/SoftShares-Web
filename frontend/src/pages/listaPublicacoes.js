import React, { useState, useEffect } from 'react';
import './page.css';
/* COMPONENTES */
import DataTable from '../components/tables/dataTable';
import EditButton from '../components/buttons/editButton';
import Header from '../components/header/header';
import AddButton from '../components/buttons/addButton';
import Search from '../components/textFields/search';
import StateChanger from '../components/stateChanger/stateChanger';
import ComboFilter from '../components/combobox/comboFilter';
/* FIM COMPONENTES */
import NovaPub from '../modals/novaPub';

const opcoesFiltroEstado = [
    { value:'Todos', label: 'Todos'},
    { value:'Ativos', label: 'Apenas Ativos'},
    { value:'inativos', label: 'Apenas Inativos'}
];

const opcoesFiltroCat = [
    { value:'Todos', label: 'Todos'},
    { value:'Ativos', label: 'Apenas Ativos'},
    { value:'inativos', label: 'Apenas Inativos'}
];

export default function ListaPublicacoes() {
    const [isNewModalOpen, setNewModalOpen] = useState(false);
    const [filtroText, setFiltroText] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('Todos');
    const [filtroCategoria, setFiltroCategoria] = useState('Todos');

    const tableColumns = [
        { field: 'id', headerName: 'ID', width: 100, headerAlign: 'left' },
        { field: 'titulo', headerName: 'Título', flex: 1, headerAlign: 'left' },
        { field: 'dataHora', headerName: 'Data e Hora de Criação', type: 'dateTime', width: 300, headerAlign: 'left' },
        { field: 'criadoPor', headerName: 'Criado por', flex: 1, headerAlign: 'left' },
        { field: 'estado', headerName: 'Estado', width: 120, headerAlign: 'left', renderCell: (row) => ( <StateChanger status={row.value} />) },
        { field: 'edit', headerName: ' ', width: 90, headerAlign: 'left', sortable: false , renderCell: (row) => ( <EditButton caption=' ' /*onclick={} id={row.id}*/ />)},
    ];
    
    const tableRows = [
        { id: 1, titulo: 'teste', dataHora: new Date('2023-12-19T20:00:00'), criadoPor:'asd', estado: 'Ativo' },
        { id: 2, titulo: 'teste', dataHora: new Date('2023-12-19T20:00:00'), criadoPor:'asd', estado: 'Inativo' },
        { id: 3, titulo: 'teste', dataHora: new Date('2023-12-19T20:00:00'), criadoPor:'asd', estado: 'Ativo' },
        { id: 4, titulo: 'teste', dataHora: new Date('2023-12-19T20:00:00'), criadoPor:'asd', estado: 'Inativo' },
        { id: 5, titulo: 'teste', dataHora: new Date('2023-12-19T20:00:00'), criadoPor:'asd', estado: 'Ativo' },
        { id: 6, titulo: 'teste', dataHora: new Date('2023-12-19T20:00:00'), criadoPor:'asd', estado: 'Inativo' },
        { id: 7, titulo: 'teste', dataHora: new Date('2023-12-19T20:00:00'), criadoPor:'asd', estado: 'Ativo' },
        { id: 8, titulo: 'teste', dataHora: new Date('2023-12-19T20:00:00'), criadoPor:'asd', estado: 'Inativo' },
        { id: 9, titulo: 'teste', dataHora: new Date('2023-12-19T20:00:00'), criadoPor:'asd', estado: 'Ativo' },
        { id: 10, titulo: 'teste', dataHora: new Date('2023-12-19T20:00:00'), criadoPor:'asd', estado: 'Inativo' },
        { id: 11, titulo: 'teste', dataHora: new Date('2023-12-19T20:00:00'), criadoPor:'asd', estado: 'Ativo' },
        { id: 12, titulo: 'teste', dataHora: new Date('2023-12-19T20:00:00'), criadoPor:'asd', estado: 'Inativo' },
        { id: 13, titulo: 'teste', dataHora: new Date('2023-12-19T20:00:00'), criadoPor:'asd', estado: 'Ativo' },
        { id: 14, titulo: 'teste', dataHora: new Date('2023-12-19T20:00:00'), criadoPor:'asd', estado: 'Inativo' },
        { id: 15, titulo: 'teste', dataHora: new Date('2023-12-19T20:00:00'), criadoPor:'asd', estado: 'Ativo' },
        { id: 16, titulo: 'teste', dataHora: new Date('2023-12-19T20:00:00'), criadoPor:'asd', estado: 'Inativo' },
        { id: 17, titulo: 'teste', dataHora: new Date('2023-12-19T20:00:00'), criadoPor:'asd', estado: 'Ativo' },
        { id: 18, titulo: 'teste', dataHora: new Date('2023-12-19T20:00:00'), criadoPor:'asd', estado: 'Inativo' },
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
                    <ComboFilter options={opcoesFiltroEstado} value={filtroEstado} handleChange={(e) => setFiltroEstado(e.target.value)} />
                    <ComboFilter options={opcoesFiltroCat} value={filtroCategoria} handleChange={(e) => setFiltroCategoria(e.target.value)} />
                </div>
                <div style={{ height: '65vh', width: '99%', overflowY: 'auto', paddingBottom: '40px',border: 'none', boxShadow: 'none'}}>
                    <DataTable rows={tableRows || []} columns={tableColumns}/>
                </div>
            </div>
            <NovaPub open={isNewModalOpen} onClose={handleCloseNewModal}/>
        </div>
    )
}