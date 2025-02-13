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
import Alert from '../components/alerts/alert';
/* FIM COMPONENTES */
import NovoDepartamento from '../modals/departamentos/novoDepartamento';
import EditDepartamento from '../modals/departamentos/editarDepartamento';

const opcoesFiltro = [
    { value:'Todos', label: 'Todos'},
    { value:'Ativos', label: 'Apenas Ativos'},
    { value:'Inativos', label: 'Apenas Inativos'}
];

export default function Configtilizadores() {
    const [isNewModalOpen, setNewModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedDepartamentoId, setSelectedDepartamentoId] = useState(null);
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
        { field: 'edit', headerName: ' ', width: 100, headerAlign: 'left', sortable: false, renderCell: (row) => ( <EditButton caption=' ' onclick={() => handleEditClick(row.id)} />), disableColumnMenu: true },
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
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/departamento/filtro`, {
                headers: {
                    Authorization: `${token}`
                },
                params: {
                    estado: estado,
                    descricao: filtroText
                }
            });
            const departamentos = response.data;

            const sortedDepart = departamentos.sort((a, b) => a.departamentoid - b.departamentoid);

            setTableRows(sortedDepart.map((departamento) => ({
                key: departamento.departamentoid,
                id: departamento.departamentoid,
                descricao: departamento.valorpt,
                estado: departamento.inactivo ? 'Inativo' : 'Ativo',
            })));
        } catch (error) {
            setError(error);
        }
    };

    const handleEditClick = (id) => {
        setSelectedDepartamentoId(id);
        setEditModalOpen(true);
    };

    useEffect(() => {
        fetchData();
    }, [filtroCombo, filtroText]);

    useEffect(() => {
        if (!isNewModalOpen && !isEditModalOpen) {
            fetchData();
        }
    }, [isNewModalOpen, isEditModalOpen]);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return(
        <div className="page-container">
            <Header caption='Departamentos' />
            <div className="data-container">
                <div style={{marginBottom:'20px', paddingTop: '20px'}}>
                    <AddButton caption='Adicionar' onclick={() => setNewModalOpen(true)} />
                    <Search onchange={(e) => setFiltroText(e.target.value)} />
                    <ComboFilter options={opcoesFiltro} value={filtroCombo} handleChange={(e) => setFiltroCombo(e.target.value)} />
                </div>
                <div style={{ height: '65vh', width: '99%', overflowY: 'auto', paddingBottom: '40px', border: 'none', boxShadow: 'none' }}>
                    <DataTable rows={tableRows} columns={tableColumns} />
                </div>
            </div>
            <NovoDepartamento open={isNewModalOpen} onClose={() => setNewModalOpen(false)} setAlertOpen={setAlertOpen} setAlertProps={setAlertProps} />
            <EditDepartamento open={isEditModalOpen} onClose={() => setEditModalOpen(false)} departamentoId={selectedDepartamentoId} setAlertOpen={setAlertOpen} setAlertProps={setAlertProps} />
            <Alert open={alertOpen} setOpen={setAlertOpen} title={alertProps.title} label={alertProps.label} severity={alertProps.severity} />
        </div>
    );
}