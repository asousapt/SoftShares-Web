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
import NovoAlerta from '../modals/novoAlerta';

const opcoesFiltro = [
    { value:'Todos', label: 'Todos'},
    { value:'Ativos', label: 'Apenas Ativos'},
    { value:'inativos', label: 'Apenas Inativos'}
];

export default function ConfigAlertas() {
    const [isNewModalOpen, setNewModalOpen] = useState(false);
    const [filtroText, setFiltroText] = useState('');
    const [filtroCombo, setFiltroCombo] = useState('Todos');

    const tableColumns = [
        { field: 'id', headerName: 'ID', width: 100, headerAlign: 'left' },
        { field: 'alerta', headerName: 'Alerta', flex: 1, headerAlign: 'left' },
        { field: 'dataHora', headerName: 'Data e Hora de Começo', type: 'dateTime', width: 300, headerAlign: 'left' },
        { field: 'criadoPor', headerName: 'Criado por', flex: 1, headerAlign: 'left' },
        { field: 'estado', headerName: 'Estado', width: 120, headerAlign: 'center', renderCell: (row) => ( <StateChanger status={row.value} />) },
        { field: 'ver', headerName: ' ', width: 100, headerAlign: 'left', sortable: false , renderCell: (row) => ( <EditButton caption=' ' /*onclick={} id={row.id}*/ />)},
    ];

    const tableRows = [
        { id: 1, alerta: 'Exemplo Alerta 1', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'Utilizador Teste 1' },
        { id: 2, alerta: 'Exemplo Alerta 2', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'Utilizador Teste 2' },
        { id: 3, alerta: 'Exemplo Alerta 3', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'Utilizador Teste 3' },
        { id: 4, alerta: 'Exemplo Alerta 4', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'Utilizador Teste 4' },
        { id: 5, alerta: 'Exemplo Alerta 5', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'Utilizador Teste 5' },
        { id: 6, alerta: 'teste6', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo6' },
        { id: 7, alerta: 'teste7', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo7' },
        { id: 8, alerta: 'teste8', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo8' },
        { id: 9, alerta: 'teste9', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo9' },
        { id: 10, alerta: 'teste10', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo10' },
        { id: 11, alerta: 'teste11', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo11' },
        { id: 12, alerta: 'teste12', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo12' },
        { id: 13, alerta: 'teste13', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo13' },
        { id: 14, alerta: 'teste14', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo14' },
        { id: 15, alerta: 'teste15', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo15' },
        { id: 16, alerta: 'teste16', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo16' },
        { id: 17, alerta: 'teste17', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo17' },
        { id: 18, alerta: 'teste18', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo18' },
        { id: 19, alerta: 'teste19', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo19' },
        { id: 20, alerta: 'teste20', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo20' },
        { id: 21, alerta: 'teste21', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo21' },
        { id: 22, alerta: 'teste22', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo22' },
        { id: 23, alerta: 'teste23', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo23' },
        { id: 24, alerta: 'teste24', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo24' },
        { id: 25, alerta: 'teste25', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo25' },
        { id: 26, alerta: 'teste26', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo26' },
        { id: 27, alerta: 'teste27', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo27' },
        { id: 28, alerta: 'teste28', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo28' },
        { id: 29, alerta: 'teste29', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo29' },
        { id: 30, alerta: 'teste30', dataHora: new Date('2023-12-19T20:00:00'), criadoPor: 'algo30' },
    ];

    return(
        <div className="page-container">
            <Header caption='Alertas' />
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
            <NovoAlerta open={isNewModalOpen} onClose={() => setNewModalOpen(false)}/>
        </div>
    )
}