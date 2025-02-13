import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
import NovaFuncao from '../modals/funcoes/novaFuncao';
import EditFuncao from '../modals/funcoes/editarFuncao';
import Alert from '../components/alerts/alert';

const opcoesFiltro = [
    { value:'Todos', label: 'Todos'},
    { value:'Ativos', label: 'Apenas Ativos'},
    { value:'Inativos', label: 'Apenas Inativos'}
];

export default function Configtilizadores() {
    const [isNewModalOpen, setNewModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedFuncaoId, setSelectedFuncaoId] = useState(null);
    const [filtroText, setFiltroText] = useState('');
    const [filtroCombo, setFiltroCombo] = useState('Todos');
    const [tableRows, setTableRows] = useState([]);
    const [error, setError] = useState('');
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertProps, setAlertProps] = useState({ title: '', label: '', severity: '' });

    const tableColumns = [
        { field: 'id', headerName: 'ID', width: 100, headerAlign: 'left', disableColumnMenu: true },
        { field: 'descricao', headerName: 'Descrição', flex: 1, headerAlign: 'left', disableColumnMenu: true },
        { field: 'estado', headerName: 'Estado', width: 120, headerAlign: 'center', renderCell: (row) => ( <StateChanger status={row.value} />), disableColumnMenu: true },
        { field: 'edit', headerName: ' ', width: 100, headerAlign: 'left', sortable: false , renderCell: (row) => ( <EditButton caption=' ' onclick={() => handleEditClick(row.id)} />), disableColumnMenu: true },
    ];

    const fetchData = async () => {
        try {
            const token = sessionStorage.getItem('token');

            let estado = undefined;
            if (filtroCombo === 'Ativos') {
                estado = false;
            } else if (filtroCombo === 'Inativos') {
                estado = true;
            }
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/funcao/filtro`, {
                headers: {
                    Authorization: `${token}`
                },
                params: {
                    estado: estado,
                    descricao: filtroText
                }
            });
            const funcoes = response.data;

            const sortedFunc = funcoes.sort((a, b) => a.funcaoid - b.funcaoid);

            setTableRows(sortedFunc.map((funcao) => ({
                key: funcao.funcaoid,
                id: funcao.funcaoid,
                descricao: funcao.valorpt,
                estado: funcao.inactivo ? 'Inativo' : 'Ativo',
            })));
        } catch (error) {
            setError(error);
        }
    };

    const handleEditClick = (id) => {
        setSelectedFuncaoId(id);
        setEditModalOpen(true);
    };

    useEffect(() => {
        fetchData();
    }, [filtroCombo, filtroText]);

    useEffect(() => {
        if(!isNewModalOpen){
            fetchData();
        }
    }, [isNewModalOpen])

    useEffect(() => {
        if(!isEditModalOpen){
            fetchData();
        }
    }, [isEditModalOpen]);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return(
        <div className="page-container">
            <Header caption='Funções' />
            <div className="data-container">
                <div style={{marginBottom:'20px', paddingTop: '20px'}}>
                    <AddButton caption='Adicionar' onclick={() => setNewModalOpen(true)} />
                    <Search onchange={(e) => setFiltroText(e.target.value)} />
                    <ComboFilter options={opcoesFiltro} value={filtroCombo} handleChange={(e) => setFiltroCombo(e.target.value)} />
                </div>
                <div style={{ height: '65vh', width: '99%', overflowY: 'auto', paddingBottom: '40px', border: 'none', boxShadow: 'none' }}>
                    <DataTable rows={tableRows} columns={tableColumns}/>
                </div>
            </div>
            <NovaFuncao open={isNewModalOpen} onClose={() => setNewModalOpen(false)} setAlertOpen={setAlertOpen} setAlertProps={setAlertProps} />
            <EditFuncao open={isEditModalOpen} onClose={() => setEditModalOpen(false)} funcaoId={selectedFuncaoId} setAlertOpen={setAlertOpen} setAlertProps={setAlertProps} />
            <Alert open={alertOpen} setOpen={setAlertOpen} title={alertProps.title} label={alertProps.label} severity={alertProps.severity} />
        </div>
    )
}