import React, { useState, useEffect } from 'react';
import './page.css';
/* COMPONENTES */
import DataTable from '../components/tables/dataTable';
import EditButton from '../components/buttons/editButton';
import Header from '../components/header/header';
import AddButton from '../components/buttons/addButton';
import Search from '../components/textFields/search';
/* FIM COMPONENTES */
import NovoPontoInt from '../modals/novoPontoInt';

export default function ListaPontosInt() {
    const [isNewModalOpen, setNewModalOpen] = useState(false);
    const [filtroText, setFiltroText] = useState('');

    const tableColumns = [
        { field: 'id', headerName: 'ID', width: 50, headerAlign: 'center' },
        { field: 'titulo', headerName: 'Título', flex: 2, headerAlign: 'center' },
        { field: 'dataHora', headerName: 'Data e Hora de Começo', type: 'dateTime', width: 200, headerAlign: 'center' },
        { field: 'localizacao', headerName: 'Localização', flex: 1, headerAlign: 'center' },
        { field: 'edit', headerName: ' ', width: 90, headerAlign: 'center', sortable: false , renderCell: (row) => ( <EditButton caption=' ' /*onclick={} id={row.id}*/ />)},
    ];

    const tableRows = [
        { id: 1, titulo: 'Evento 1', dataHora: new Date('2023-12-31T12:00:00'), localizacao: 'Local 1' },
        { id: 2, titulo: 'Evento 2', dataHora: new Date('2023-12-31T14:00:00'), localizacao: 'Local 2' },
        { id: 3, titulo: 'Evento 3', dataHora: new Date('2023-12-31T16:00:00'), localizacao: 'Local 3' },
        { id: 4, titulo: 'Evento 4', dataHora: new Date('2023-12-31T18:00:00'), localizacao: 'Local 4' },
        { id: 5, titulo: 'Evento 5', dataHora: new Date('2023-12-31T20:00:00'), localizacao: 'Local 5' },
        { id: 6, titulo: 'Evento 6', dataHora: new Date('2023-12-31T22:00:00'), localizacao: 'Local 6' },
        { id: 7, titulo: 'Evento 7', dataHora: new Date('2023-12-31T23:59:59'), localizacao: 'Local 7' },
        { id: 8, titulo: 'Evento 8', dataHora: new Date('2023-12-31T12:00:00'), localizacao: 'Local 8' },
        { id: 9, titulo: 'Evento 9', dataHora: new Date('2023-12-31T14:00:00'), localizacao: 'Local 9' },
        { id: 10, titulo: 'Evento 10', dataHora: new Date('2023-12-31T16:00:00'), localizacao: 'Local 10' },
        { id: 11, titulo: 'Evento 11', dataHora: new Date('2023-12-31T18:00:00'), localizacao: 'Local 11' },
        { id: 12, titulo: 'Evento 12', dataHora: new Date('2023-12-31T20:00:00'), localizacao: 'Local 12' },
        { id: 13, titulo: 'Evento 13', dataHora: new Date('2023-12-31T22:00:00'), localizacao: 'Local 13' },
        { id: 14, titulo: 'Evento 14', dataHora: new Date('2023-12-31T23:59:59'), localizacao: 'Local 14' },
        { id: 15, titulo: 'Evento 15', dataHora: new Date('2023-12-31T12:00:00'), localizacao: 'Local 15' },
        { id: 16, titulo: 'Evento 16', dataHora: new Date('2023-12-31T14:00:00'), localizacao: 'Local 16' },
        { id: 17, titulo: 'Evento 17', dataHora: new Date('2023-12-31T16:00:00'), localizacao: 'Local 17' },
        { id: 18, titulo: 'Evento 18', dataHora: new Date('2023-12-31T18:00:00'), localizacao: 'Local 18' },
        { id: 19, titulo: 'Evento 19', dataHora: new Date('2023-12-31T20:00:00'), localizacao: 'Local 19' },
        { id: 20, titulo: 'Evento 20', dataHora: new Date('2023-12-31T22:00:00'), localizacao: 'Local 20' },
        { id: 21, titulo: 'Evento 21', dataHora: new Date('2023-12-31T12:00:00'), localizacao: 'Local 21' },
        { id: 22, titulo: 'Evento 22', dataHora: new Date('2023-12-31T14:00:00'), localizacao: 'Local 22' },
        { id: 23, titulo: 'Evento 23', dataHora: new Date('2023-12-31T16:00:00'), localizacao: 'Local 23' },
        { id: 24, titulo: 'Evento 24', dataHora: new Date('2023-12-31T18:00:00'), localizacao: 'Local 24' },
        { id: 25, titulo: 'Evento 25', dataHora: new Date('2023-12-31T20:00:00'), localizacao: 'Local 25' },
        { id: 26, titulo: 'Evento 26', dataHora: new Date('2023-12-31T22:00:00'), localizacao: 'Local 26' },
        { id: 27, titulo: 'Evento 27', dataHora: new Date('2023-12-31T23:59:59'), localizacao: 'Local 27' },
        { id: 28, titulo: 'Evento 28', dataHora: new Date('2023-12-31T12:00:00'), localizacao: 'Local 28' },
        { id: 29, titulo: 'Evento 29', dataHora: new Date('2023-12-31T14:00:00'), localizacao: 'Local 29' },
        { id: 30, titulo: 'Evento 30', dataHora: new Date('2023-12-31T16:00:00'), localizacao: 'Local 30' },
        { id: 31, titulo: 'Evento 31', dataHora: new Date('2023-12-31T18:00:00'), localizacao: 'Local 31' },
        { id: 32, titulo: 'Evento 32', dataHora: new Date('2023-12-31T20:00:00'), localizacao: 'Local 32' },
        { id: 33, titulo: 'Evento 33', dataHora: new Date('2023-12-31T22:00:00'), localizacao: 'Local 33' },
        { id: 34, titulo: 'Evento 34', dataHora: new Date('2023-12-31T23:59:59'), localizacao: 'Local 34' },
        { id: 35, titulo: 'Evento 35', dataHora: new Date('2023-12-31T12:00:00'), localizacao: 'Local 35' },
        { id: 36, titulo: 'Evento 36', dataHora: new Date('2023-12-31T14:00:00'), localizacao: 'Local 36' },
        { id: 37, titulo: 'Evento 37', dataHora: new Date('2023-12-31T16:00:00'), localizacao: 'Local 37' },
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
            <Header caption='Pontos de Interesse' />
            <div className="data-container">
                <div style={{marginBottom:'20px', paddingTop: '20px'}}>
                    <AddButton caption='Adicionar' onclick={handleOpenNewModal} />
                    <Search onchange={handleTextFilter} />
                </div>
                <div style={{ height: '65vh', width: '99%', overflowY: 'auto', paddingBottom: '40px',border: 'none', boxShadow: 'none'}}>
                    <DataTable rows={tableRows || []} columns={tableColumns}/>
                </div>
            </div>
            <NovoPontoInt open={isNewModalOpen} onClose={handleCloseNewModal}/>
        </div>
    )
}