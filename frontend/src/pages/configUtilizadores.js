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
import NovoUser from '../modals/utilizadores/novoUtilizador';
import EditUser from '../modals/utilizadores/editUtilizador';
import Alert from '../components/alerts/alert';

const opcoesFiltro = [
    { value: 'Todos', label: 'Todos' },
    { value: 'Ativos', label: 'Apenas Ativos' },
    { value: 'Inativos', label: 'Apenas Inativos' }
];

export default function Configtilizadores() {
    const [isNewModalOpen, setNewModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [filtroText, setFiltroText] = useState('');
    const [filtroCombo, setFiltroCombo] = useState('Todos');
    const [tableRows, setTableRows] = useState([]);
    const [error, setError] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertProps, setAlertProps] = useState({ title: '', label: '', severity: '' });

    const tableColumns = [
        { field: 'id', headerName: 'ID', width: 100, headerAlign: 'left' },
        { field: 'nome', headerName: 'Nome', flex: 1, headerAlign: 'left' },
        { field: 'tipo', headerName: 'Tipo', flex: 0.7, headerAlign: 'left' },
        { field: 'dataHora', headerName: 'Data de Criação', type: 'dateTime', width: 220, headerAlign: 'left' },
        { field: 'departamento', headerName: 'Departamento', flex: 1, headerAlign: 'left' },
        { field: 'funcao', headerName: 'Função', flex: 1, headerAlign: 'left' },
        { field: 'polo', headerName: 'Polo', flex: 1, headerAlign: 'left' },
        { field: 'estado', headerName: 'Estado', width: 120, headerAlign: 'center', renderCell: (row) => (<StateChanger status={row.value} />) },
        { field: 'status', headerName: ' ', width: 100, headerAlign: 'left', sortable: false, renderCell: (row) => (<EditButton caption=' ' onclick={() => {setSelectedUserId(row.id); setEditModalOpen(true);}} />) },
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
            const response = await axios.get('http://localhost:8000/utilizadores/filtro', {
                headers: { 
                    Authorization: `${token}` 
                },
                params: {
                    estado: estado,
                    descricao: filtroText
                }
            });
            const utilizadores = response.data.data;

            const sortedUtilizadores = utilizadores.sort((a, b) => a.utilizadorid - b.utilizadorid);

            setTableRows(
                sortedUtilizadores.map((utilizador) => ({
                    key: utilizador.utilizadorid,
                    id: utilizador.utilizadorid,
                    nome: utilizador.pnome + ' ' + utilizador.unome,
                    tipo: utilizador.descricao_perfil,
                    dataHora: new Date(utilizador.datacriacao),
                    departamento: utilizador.descricao_departamento,
                    funcao: utilizador.descricao_funcao,
                    polo: utilizador.descricao_polo,
                    estado: utilizador.inactivo ? 'Inativo' : 'Ativo',
                    status: utilizador.estado
                }))
            );
        } catch (error) {
            setError(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filtroCombo, filtroText]);

    useEffect(() => {
        if (!isNewModalOpen) {
            fetchData();
        }
    }, [isNewModalOpen]);

    useEffect(() => {
        if (!isEditModalOpen) {
            fetchData();
        }
    }, [isEditModalOpen]);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="page-container">
            <Header caption='Utilizadores' />
            <div className="data-container">
                <div style={{ marginBottom: '20px', paddingTop: '20px' }}>
                    <AddButton caption='Adicionar' onclick={() => setNewModalOpen(true)} />
                    <Search onchange={(e) => setFiltroText(e.target.value)} />
                    <ComboFilter options={opcoesFiltro} value={filtroCombo} handleChange={(e) => setFiltroCombo(e.target.value)} />
                </div>
                <div style={{ height: '65vh', width: '99%', overflowY: 'auto', paddingBottom: '40px', border: 'none', boxShadow: 'none' }}>
                    <DataTable rows={tableRows || []} columns={tableColumns} />
                </div>
            </div>
            <NovoUser open={isNewModalOpen} onClose={() => setNewModalOpen(false)} setAlertOpen={setAlertOpen} setAlertProps={setAlertProps} />
            <EditUser open={isEditModalOpen} onClose={() => {setEditModalOpen(false); setSelectedUserId(null);}} userId={selectedUserId} setAlertOpen={setAlertOpen} setAlertProps={setAlertProps} />
            <Alert open={alertOpen} setOpen={setAlertOpen} title={alertProps.title} label={alertProps.label} severity={alertProps.severity} />
        </div>
    )
}
