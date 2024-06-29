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
import NovaCategoria from '../modals/categorias/novaCategoria';
import EditarCategoria from '../modals/categorias/editarCategoria';
import Alert from '../components/alerts/alert';

const opcoesFiltro = [
    { value:'Todos', label: 'Todos'},
    { value:'Ativos', label: 'Apenas Ativos'},
    { value:'Inativos', label: 'Apenas Inativos'}
];

export default function ConfigCategorias() {
    const [isNewModalOpen, setNewModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [filtroText, setFiltroText] = useState('');
    const [filtroCombo, setFiltroCombo] = useState('Todos');
    const [tableRows, setTableRows] = useState([]);
    const [selectedCategoriaId, setSelectedCategoriaId] = useState(null);
    const [error, setError] = useState('');
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertProps, setAlertProps] = useState({ title: '', label: '', severity: '' });

    const tableColumns = [
        { field: 'id', headerName: 'ID', width: 100, headerAlign: 'left', disableColumnMenu: true },
        { field: 'categoria', headerName: 'Categoria', flex: 0.5, headerAlign: 'left', disableColumnMenu: true },
        { field: 'dataHora', headerName: 'Data e Hora de Criação', type: 'dateTime', width: 300, headerAlign: 'left', disableColumnMenu: true },
        { field: 'estado', headerName: 'Estado', width: 120, headerAlign: 'center', renderCell: (row) => ( <StateChanger status={row.value} />), disableColumnMenu: true },
        { field: 'ver', headerName: 'Ver', width: 100, headerAlign: 'left', sortable: false , renderCell: (row) => ( <EditButton caption=' ' onclick={() => handleEdit(row.id)} />), disableColumnMenu: true },
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
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/categoria/filtro`, {
                headers: {
                    Authorization: `${token}`
                },
                params: {
                    estado: estado,
                    descricao: filtroText
                }
            });
            const categorias = response.data;
            
            const sortedCat = categorias.sort((a, b) => a.categoriaid - b.categoriaid);

            setTableRows(sortedCat.map((categoria) => ({
                key: categoria.categoriaid,
                id: categoria.categoriaid,
                categoria: categoria.valorpt,
                dataHora: new Date(categoria.datacriacao),
                estado: categoria.inactivo ? 'Inativo' : 'Ativo',
            })));
        } catch (error) {
            setError(error);
        }
    };

    const handleEdit = (id) => {
        setSelectedCategoriaId(id);
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
            <NovaCategoria open={isNewModalOpen} onClose={() => setNewModalOpen(false)} setAlertOpen={setAlertOpen} setAlertProps={setAlertProps} />
            <EditarCategoria open={isEditModalOpen} onClose={() => setEditModalOpen(false)} categoriaId={selectedCategoriaId} setAlertOpen={setAlertOpen} setAlertProps={setAlertProps} />
            <Alert open={alertOpen} setOpen={setAlertOpen} title={alertProps.title} label={alertProps.label} severity={alertProps.severity} />
        </div>
    )
}
