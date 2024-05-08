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
/* FIM COMPONENTES */
import NovoEvento from '../modals/novoEvento';

export default function ModDen() {
    const [isNewModalOpen, setNewModalOpen] = useState(false);
    const [filtroText, setFiltroText] = useState('');

    const tableColumns = [
        { field: 'id', headerName: 'ID', width: 50, headerAlign: 'center' },
        { field: 'motivo', headerName: 'Motivo', flex: 0.5, headerAlign: 'left' },
        { field: 'dataHora', headerName: 'Data e Hora de Começo', type: 'dateTime', width: 300, headerAlign: 'left' },
        { field: 'criadoPor', headerName: 'Criado por', flex: 1, headerAlign: 'left' },
        { field: 'denunciadopor', headerName: 'Denunciado Por', flex: 1, headerAlign: 'left' },
        { field: 'permitir', headerName: 'Permitir', width: 100, headerAlign: 'left', sortable: false , renderCell: (row) => ( <AprovButton caption=' ' /*onclick={} id={row.id}*/ />)},
        { field: 'remover', headerName: 'Remover', width: 100, headerAlign: 'left', sortable: false , renderCell: (row) => ( <RejButton caption=' ' /*onclick={} id={row.id}*/ />)},
        { field: 'ver', headerName: 'Ver', width: 100, headerAlign: 'left', sortable: false , renderCell: (row) => ( <EditButton caption=' ' /*onclick={} id={row.id}*/ />)},
    ];

    const tableRows = [
        { id: 1, motivo: 'teste1', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo1',  denunciadopor: 'algo1' },
        { id: 2, motivo: 'teste2', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo2', denunciadopor: 'algo2' },
        { id: 3, motivo: 'teste3', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo3', denunciadopor: 'algo3' },
        { id: 4, motivo: 'teste4', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo4', denunciadopor: 'algo4' },
        { id: 5, motivo: 'teste5', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo5', denunciadopor: 'algo5' },
        { id: 6, motivo: 'teste6', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo6', denunciadopor: 'algo6' },
        { id: 7, motivo: 'teste7', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo7', denunciadopor: 'algo7' },
        { id: 8, motivo: 'teste8', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo8', denunciadopor: 'algo8' },
        { id: 9, motivo: 'teste9', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo9', denunciadopor: 'algo9' },
        { id: 10, motivo: 'teste10', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo10', denunciadopor: 'algo10' },
        { id: 11, motivo: 'teste11', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo11', denunciadopor: 'algo11' },
        { id: 12, motivo: 'teste12', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo12', denunciadopor: 'algo12' },
        { id: 13, motivo: 'teste13', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo13', denunciadopor: 'algo13' },
        { id: 14, motivo: 'teste14', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo14', denunciadopor: 'algo14' },
        { id: 15, motivo: 'teste15', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo15', denunciadopor: 'algo15' },
        { id: 16, motivo: 'teste16', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo16', denunciadopor: 'algo16' },
        { id: 17, motivo: 'teste17', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo17', denunciadopor: 'algo17' },
        { id: 18, motivo: 'teste18', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo18', denunciadopor: 'algo18' },
        { id: 19, motivo: 'teste19', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo19', denunciadopor: 'algo19' },
        { id: 20, motivo: 'teste20', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo20', denunciadopor: 'algo20' },
        { id: 21, motivo: 'teste21', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo21', denunciadopor: 'algo21' },
        { id: 22, motivo: 'teste22', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo22', denunciadopor: 'algo22' },
        { id: 23, motivo: 'teste23', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo23', denunciadopor: 'algo23' },
        { id: 24, motivo: 'teste24', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo24', denunciadopor: 'algo24' },
        { id: 25, motivo: 'teste25', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo25', denunciadopor: 'algo25' },
        { id: 26, motivo: 'teste26', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo26', denunciadopor: 'algo26' },
        { id: 27, motivo: 'teste27', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo27', denunciadopor: 'algo27' },
        { id: 28, motivo: 'teste28', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo28', denunciadopor: 'algo28' },
        { id: 29, motivo: 'teste29', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo29', denunciadopor: 'algo29' },
        { id: 30, motivo: 'teste30', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo30', denunciadopor: 'algo30' },
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
            <Header caption='Denúncias' />
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