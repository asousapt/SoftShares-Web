import React, { useState, useEffect } from 'react';
import './page.css';
/* COMPONENTES */
import DataTable from '../components/tables/dataTable';
import EditButton from '../components/buttons/editButton';
import ComboFilter from '../components/combobox/comboFilter';
import Header from '../components/header/header';
import AddButton from '../components/buttons/addButton';
import Search from '../components/textFields/search';
import StateChanger from '../components/stateChanger/stateChanger';
/* FIM COMPONENTES */
import NovaCategoria from '../modals/novaCategoria';

const opcoesFiltro = [
    { value:'Todos', label: 'Todos'},
    { value:'Ativos', label: 'Apenas Ativos'},
    { value:'inativos', label: 'Apenas Inativos'}
];

export default function ConfigCategorias() {
    const [isNewModalOpen, setNewModalOpen] = useState(false);
    const [filtroText, setFiltroText] = useState('');
    const [filtroCombo, setFiltroCombo] = useState('Todos');

    const tableColumns = [
        { field: 'id', headerName: 'ID', width: 100, headerAlign: 'left' },
        { field: 'categoria', headerName: 'Categoria', flex: 1, headerAlign: 'left' },
        { field: 'dataHora', headerName: 'Data e Hora de Começo', type: 'dateTime', width: 300, headerAlign: 'left' },
        { field: 'criadoPor', headerName: 'Criado por', flex: 0.5, headerAlign: 'left' },
        { field: 'estado', headerName: 'Estado', width: 120, headerAlign: 'center', renderCell: (row) => ( <StateChanger status={row.value} />) },
        { field: 'ver', headerName: 'Ver', width: 100, headerAlign: 'left', sortable: false , renderCell: (row) => ( <EditButton caption=' ' /*onclick={} id={row.id}*/ />)},
    ];

    const tableRows = [
        { id: 1, categoria: 'teste1', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo1', estado: 'Ativo' },
        { id: 2, categoria: 'teste2', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo2', estado: 'Ativo'},
        { id: 3, categoria: 'teste3', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo3', estado: 'Desativo' },
        { id: 4, categoria: 'teste4', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo4', estado: 'Ativo' },
        { id: 5, categoria: 'teste5', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo5', estado: 'Ativo' },
        { id: 6, categoria: 'teste6', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo6', estado: 'Desativo' },
        { id: 7, categoria: 'teste7', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo7', estado: 'Ativo' },
        { id: 8, categoria: 'teste8', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo8', estado: 'Ativo' },
        { id: 9, categoria: 'teste9', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo9', estado: 'Ativo' },
        { id: 10, categoria: 'teste10', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo10', estado: 'Desativo' },
        { id: 11, categoria: 'teste11', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo11', estado: 'Ativo' },
        { id: 12, categoria: 'teste12', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo12', estado: 'Ativo' },
        { id: 13, categoria: 'teste13', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo13', estado: 'Ativo' },
        { id: 14, categoria: 'teste14', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo14', estado: 'Ativo' },
        { id: 15, categoria: 'teste15', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo15', estado: 'Desativo' },
        { id: 16, categoria: 'teste16', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo16', estado: 'Ativo' },
        { id: 17, categoria: 'teste17', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo17', estado: 'Ativo' },
        { id: 18, categoria: 'teste18', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo18', estado: 'Ativo' },
        { id: 19, categoria: 'teste19', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo19', estado: 'Ativo' },
        { id: 20, categoria: 'teste20', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo20', estado: 'Desativo' },
        { id: 21, categoria: 'teste21', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo21', estado: 'Ativo' },
        { id: 22, categoria: 'teste22', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo22', estado: 'Desativo' },
        { id: 23, categoria: 'teste23', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo23', estado: 'Ativo' },
        { id: 24, categoria: 'teste24', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo24', estado: 'Ativo' },
        { id: 25, categoria: 'teste25', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo25', estado: 'Ativo' },
        { id: 26, categoria: 'teste26', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo26', estado: 'Desativo' },
        { id: 27, categoria: 'teste27', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo27', estado: 'Ativo' },
        { id: 28, categoria: 'teste28', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo28', estado: 'Desativo' },
        { id: 29, categoria: 'teste29', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo29', estado: 'Ativo' },
        { id: 30, categoria: 'teste30', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo30', estado: 'Ativo' },
    ];

    return(
        <div className="page-container">
            <Header caption='Categorias' />
            <div className="data-container">
                <div style={{marginBottom:'20px', paddingTop: '20px'}}>
                    <AddButton caption='Adicionar' onclick={() => setNewModalOpen(true)} />
                    <Search onchange={(e) => setFiltroText(e.target.value)} />
                    <ComboFilter options={opcoesFiltro} value={filtroCombo} handleChange={(e) => setFiltroCombo(e.target.value)} />
                </div>
                <div style={{ height: '65vh', width: '99%', overflowY: 'auto', paddingBottom: '40px',border: 'none', boxShadow: 'none'}}>
                    <DataTable rows={tableRows || []} columns={tableColumns}/>
                </div>
            </div>
            <NovaCategoria open={isNewModalOpen} onClose={() => setNewModalOpen(false)}/>
        </div>
    )
}