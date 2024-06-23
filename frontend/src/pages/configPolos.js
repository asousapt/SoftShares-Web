import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './page.css';
/* COMPONENTES */
import DataTable from '../components/tables/dataTable';
import EditButton from '../components/buttons/editButton';
import Header from '../components/header/header';
import AddButton from '../components/buttons/addButton';
import Search from '../components/textFields/search';
import StateChanger from '../components/stateChanger/stateChanger';
import Alert from '../components/alerts/alert';
/* FIM COMPONENTES */
import NovoPolo from '../modals/polos/novoPolo';
import EditarPolo from '../modals/polos/editarPolo';

const opcoesFiltro = [
    { value:'Todos', label: 'Todos'},
    { value:'Ativos', label: 'Apenas Ativos'},
    { value:'Inativos', label: 'Apenas Inativos'}
];

export default function ConfigPolos() {
    const [isNewModalOpen, setNewModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedPoloId, setSelectedPoloId] = useState(null);
    const [filtroText, setFiltroText] = useState('');
    const [tableRows, setTableRows] = useState([]);
    const [error, setError] = useState('');
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertProps, setAlertProps] = useState({ title: '', label: '', severity: '' });

    const tableColumns = [
        { field: 'id', headerName: 'ID', width: 100, headerAlign: 'left', disableColumnMenu: true },
        { field: 'descricao', headerName: 'Descrição', flex: 0.5, headerAlign: 'left', disableColumnMenu: true },
        { field: 'numerousers', headerName: 'Nº de Utilizadores', flex: 0.5, headerAlign: 'left', disableColumnMenu: true },
        { field: 'localidade', headerName: 'Localidade', flex: 0.5, headerAlign: 'left', disableColumnMenu: true },
        { field: 'coordenador', headerName: 'Coordenador', flex: 0.5, headerAlign: 'left', disableColumnMenu: true },
        { field: 'estado', headerName: 'Estado', width: 120, headerAlign: 'center', renderCell: (row) => ( <StateChanger status={row.value} />), disableColumnMenu: true },
        { field: 'status', headerName: ' ', width: 100, headerAlign: 'left', sortable: false , renderCell: (row) => ( <EditButton caption=' ' onclick={() => handleEditClick(row.id)} />), disableColumnMenu: true },
    ];

    const fetchData = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/polo/filtro', {
                headers: {
                    Authorization: `${token}`
                },
                params: {
                    descricao: filtroText
                }
            });
            const polos = response.data.data;
            
            const sortedPolos = polos.sort((a, b) => a.poloid - b.poloid);

            setTableRows(sortedPolos.map((polo) => ({
                key: polo.poloid,
                id: polo.poloid,
                descricao: polo.descricao,
                numerousers: polo.numusers,
                localidade: polo.cidade,
                coordenador: polo.coordenador,
                estado: polo.inactivo ? 'Inativo' : 'Ativo',
            })));
        } catch (error) {
            setError(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filtroText])

    useEffect(() => {
        if(!isNewModalOpen){
            fetchData();
        }
    }, [isNewModalOpen])

    const handleEditClick = (id) => {
        setSelectedPoloId(id);
        setEditModalOpen(true);
    };

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return(
        <div className="page-container">
            <Header caption='Polos' />
            <div className="data-container">
                <div style={{ marginBottom:'20px', paddingTop: '20px'}}>
                    <AddButton caption='Adicionar' onclick={() => setNewModalOpen(true)} />
                    <Search onchange={(e) => setFiltroText(e.target.value)} />
                </div>
                <div style={{ height: '65vh', width: '99%', overflowY: 'auto', paddingBottom: '40px',border: 'none', boxShadow: 'none'}}>
                    <DataTable rows={tableRows || []} columns={tableColumns}/>
                </div>
            </div>
            <NovoPolo open={isNewModalOpen} onClose={() => setNewModalOpen(false)} setAlertOpen={setAlertOpen} setAlertProps={setAlertProps} />
            <EditarPolo open={isEditModalOpen} onClose={() => setEditModalOpen(false)} poloId={selectedPoloId} setAlertOpen={setAlertOpen} setAlertProps={setAlertProps} />
            <Alert open={alertOpen} setOpen={setAlertOpen} title={alertProps.title} label={alertProps.label} severity={alertProps.severity} />
        </div>
    )
}
