import React, { useState, useEffect } from 'react';
import './page.css';
/* COMPONENTES */
import DataTable from '../components/tables/dataTable';
import EditButton from '../components/buttons/editButton';
import AprovButton from '../components/buttons/aproveButton';
import RejButton from '../components/buttons/rejectButton';
import Header from '../components/header/header';
import AddButton from '../components/buttons/addButton';
import Search from '../components/textFields/search';
import StateChanger from '../components/stateChanger/stateChanger';
/* FIM COMPONENTES */
import NovoEvento from '../modals/novoEvento';

export default function ConfigPolos() {
    const [isNewModalOpen, setNewModalOpen] = useState(false);
    const [filtroText, setFiltroText] = useState('');

    const tableColumns = [
        { field: 'id', headerName: 'ID', width: 100, headerAlign: 'left' },
        { field: 'descricao', headerName: 'Descrição', flex: 0.5, headerAlign: 'left' },
        { field: 'numerousers', headerName: 'Utilizadores', flex: 0.5, headerAlign: 'left' },
        { field: 'localidade', headerName: 'Localidade', flex: 0.5, headerAlign: 'left' },
        { field: 'estado', headerName: 'Estado', width: 120, headerAlign: 'center', renderCell: (row) => ( <StateChanger status={row.value} />) },
        { field: 'status', headerName: ' ', width: 100, headerAlign: 'left', sortable: false , renderCell: (row) => ( <EditButton caption=' ' /*onclick={} id={row.id}*/ />)},
    ];

    const tableRows = [
        { id: 1, descricao: 'Campo de Viseu', numerousers: '2375', localidade: 'Viseu', estado: 'Ativo' },
        { id: 2, descricao: 'Campo de Coimbroes', numerousers: '235', localidade: 'Coimbroes', estado: 'Desativo' },
        { id: 3, descricao: 'Campo de Lisboa', numerousers: '1341', localidade: 'Lisboa', estado: 'Ativo' },
        { id: 4, descricao: 'Campo de Porto', numerousers: '123', localidade: 'Porto', estado: 'Ativo' },
        { id: 5, descricao: 'Campo de Aveiro', numerousers: '456', localidade: 'Aveiro', estado: 'Desativo' },
        { id: 6, descricao: 'Campo de Braga', numerousers: '789', localidade: 'Braga', estado: 'Ativo' },
        { id: 7, descricao: 'Campo de Faro', numerousers: '1011', localidade: 'Faro', estado: 'Ativo' },
        { id: 8, descricao: 'Campo de Leiria', numerousers: '1213', localidade: 'Leiria', estado: 'Desativo' },
        { id: 9, descricao: 'Campo de Setubal', numerousers: '1415', localidade: 'Setubal', estado: 'Desativo' },
        { id: 10, descricao: 'Campo de Viana', numerousers: '1617', localidade: 'Viana', estado: 'Desativo' },
        { id: 11, descricao: 'Campo de Guarda', numerousers: '1819', localidade: 'Guarda', estado: 'Ativo' },
        { id: 12, descricao: 'Campo de Santarem', numerousers: '2021', localidade: 'Santarem', estado: 'Ativo' },
        { id: 13, descricao: 'Campo de Beja', numerousers: '2223', localidade: 'Beja', estado: 'Ativo' },
        { id: 14, descricao: 'Campo de Evora', numerousers: '2425', localidade: 'Evora', estado: 'Ativo' },
        { id: 15, descricao: 'Campo de Portalegre', numerousers: '2627', localidade: 'Portalegre', estado: 'Desativo' },
        { id: 16, descricao: 'Campo de Braganca', numerousers: '2829', localidade: 'Braganca', estado: 'Desativo' },
        { id: 17, descricao: 'Campo de Castelo Branco', numerousers: '3031', localidade: 'Castelo Branco', estado: 'Ativo' },
        { id: 18, descricao: 'Campo de Vila Real', numerousers: '3233', localidade: 'Vila Real', estado: 'Desativo' },
        { id: 19, descricao: 'Campo de Viseu', numerousers: '3435', localidade: 'Viseu', estado: 'Ativo' },
        { id: 20, descricao: 'Campo de Coimbroes', numerousers: '3637', localidade: 'Coimbroes', estado: 'Desativo' },
        { id: 21, descricao: 'Campo de Lisboa', numerousers: '3839', localidade: 'Lisboa', estado: 'Ativo' },
        { id: 22, descricao: 'Campo de Porto', numerousers: '4041', localidade: 'Porto', estado: 'Ativo' },
        { id: 23, descricao: 'Campo de Aveiro', numerousers: '4243', localidade: 'Aveiro', estado: 'Ativo' },
        { id: 24, descricao: 'Campo de Braga', numerousers: '4445', localidade: 'Braga', estado: 'Ativo' },
        { id: 25, descricao: 'Campo de Faro', numerousers: '4647', localidade: 'Faro', estado: 'Ativo' },
        { id: 26, descricao: 'Campo de Leiria', numerousers: '4849', localidade: 'Leiria', estado: 'Desativo' },
        { id: 27, descricao: 'Campo de Setubal', numerousers: '5051', localidade: 'Setubal', estado: 'Ativo' },
        { id: 28, descricao: 'Campo de Viana', numerousers: '5253', localidade: 'Viana', estado: 'Ativo' },
        { id: 29, descricao: 'Campo de Guarda', numerousers: '5455', localidade: 'Guarda', estado: 'Ativo' },
        { id: 30, descricao: 'Campo de Santarem', numerousers: '5657', localidade: 'Santarem', estado: 'Ativo' },
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
            <Header caption='Polos' />
            <div className="data-container">
                <div style={{marginBottom:'20px', paddingTop: '20px'}}>
                    <AddButton caption='Adicionar' onclick={handleOpenNewModal} />
                    <Search onchange={handleTextFilter} />
                </div>
                <div style={{ height: '65vh', width: '99%', overflowY: 'auto', paddingBottom: '40px',border: 'none', boxShadow: 'none'}}>
                    <DataTable rows={tableRows || []} columns={tableColumns}/>
                </div>
            </div>
            <NovoEvento open={isNewModalOpen} onClose={handleCloseNewModal}/>
        </div>
    )
}