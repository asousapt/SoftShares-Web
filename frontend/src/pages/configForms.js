import React, { useState, useEffect } from 'react';
import './page.css';
/* COMPONENTES */
import DataTable from '../components/tables/dataTable';
import EditButton from '../components/buttons/editButton';
import Header from '../components/header/header';
import AddButton from '../components/buttons/addButton';
import Search from '../components/textFields/search';
/* FIM COMPONENTES */
import NovoEvento from '../modals/eventos/novoEvento';

export default function ConfigForms() {
    const [isNewModalOpen, setNewModalOpen] = useState(false);
    const [filtroText, setFiltroText] = useState('');

    const tableColumns = [
        { field: 'id', headerName: 'ID', width: 100, headerAlign: 'left' },
        { field: 'titulo', headerName: 'Título', flex: 1, headerAlign: 'left' },
        { field: 'subcategoria', headerName: 'Subcatergoria', flex: 1, headerAlign: 'left' },
        { field: 'versao', headerName: 'Versão', flex: 0.5, headerAlign: 'left' },
        { field: 'ver', headerName: ' ', width: 100, headerAlign: 'left', sortable: false , renderCell: (row) => ( <EditButton caption=' ' /*onclick={} id={row.id}*/ />)},
    ];

    const tableRows = [
        { id: 1, titulo: 'Adicionar Restaurante', subcategoria: 'Restaurante', versao: '3' },
        { id: 2, titulo: 'Apreciação de Evento', subcategoria: 'Futebol', versao: '1' },
        { id: 3, titulo: 'Adicionar', subcategoria: 'Padel', versao: '3' },
        { id: 4, titulo: 'teste4', subcategoria: 'Padel', versao: '3' },
        { id: 5, titulo: 'teste5', subcategoria: 'Padel', versao: '3' },
        { id: 6, titulo: 'teste6', subcategoria: 'Padel', versao: '3' },
        { id: 7, titulo: 'teste7', subcategoria: 'Padel', versao: '3' },
        { id: 8, titulo: 'teste8', subcategoria: 'Padel', versao: '3' },
        { id: 9, titulo: 'teste9', subcategoria: 'Padel', versao: '3' },
        { id: 10, titulo: 'teste10', subcategoria: 'Padel', versao: '3' },
        { id: 11, titulo: 'teste11', subcategoria: 'Padel', versao: '3' },
        { id: 12, titulo: 'teste12', subcategoria: 'Padel', versao: '3' },
        { id: 13, titulo: 'teste13', subcategoria: 'Padel', versao: '3' },
        { id: 14, titulo: 'teste14', subcategoria: 'Padel', versao: '3' },
        { id: 15, titulo: 'teste15', subcategoria: 'Padel', versao: '3' },
        { id: 16, titulo: 'teste16', subcategoria: 'Padel', versao: '3' },
        { id: 17, titulo: 'teste17', subcategoria: 'Padel', versao: '3' },
        { id: 18, titulo: 'teste18', subcategoria: 'Padel', versao: '3' },
        { id: 19, titulo: 'teste19', subcategoria: 'Padel', versao: '3' },
        { id: 20, titulo: 'teste20', subcategoria: 'Padel', versao: '3' },
        { id: 21, titulo: 'teste21', subcategoria: 'Padel', versao: '3' },
        { id: 22, titulo: 'teste22', subcategoria: 'Padel', versao: '3' },
        { id: 23, titulo: 'teste23', subcategoria: 'Padel', versao: '3' },
        { id: 24, titulo: 'teste24', subcategoria: 'Padel', versao: '3' },
        { id: 25, titulo: 'teste25', subcategoria: 'Padel', versao: '3' },
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
            <Header caption='Formulários' />
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