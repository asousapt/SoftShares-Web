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
import axios from 'axios';


const opcoesFiltro = [
    { value:'Todos', label: 'Todos'},
    { value:'Ativos', label: 'Apenas Ativos'},
    { value:'inativos', label: 'Apenas Inativos'}
];

export default function Configtilizadores() {
    const [isNewModalOpen, setNewModalOpen] = useState(false);
    const [filtroText, setFiltroText] = useState('');
    const [filtroCombo, setFiltroCombo] = useState('Todos');
    const [tableRows, setTableRows] = useState([]);
    const [error, setError] = useState(null);

    const tableColumns = [
        { field: 'id', headerName: 'ID', width: 100, headerAlign: 'left'},
        { field: 'nome', headerName: 'Nome', flex: 1, headerAlign: 'left' },
        { field: 'tipo', headerName: 'Tipo', flex: 0.5, headerAlign: 'left' },
        { field: 'dataHora', headerName: 'Data de Criação', type: 'dateTime', width: 300, headerAlign: 'left' },
        { field: 'departamento', headerName: 'Departamento', flex: 0.5 , headerAlign: 'left' },
        { field: 'funcao', headerName: 'Função', flex: 1 , headerAlign: 'left'},
        { field: 'idioma', headerName: 'Idioma', flex: 1 , headerAlign: 'left'},
        { field: 'estado', headerName: 'Estado', width: 120, headerAlign: 'center', renderCell: (row) => ( <StateChanger status={row.value} />) },
        { field: 'status', headerName: ' ', width: 100, headerAlign: 'left', sortable: false , renderCell: (row) => ( <EditButton caption=' ' /*onclick={} id={row.id}*/ />)},
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = 'tokenFixo';
                const response = await axios.get('http://localhost:8000/utilizadores', {
                    headers: {
                        Authorization: `${token}`
                    }
                });
                const utilizadores = response.data.data;
                setTableRows(
                    utilizadores.map((utilizador, index) => ({
                        key: utilizador.utilizadorid,
                        id: utilizador.utilizadorid,
                        nome: utilizador.pnome + ' ' + utilizador.unome,
                        tipo: utilizador.perfil.descricao,
                        dataHora: new Date(utilizador.datacriacao),
                        departamento: utilizador.departamentoid,
                        funcao: utilizador.funcaoid,
                        idioma: utilizador.idiomaid,
                        estado: utilizador.inactivo ? 'Inativo' : 'Ativo',
                        status: utilizador.estado
                    }))
                );
            } catch (error) {
                setError(error);
            }
        };
        fetchData();
    }, []);

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