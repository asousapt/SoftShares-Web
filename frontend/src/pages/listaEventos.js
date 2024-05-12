import React, { useState, useEffect } from 'react';
import './page.css';
/* COMPONENTES */
import DataTable from '../components/tables/dataTable';
import EditButton from '../components/buttons/editButton';
import Header from '../components/header/header';
import AddButton from '../components/buttons/addButton';
import Search from '../components/textFields/search';
import ComboFilter from '../components/combobox/comboFilter';
/* FIM COMPONENTES */
import NovoEvento from '../modals/novoEvento';

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

export default function ListaEventos() {
    const [isNewModalOpen, setNewModalOpen] = useState(false);
    const [filtroText, setFiltroText] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('Todos');
    const [filtroCategoria, setFiltroCategoria] = useState('Todos');

    const tableColumns = [
        { field: 'id', headerName: 'ID', width: 100, headerAlign: 'left' },
        { field: 'titulo', headerName: 'Título', flex: 1, headerAlign: 'left' },
        { field: 'nParticipantes', headerName: '# Participantes', flex: 0.5, headerAlign: 'left' },
        { field: 'dataHora', headerName: 'Data e Hora de Começo', type: 'dateTime', width: 300, headerAlign: 'left' },
        { field: 'localizacao', headerName: 'Localização', flex: 1, headerAlign: 'left' },
        { field: 'edit', headerName: ' ', width: 90, headerAlign: 'left', sortable: false , renderCell: (row) => ( <EditButton caption=' ' /*onclick={} id={row.id}*/ />)},
    ];

    const tableRows = [
        { id: 1, titulo: 'teste', nParticipantes: '10 / -', dataHora: new Date('2023-12-19T20:00:00'), localizacao: 'teste' },
        { id: 1, titulo: 'teste', nParticipantes: '10 / -', dataHora: new Date('2023-12-19T20:00:00'), localizacao: 'teste' },
        { id: 1, titulo: 'teste', nParticipantes: '10 / -', dataHora: new Date('2023-12-19T20:00:00'), localizacao: 'teste' },
        { id: 1, titulo: 'teste', nParticipantes: '10 / -', dataHora: new Date('2023-12-19T20:00:00'), localizacao: 'teste' },
        { id: 1, titulo: 'teste', nParticipantes: '10 / -', dataHora: new Date('2023-12-19T20:00:00'), localizacao: 'teste' },
        { id: 1, titulo: 'teste', nParticipantes: '10 / -', dataHora: new Date('2023-12-19T20:00:00'), localizacao: 'teste' },
        { id: 1, titulo: 'teste', nParticipantes: '10 / -', dataHora: new Date('2023-12-19T20:00:00'), localizacao: 'teste' },
        { id: 1, titulo: 'teste', nParticipantes: '10 / -', dataHora: new Date('2023-12-19T20:00:00'), localizacao: 'teste' },
        { id: 1, titulo: 'teste', nParticipantes: '10 / -', dataHora: new Date('2023-12-19T20:00:00'), localizacao: 'teste' },
        { id: 1, titulo: 'teste', nParticipantes: '10 / -', dataHora: new Date('2023-12-19T20:00:00'), localizacao: 'teste' },
        { id: 1, titulo: 'teste', nParticipantes: '10 / -', dataHora: new Date('2023-12-19T20:00:00'), localizacao: 'teste' },
        { id: 1, titulo: 'teste', nParticipantes: '10 / -', dataHora: new Date('2023-12-19T20:00:00'), localizacao: 'teste' },
        { id: 1, titulo: 'teste', nParticipantes: '10 / -', dataHora: new Date('2023-12-19T20:00:00'), localizacao: 'teste' },
        { id: 1, titulo: 'teste', nParticipantes: '10 / -', dataHora: new Date('2023-12-19T20:00:00'), localizacao: 'teste' },
        { id: 1, titulo: 'teste', nParticipantes: '10 / -', dataHora: new Date('2023-12-19T20:00:00'), localizacao: 'teste' },
        { id: 1, titulo: 'teste', nParticipantes: '10 / -', dataHora: new Date('2023-12-19T20:00:00'), localizacao: 'teste' },
        { id: 1, titulo: 'teste', nParticipantes: '10 / -', dataHora: new Date('2023-12-19T20:00:00'), localizacao: 'teste' },
        { id: 1, titulo: 'teste', nParticipantes: '10 / -', dataHora: new Date('2023-12-19T20:00:00'), localizacao: 'teste' },
        { id: 1, titulo: 'teste', nParticipantes: '10 / -', dataHora: new Date('2023-12-19T20:00:00'), localizacao: 'teste' },
        { id: 1, titulo: 'teste', nParticipantes: '10 / -', dataHora: new Date('2023-12-19T20:00:00'), localizacao: 'teste' },
        { id: 1, titulo: 'teste', nParticipantes: '10 / -', dataHora: new Date('2023-12-19T20:00:00'), localizacao: 'teste' },
        { id: 1, titulo: 'teste', nParticipantes: '10 / -', dataHora: new Date('2023-12-19T20:00:00'), localizacao: 'teste' },
        { id: 1, titulo: 'teste', nParticipantes: '10 / -', dataHora: new Date('2023-12-19T20:00:00'), localizacao: 'teste' },
        { id: 1, titulo: 'teste', nParticipantes: '10 / -', dataHora: new Date('2023-12-19T20:00:00'), localizacao: 'teste' },
        { id: 1, titulo: 'teste', nParticipantes: '10 / -', dataHora: new Date('2023-12-19T20:00:00'), localizacao: 'teste' },
        { id: 1, titulo: 'teste', nParticipantes: '10 / -', dataHora: new Date('2023-12-19T20:00:00'), localizacao: 'teste' },
        { id: 1, titulo: 'teste', nParticipantes: '10 / -', dataHora: new Date('2023-12-19T20:00:00'), localizacao: 'teste' },
        { id: 1, titulo: 'teste', nParticipantes: '10 / -', dataHora: new Date('2023-12-19T20:00:00'), localizacao: 'teste' },
        { id: 1, titulo: 'teste', nParticipantes: '10 / -', dataHora: new Date('2023-12-19T20:00:00'), localizacao: 'teste' },
        { id: 1, titulo: 'teste', nParticipantes: '10 / -', dataHora: new Date('2023-12-19T20:00:00'), localizacao: 'teste' },
        { id: 1, titulo: 'teste', nParticipantes: '10 / -', dataHora: new Date('2023-12-19T20:00:00'), localizacao: 'teste' },
        { id: 1, titulo: 'teste', nParticipantes: '10 / -', dataHora: new Date('2023-12-19T20:00:00'), localizacao: 'teste' },
        { id: 1, titulo: 'teste', nParticipantes: '10 / -', dataHora: new Date('2023-12-19T20:00:00'), localizacao: 'teste' },
        { id: 1, titulo: 'teste', nParticipantes: '10 / -', dataHora: new Date('2023-12-19T20:00:00'), localizacao: 'teste' },
        { id: 1, titulo: 'teste', nParticipantes: '10 / -', dataHora: new Date('2023-12-19T20:00:00'), localizacao: 'teste' },
        { id: 1, titulo: 'teste', nParticipantes: '10 / -', dataHora: new Date('2023-12-19T20:00:00'), localizacao: 'teste' },
        { id: 1, titulo: 'teste', nParticipantes: '10 / -', dataHora: new Date('2023-12-19T20:00:00'), localizacao: 'teste' },
        { id: 1, titulo: 'teste', nParticipantes: '10 / -', dataHora: new Date('2023-12-19T20:00:00'), localizacao: 'teste' },
        { id: 1, titulo: 'teste', nParticipantes: '10 / -', dataHora: new Date('2023-12-19T20:00:00'), localizacao: 'teste' },
        { id: 1, titulo: 'teste', nParticipantes: '10 / -', dataHora: new Date('2023-12-19T20:00:00'), localizacao: 'teste' },
        { id: 1, titulo: 'teste', nParticipantes: '10 / -', dataHora: new Date('2023-12-19T20:00:00'), localizacao: 'teste' },
        { id: 1, titulo: 'teste', nParticipantes: '10 / -', dataHora: new Date('2023-12-19T20:00:00'), localizacao: 'teste' },
        { id: 1, titulo: 'teste', nParticipantes: '10 / -', dataHora: new Date('2023-12-19T20:00:00'), localizacao: 'teste' },
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
            <Header caption='Eventos' />
            <div className="data-container">
                <div style={{marginBottom:'20px', paddingTop: '20px'}}>
                    <AddButton caption='Adicionar' onclick={handleOpenNewModal} />
                    <Search onchange={handleTextFilter} />
                    <ComboFilter options={opcoesFiltroEstado} value={filtroEstado} handleChange={(e) => setFiltroEstado(e.target.value)} />
                    <ComboFilter options={opcoesFiltroCat} value={filtroCategoria} handleChange={(e) => setFiltroCategoria(e.target.value)} />
                </div>
                <div style={{ height: '65vh', width: '99%', overflowY: 'auto', paddingBottom: '40px', border: 'none', boxShadow: 'none'}}>
                    <DataTable rows={tableRows || []} columns={tableColumns}/>
                </div>
            </div>
            <NovoEvento open={isNewModalOpen} onClose={handleCloseNewModal}/>
        </div>
    )
}