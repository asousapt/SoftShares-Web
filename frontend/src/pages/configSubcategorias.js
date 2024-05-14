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
import NovaSubcategoria from '../modals/subcategorias/novaSubcategoria';

const opcoesFiltro = [
    { value:'Todos', label: 'Todos'},
    { value:'Ativos', label: 'Apenas Ativos'},
    { value:'inativos', label: 'Apenas Inativos'}
];

export default function ConfigSubcategorias() {
    const [isNewModalOpen, setNewModalOpen] = useState(false);
    const [filtroText, setFiltroText] = useState('');
    const [filtroCombo, setFiltroCombo] = useState('Todos');

    const tableColumns = [
        { field: 'id', headerName: 'ID', width: 100, headerAlign: 'left' },
        { field: 'subcategoria', headerName: 'Descrição', flex: 0.5, headerAlign: 'left' },
        { field: 'categoria', headerName: 'Categoria', flex: 0.5, headerAlign: 'left' },
        { field: 'dataHora', headerName: 'Data e Hora de Começo', type: 'dateTime', width: 300, headerAlign: 'left' },
        { field: 'criadoPor', headerName: 'Criado por', flex: 0.5, headerAlign: 'left' },
        { field: 'estado', headerName: 'Estado', width: 120, headerAlign: 'center', renderCell: (row) => ( <StateChanger status={row.value} />) },
        { field: 'ver', headerName: ' ', width: 100, headerAlign: 'left', sortable: false , renderCell: (row) => ( <EditButton caption=' ' /*onclick={} id={row.id}*/ />)},
    ];

    const tableRows = [
        { id: 1, subcategoria: 'teste1', categoria: 'teste1', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo1', estado: 'Ativo' },
        { id: 2, subcategoria: 'teste2', categoria: 'teste1', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo2', estado: 'Ativo'},
        { id: 3, subcategoria: 'teste3', categoria: 'teste1', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo3', estado: 'Desativo' },
        { id: 4, subcategoria: 'teste4', categoria: 'teste1', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo4', estado: 'Ativo' },
        { id: 5, subcategoria: 'teste5', categoria: 'teste1', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo5', estado: 'Ativo' },
        { id: 6, subcategoria: 'teste6', categoria: 'teste1', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo6', estado: 'Desativo' },
        { id: 7, subcategoria: 'teste7', categoria: 'teste1', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo7', estado: 'Ativo' },
        { id: 8, subcategoria: 'teste8', categoria: 'teste1', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo8', estado: 'Ativo' },
        { id: 9, subcategoria: 'teste9', categoria: 'teste1', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo9', estado: 'Ativo' },
        { id: 10, subcategoria: 'teste10', categoria: 'teste1', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo10', estado: 'Desativo' },
        { id: 11, subcategoria: 'teste11', categoria: 'teste1', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo11', estado: 'Ativo' },
        { id: 12, subcategoria: 'teste12', categoria: 'teste1', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo12', estado: 'Ativo' },
        { id: 13, subcategoria: 'teste13', categoria: 'teste1', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo13', estado: 'Ativo' },
        { id: 14, subcategoria: 'teste14', categoria: 'teste1', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo14', estado: 'Ativo' },
        { id: 15, subcategoria: 'teste15', categoria: 'teste1', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo15', estado: 'Desativo' },
        { id: 16, subcategoria: 'teste16', categoria: 'teste1', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo16', estado: 'Ativo' },
        { id: 17, subcategoria: 'teste17', categoria: 'teste1', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo17', estado: 'Ativo' },
        { id: 18, subcategoria: 'teste18', categoria: 'teste1', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo18', estado: 'Ativo' },
        { id: 19, subcategoria: 'teste19', categoria: 'teste1', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo19', estado: 'Ativo' },
        { id: 20, subcategoria: 'teste20', categoria: 'teste1', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo20', estado: 'Desativo' },
        { id: 21, subcategoria: 'teste21', categoria: 'teste1', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo21', estado: 'Ativo' },
        { id: 22, subcategoria: 'teste22', categoria: 'teste1', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo22', estado: 'Desativo' },
        { id: 23, subcategoria: 'teste23', categoria: 'teste1', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo23', estado: 'Ativo' },
        { id: 24, subcategoria: 'teste24', categoria: 'teste1', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo24', estado: 'Ativo' },
        { id: 25, subcategoria: 'teste25', categoria: 'teste1', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo25', estado: 'Ativo' },
        { id: 26, subcategoria: 'teste26', categoria: 'teste1', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo26', estado: 'Desativo' },
        { id: 27, subcategoria: 'teste27', categoria: 'teste1', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo27', estado: 'Ativo' },
        { id: 28, subcategoria: 'teste28', categoria: 'teste1', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo28', estado: 'Desativo' },
        { id: 29, subcategoria: 'teste29', categoria: 'teste1', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo29', estado: 'Ativo' },
        { id: 30, subcategoria: 'teste30', categoria: 'teste1', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo30', estado: 'Ativo' },
    ];

    return(
        <div className="page-container">
            <Header caption='Subcategorias' />
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
            <NovaSubcategoria open={isNewModalOpen} onClose={() => setNewModalOpen(false)}/>
        </div>
    )
}