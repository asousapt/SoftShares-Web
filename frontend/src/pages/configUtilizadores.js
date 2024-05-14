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
import NovoUser from '../modals/utilizadores/novoUtilizador';

const opcoesFiltro = [
    { value:'Todos', label: 'Todos'},
    { value:'Ativos', label: 'Apenas Ativos'},
    { value:'inativos', label: 'Apenas Inativos'}
];

export default function Configtilizadores() {
    const [isNewModalOpen, setNewModalOpen] = useState(false);
    const [filtroText, setFiltroText] = useState('');
    const [filtroCombo, setFiltroCombo] = useState('Todos');

    const tableColumns = [
        { field: 'id', headerName: 'ID', width: 100, headerAlign: 'left'},
        { field: 'nome', headerName: 'Nome', flex: 1, headerAlign: 'left' },
        { field: 'tipo', headerName: 'Tipo', flex: 0.5, headerAlign: 'left' },
        { field: 'dataHora', headerName: 'Data de Criação', type: 'dateTime', width: 300, headerAlign: 'left' },
        { field: 'departamento', headerName: 'Departamento', flex: 0.5 , headerAlign: 'left' },
        { field: 'funcao', headerName: 'Função', flex: 1 , headerAlign: 'left'},
        { field: 'estado', headerName: 'Estado', width: 120, headerAlign: 'center', renderCell: (row) => ( <StateChanger status={row.value} />) },
        { field: 'status', headerName: ' ', width: 100, headerAlign: 'left', sortable: false , renderCell: (row) => ( <EditButton caption=' ' /*onclick={} id={row.id}*/ />)},
    ];

    const tableRows = [
        { id: 1, nome: 'Alexandre Marques', tipo: 'Admin ', dataHora: new Date('2023-12-19T20:00:00'), departamento: 'Informática',  funcao: 'Programador', estado: 'Ativo' },
        { id: 2, nome: 'Diogo Fonseca', tipo: 'Utilizador ', dataHora: new Date('2023-12-19T20:00:00'), departamento: 'Informática', funcao: 'Gestor de Projetos', estado: 'Desativo'  },
        { id: 3, nome: 'António Sousa', tipo: 'Admin ', dataHora: new Date('2023-12-19T20:00:00'), departamento: 'Marketing', funcao: 'Programador', estado: 'Ativo'  },
        { id: 4, nome: 'teste4', tipo: 'Utilizador ', dataHora: new Date('2023-12-19T20:00:00'), departamento: 'algo4', funcao: 'algo4', estado: 'Ativo' },
        { id: 5, nome: 'teste5', tipo: 'Utilizador ', dataHora: new Date('2023-12-19T20:00:00'), departamento: 'algo5', funcao: 'algo5', estado: 'Ativo' },
        { id: 6, nome: 'teste6', tipo: 'Admin ', dataHora: new Date('2023-12-19T20:00:00'), departamento: 'algo6', funcao: 'algo6', estado: 'Ativo' },
        { id: 7, nome: 'teste7', tipo: 'Utilizador ', dataHora: new Date('2023-12-19T20:00:00'), departamento: 'algo7', funcao: 'algo7', estado: 'Desativo' },
        { id: 8, nome: 'teste8', tipo: 'Utilizador ', dataHora: new Date('2023-12-19T20:00:00'), departamento: 'algo8', funcao: 'algo8', estado: 'Desativo' },
        { id: 9, nome: 'teste9', tipo: 'Utilizador ', dataHora: new Date('2023-12-19T20:00:00'), departamento: 'algo9', funcao: 'algo9', estado: 'Ativo' },
        { id: 10, nome: 'teste10', tipo: 'Utilizador ', dataHora: new Date('2023-12-19T20:00:00'), departamento: 'algo10', funcao: 'algo10', estado: 'Ativo' },
        { id: 11, nome: 'teste11', tipo: 'Utilizador ', dataHora: new Date('2023-12-19T20:00:00'), departamento: 'algo11', funcao: 'algo11', estado: 'Ativo' },
        { id: 12, nome: 'teste12', tipo: 'Utilizador ', dataHora: new Date('2023-12-19T20:00:00'), departamento: 'algo12', funcao: 'algo12', estado: 'Ativo' },
        { id: 13, nome: 'teste13', tipo: 'Utilizador ', dataHora: new Date('2023-12-19T20:00:00'), departamento: 'algo13', funcao: 'algo13', estado: 'Ativo' },
        { id: 14, nome: 'teste14', tipo: 'Utilizador ', dataHora: new Date('2023-12-19T20:00:00'), departamento: 'algo14', funcao: 'algo14', estado: 'Desativo' },
        { id: 15, nome: 'teste15', tipo: 'Utilizador ', dataHora: new Date('2023-12-19T20:00:00'), departamento: 'algo15', funcao: 'algo15', estado: 'Ativo' },
        { id: 16, nome: 'teste16', tipo: 'Utilizador ', dataHora: new Date('2023-12-19T20:00:00'), departamento: 'algo16', funcao: 'algo16', estado: 'Ativo' },
        { id: 17, nome: 'teste17', tipo: 'Admin ', dataHora: new Date('2023-12-19T20:00:00'), departamento: 'algo17', funcao: 'algo17', estado: 'Ativo' },
        { id: 18, nome: 'teste18', tipo: 'Utilizador ', dataHora: new Date('2023-12-19T20:00:00'), departamento: 'algo18', funcao: 'algo18', estado: 'Ativo' },
        { id: 19, nome: 'teste19', tipo: 'Utilizador ', dataHora: new Date('2023-12-19T20:00:00'), departamento: 'algo19', funcao: 'algo19', estado: 'Desativo' },
        { id: 20, nome: 'teste20', tipo: 'Utilizador ', dataHora: new Date('2023-12-19T20:00:00'), departamento: 'algo20', funcao: 'algo20', estado: 'Ativo' },
        { id: 21, nome: 'teste21', tipo: 'Admin ', dataHora: new Date('2023-12-19T20:00:00'), departamento: 'algo21', funcao: 'algo21', estado: 'Ativo' },
        { id: 22, nome: 'teste22', tipo: 'Utilizador ', dataHora: new Date('2023-12-19T20:00:00'), departamento: 'algo22', funcao: 'algo22', estado: 'Ativo' },
        { id: 23, nome: 'teste23', tipo: 'Utilizador ', dataHora: new Date('2023-12-19T20:00:00'), departamento: 'algo23', funcao: 'algo23', estado: 'Ativo' },
        { id: 24, nome: 'teste24', tipo: 'Utilizador ', dataHora: new Date('2023-12-19T20:00:00'), departamento: 'algo24', funcao: 'algo24', estado: 'Desativo' },
        { id: 25, nome: 'teste25', tipo: 'Utilizador ', dataHora: new Date('2023-12-19T20:00:00'), departamento: 'algo25', funcao: 'algo25', estado: 'Ativo' },
        { id: 26, nome: 'teste26', tipo: 'Utilizador ', dataHora: new Date('2023-12-19T20:00:00'), departamento: 'algo26', funcao: 'algo26', estado: 'Ativo' },
        { id: 27, nome: 'teste27', tipo: 'Utilizador ', dataHora: new Date('2023-12-19T20:00:00'), departamento: 'algo27', funcao: 'algo27', estado: 'Ativo' },
        { id: 28, nome: 'teste28', tipo: 'Utilizador ', dataHora: new Date('2023-12-19T20:00:00'), departamento: 'algo28', funcao: 'algo28', estado: 'Ativo' },
        { id: 29, nome: 'teste29', tipo: 'Utilizador ', dataHora: new Date('2023-12-19T20:00:00'), departamento: 'algo29', funcao: 'algo29', estado: 'Ativo' },
        { id: 30, nome: 'teste30', tipo: 'Utilizador ', dataHora: new Date('2023-12-19T20:00:00'), departamento: 'algo30', funcao: 'algo30', estado: 'Ativo' },
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
            <Header caption='Utilizadores' />
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
            <NovoUser open={isNewModalOpen} onClose={handleCloseNewModal}/>
        </div>
    )
}