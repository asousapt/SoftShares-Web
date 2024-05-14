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
import NovoPontoInt from '../modals/pontosInteresse/novoPontoInt';

const opcoesFiltro = [
    { value:'Todos', label: 'Todos'},
    { value:'Ativos', label: 'Apenas Ativos'},
    { value:'inativos', label: 'Apenas Inativos'}
];

export default function ListaPontosInt() {
    const [isNewModalOpen, setNewModalOpen] = useState(false);
    const [filtroText, setFiltroText] = useState('');
    const [filtroCombo, setFiltroCombo] = useState('Todos');

    const tableColumns = [
        { field: 'id', headerName: 'ID', width: 100, headerAlign: 'left' },
        { field: 'titulo', headerName: 'Título', flex: 0.5, headerAlign: 'left' },
        { field: 'dataHora', headerName: 'Data e Hora de Começo', type: 'dateTime', width: 300, headerAlign: 'left' },
        { field: 'localizacao', headerName: 'Localização', flex: 0.5, headerAlign: 'left' },
        { field: 'edit', headerName: ' ', width: 90, headerAlign: 'left', sortable: false , renderCell: (row) => ( <EditButton caption=' ' /*onclick={} id={row.id}*/ />)},
    ];

    const tableRows = [
        { id: 1, titulo: 'Ponto de Interesse 1', dataHora: new Date('2023-12-31T12:00:00'), localizacao: 'Local 1' },
        { id: 2, titulo: 'Ponto de Interesse 2', dataHora: new Date('2023-12-31T14:00:00'), localizacao: 'Local 2' },
        { id: 3, titulo: 'Ponto de Interesse 3', dataHora: new Date('2023-12-31T16:00:00'), localizacao: 'Local 3' },
        { id: 4, titulo: 'Ponto de Interesse 4', dataHora: new Date('2023-12-31T18:00:00'), localizacao: 'Local 4' },
        { id: 5, titulo: 'Ponto de Interesse 5', dataHora: new Date('2023-12-31T20:00:00'), localizacao: 'Local 5' },
        { id: 6, titulo: 'Ponto de Interesse 6', dataHora: new Date('2023-12-31T22:00:00'), localizacao: 'Local 6' },
        { id: 7, titulo: 'Ponto de Interesse 7', dataHora: new Date('2023-12-31T23:59:59'), localizacao: 'Local 7' },
        { id: 8, titulo: 'Ponto de Interesse 8', dataHora: new Date('2023-12-31T12:00:00'), localizacao: 'Local 8' },
        { id: 9, titulo: 'Ponto de Interesse 9', dataHora: new Date('2023-12-31T14:00:00'), localizacao: 'Local 9' },
        { id: 10, titulo: 'Ponto de Interesse 10', dataHora: new Date('2023-12-31T16:00:00'), localizacao: 'Local 10' },
        { id: 11, titulo: 'Ponto de Interesse 11', dataHora: new Date('2023-12-31T18:00:00'), localizacao: 'Local 11' },
        { id: 12, titulo: 'Ponto de Interesse 12', dataHora: new Date('2023-12-31T20:00:00'), localizacao: 'Local 12' },
        { id: 13, titulo: 'Ponto de Interesse 13', dataHora: new Date('2023-12-31T22:00:00'), localizacao: 'Local 13' },
        { id: 14, titulo: 'Ponto de Interesse 14', dataHora: new Date('2023-12-31T23:59:59'), localizacao: 'Local 14' },
        { id: 15, titulo: 'Ponto de Interesse 15', dataHora: new Date('2023-12-31T12:00:00'), localizacao: 'Local 15' },
        { id: 16, titulo: 'Ponto de Interesse 16', dataHora: new Date('2023-12-31T14:00:00'), localizacao: 'Local 16' },
        { id: 17, titulo: 'Ponto de Interesse 17', dataHora: new Date('2023-12-31T16:00:00'), localizacao: 'Local 17' },
        { id: 18, titulo: 'Ponto de Interesse 18', dataHora: new Date('2023-12-31T18:00:00'), localizacao: 'Local 18' },
        { id: 19, titulo: 'Ponto de Interesse 19', dataHora: new Date('2023-12-31T20:00:00'), localizacao: 'Local 19' },
        { id: 20, titulo: 'Ponto de Interesse 20', dataHora: new Date('2023-12-31T22:00:00'), localizacao: 'Local 20' },
        { id: 21, titulo: 'Ponto de Interesse 21', dataHora: new Date('2023-12-31T12:00:00'), localizacao: 'Local 21' },
        { id: 22, titulo: 'Ponto de Interesse 22', dataHora: new Date('2023-12-31T14:00:00'), localizacao: 'Local 22' },
        { id: 23, titulo: 'Ponto de Interesse 23', dataHora: new Date('2023-12-31T16:00:00'), localizacao: 'Local 23' },
        { id: 24, titulo: 'Ponto de Interesse 24', dataHora: new Date('2023-12-31T18:00:00'), localizacao: 'Local 24' },
        { id: 25, titulo: 'Ponto de Interesse 25', dataHora: new Date('2023-12-31T20:00:00'), localizacao: 'Local 25' },
        { id: 26, titulo: 'Ponto de Interesse 26', dataHora: new Date('2023-12-31T22:00:00'), localizacao: 'Local 26' },
        { id: 27, titulo: 'Ponto de Interesse 27', dataHora: new Date('2023-12-31T23:59:59'), localizacao: 'Local 27' },
        { id: 28, titulo: 'Ponto de Interesse 28', dataHora: new Date('2023-12-31T12:00:00'), localizacao: 'Local 28' },
        { id: 29, titulo: 'Ponto de Interesse 29', dataHora: new Date('2023-12-31T14:00:00'), localizacao: 'Local 29' },
        { id: 30, titulo: 'Ponto de Interesse 30', dataHora: new Date('2023-12-31T16:00:00'), localizacao: 'Local 30' },
        { id: 31, titulo: 'Ponto de Interesse 31', dataHora: new Date('2023-12-31T18:00:00'), localizacao: 'Local 31' },
        { id: 32, titulo: 'Ponto de Interesse 32', dataHora: new Date('2023-12-31T20:00:00'), localizacao: 'Local 32' },
        { id: 33, titulo: 'Ponto de Interesse 33', dataHora: new Date('2023-12-31T22:00:00'), localizacao: 'Local 33' },
        { id: 34, titulo: 'Ponto de Interesse 34', dataHora: new Date('2023-12-31T23:59:59'), localizacao: 'Local 34' },
        { id: 35, titulo: 'Ponto de Interesse 35', dataHora: new Date('2023-12-31T12:00:00'), localizacao: 'Local 35' },
        { id: 36, titulo: 'Ponto de Interesse 36', dataHora: new Date('2023-12-31T14:00:00'), localizacao: 'Local 36' },
        { id: 37, titulo: 'Ponto de Interesse 37', dataHora: new Date('2023-12-31T16:00:00'), localizacao: 'Local 37' },
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
                    <ComboFilter options={opcoesFiltro} value={filtroCombo} handleChange={(e) => setFiltroCombo(e.target.value)} />
                </div>
                <div style={{ height: '65vh', width: '99%', overflowY: 'auto', paddingBottom: '40px',border: 'none', boxShadow: 'none'}}>
                    <DataTable rows={tableRows || []} columns={tableColumns}/>
                </div>
            </div>
            <NovoPontoInt open={isNewModalOpen} onClose={handleCloseNewModal}/>
        </div>
    )
}