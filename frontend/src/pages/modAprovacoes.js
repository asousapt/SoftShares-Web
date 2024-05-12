import React, { useState, useEffect } from 'react';
import './page.css';
/* COMPONENTES */
import DataTable from '../components/tables/dataTable';
import AprovButton from '../components/buttons/aproveButton';
import DetailButton from '../components/buttons/detailButton';
import RejButton from '../components/buttons/rejectButton';
import Header from '../components/header/header';
import Search from '../components/textFields/search';
/* FIM COMPONENTES */
import NovoEvento from '../modals/novoEvento';

export default function ModAprov() {
    const [isNewModalOpen, setNewModalOpen] = useState(false);
    const [filtroText, setFiltroText] = useState('');

    const tableColumns = [
        { field: 'id', headerName: 'ID', width: 100, headerAlign: 'left' },
        { field: 'tipo', headerName: 'Tipo', flex: 1, headerAlign: 'left' },
        { field: 'titulo', headerName: 'Título', flex: 2, headerAlign: 'left' },
        { field: 'criadoPor', headerName: 'Criado Por', flex: 1, headerAlign: 'left' },
        { field: 'permitir', headerName: 'Permitir', width: 85, headerAlign: 'left', sortable: false , renderCell: (row) => ( <AprovButton /*onclick={} id={row.id}*/ />)},
        { field: 'remover', headerName: 'Remover', width: 85, headerAlign: 'left', sortable: false , renderCell: (row) => ( <RejButton /*onclick={} id={row.id}*/ />)},
        { field: 'ver', headerName: 'Ver', width: 85, headerAlign: 'left', sortable: false , renderCell: (row) => ( <DetailButton /*onclick={} id={row.id}*/ />)},
    ];

    const tableRows = [
        { id: 1, tipo: 'teste1', titulo: 'titulo 1', criadoPor: 'algo1', localizacao: 'teste1' },
        { id: 2, tipo: 'teste2', titulo: 'titulo 2', criadoPor: 'algo2', localizacao: 'teste2' },
        { id: 3, tipo: 'teste3', titulo: 'titulo 3', criadoPor: 'algo3', localizacao: 'teste3' },
        { id: 4, tipo: 'teste4', titulo: 'titulo 4', criadoPor: 'algo4', localizacao: 'teste4' },
        { id: 5, tipo: 'teste5', titulo: 'titulo 5', criadoPor: 'algo5', localizacao: 'teste5' },
        { id: 6, tipo: 'teste6', titulo: 'titulo 6', criadoPor: 'algo6', localizacao: 'teste6' },
        { id: 7, tipo: 'teste7', titulo: 'titulo 7', criadoPor: 'algo7', localizacao: 'teste7' },
        { id: 8, tipo: 'teste8', titulo: 'titulo 8', criadoPor: 'algo8', localizacao: 'teste8' },
        { id: 9, tipo: 'teste9', titulo: 'titulo 9', criadoPor: 'algo9', localizacao: 'teste9' },
        { id: 10, tipo: 'teste10', titulo: 'titulo 10', criadoPor: 'algo10', localizacao: 'teste10' },
        { id: 11, tipo: 'teste11', titulo: 'titulo 11', criadoPor: 'algo11', localizacao: 'teste11' },
        { id: 12, tipo: 'teste12', titulo: 'titulo 12', criadoPor: 'algo12', localizacao: 'teste12' },
        { id: 13, tipo: 'teste13', titulo: 'titulo 13', criadoPor: 'algo13', localizacao: 'teste13' },
        { id: 14, tipo: 'teste14', titulo: 'titulo 14', criadoPor: 'algo14', localizacao: 'teste14' },
        { id: 15, tipo: 'teste15', titulo: 'titulo 15', criadoPor: 'algo15', localizacao: 'teste15' },
        { id: 16, tipo: 'teste16', titulo: 'titulo 16', criadoPor: 'algo16', localizacao: 'teste16' },
        { id: 17, tipo: 'teste17', titulo: 'titulo 17', criadoPor: 'algo17', localizacao: 'teste17' },
        { id: 18, tipo: 'teste18', titulo: 'titulo 18', criadoPor: 'algo18', localizacao: 'teste18' },
        { id: 19, tipo: 'teste19', titulo: 'titulo 19', criadoPor: 'algo19', localizacao: 'teste19' },
        { id: 20, tipo: 'teste20', titulo: 'titulo 20', criadoPor: 'algo20', localizacao: 'teste20' },
        { id: 21, tipo: 'teste21', titulo: 'titulo 21', criadoPor: 'algo21', localizacao: 'teste21' },
        { id: 22, tipo: 'teste22', titulo: 'titulo 22', criadoPor: 'algo22', localizacao: 'teste22' },
        { id: 23, tipo: 'teste23', titulo: 'titulo 23', criadoPor: 'algo23', localizacao: 'teste23' },
        { id: 24, tipo: 'teste24', titulo: 'titulo 24', criadoPor: 'algo24', localizacao: 'teste24' },
        { id: 25, tipo: 'teste25', titulo: 'titulo 25', criadoPor: 'algo25', localizacao: 'teste25' },
        { id: 26, tipo: 'teste26', titulo: 'titulo 26', criadoPor: 'algo26', localizacao: 'teste26' },
        { id: 27, tipo: 'teste27', titulo: 'titulo 27', criadoPor: 'algo27', localizacao: 'teste27' },
        { id: 28, tipo: 'teste28', titulo: 'titulo 28', criadoPor: 'algo28', localizacao: 'teste28' },
        { id: 29, tipo: 'teste29', titulo: 'titulo 29', criadoPor: 'algo29', localizacao: 'teste29' },
        { id: 30, tipo: 'teste30', titulo: 'titulo 30', criadoPor: 'algo30', localizacao: 'teste30' },
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
            <Header caption='Aprovações' />
            <div className="data-container">
                <div style={{marginBottom:'20px', paddingTop: '20px'}}>
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