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
import NovaSubcategoria from '../modals/subcategorias/novaSubcategoria';
import EditarSubcategoria from '../modals/subcategorias/editarSubcategoria';

const opcoesFiltro = [
    { value:'Todos', label: 'Todos'},
    { value:'Ativos', label: 'Apenas Ativos'},
    { value:'Inativos', label: 'Apenas Inativos'}
];

export default function ConfigSubcategorias() {
    const [isNewModalOpen, setNewModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedSubcategoriaId, setSelectedSubcategoriaId] = useState(null);
    const [filtroText, setFiltroText] = useState('');
    const [filtroCombo, setFiltroCombo] = useState('Todos');
    const [filtroCategoria, setFiltroCategoria] = useState(0);
    const [opcoesFiltroSubcat, setOpcoesSubcat] = useState([]);
    const [tableRows, setTableRows] = useState([]);
    const [error, setError] = useState('');
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertProps, setAlertProps] = useState({ title: '', label: '', severity: '' });

    const tableColumns = [
        { field: 'id', headerName: 'ID', width: 100, headerAlign: 'left' },
        { field: 'subcategoria', headerName: 'Descrição', flex: 0.5, headerAlign: 'left' },
        { field: 'categoria', headerName: 'Categoria', flex: 0.5, headerAlign: 'left' },
        { field: 'dataHora', headerName: 'Data e Hora de Criação', type: 'dateTime', width: 300, headerAlign: 'left' },
        { field: 'estado', headerName: 'Estado', width: 120, headerAlign: 'center', renderCell: (row) => ( <StateChanger status={row.value} />) },
        { field: 'ver', headerName: ' ', width: 100, headerAlign: 'left', sortable: false , renderCell: (row) => ( <EditButton caption=' ' onclick={() => handleEdit(row.id)} />)},
    ];

    const handleEdit = (id) => {
        setSelectedSubcategoriaId(id);
        setEditModalOpen(true);
    };

    const fetchCategorias = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/categoria', {
                    headers: {
                        Authorization: `${token}`
                    }
                });
                const categorias = response.data;
                
                setOpcoesSubcat([
                    { value: 0, label: 'Sem Filtro' }, 
                    ...categorias.map((cat) => ({
                        value: cat.categoriaid,
                        label: cat.valorpt
                    }))
                ]);
        } catch (error) {
            setError(error);
        }
    };

    const fetchData = async () => {
        try {
            const token = sessionStorage.getItem('token');

            let estado = undefined;
            if (filtroCombo === 'Ativos') {
                estado = false;
            } else if (filtroCombo === 'Inativos') {
                estado = true;
            }
            const response = await axios.get('http://localhost:8000/subcategoria/filtro', {
                headers: {
                    Authorization: `${token}`
                },
                params: {
                    estado: estado,
                    categoria: filtroCategoria,
                    descricao: filtroText
                }
            });
            const subcategorias = response.data;
            
            const sortedSucat = subcategorias.sort((a, b) => a.subcategoriaid - b.subcategoriaid);

            setTableRows(sortedSucat.map((subcategoria) => ({
                key: subcategoria.subcategoriaid,
                id: subcategoria.subcategoriaid,
                subcategoria: subcategoria.valorpt,
                categoria: subcategoria.valorptcat,
                dataHora: new Date(subcategoria.datacriacao),
                estado: subcategoria.inactivo ? 'Inativo' : 'Ativo',
            })));
        } catch (error) {
            setError(error);
        }
    };

    useEffect(() => {
        fetchCategorias();
        fetchData();
    }, [filtroCombo, filtroText]);

    useEffect(() => {
        if (!isNewModalOpen && !isEditModalOpen) {
            fetchData();
        }
    }, [isNewModalOpen, isEditModalOpen]);

    useEffect(() => {
        fetchData();
    }, [filtroCategoria, filtroCombo, filtroText]);
    
    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return(
        <div className="page-container">
            <Header caption='Subcategorias' />
            <div className="data-container">
                <div style={{marginBottom:'20px', paddingTop: '20px'}}>
                    <AddButton caption='Adicionar' onclick={() => setNewModalOpen(true)} />
                    <Search onchange={(e) => setFiltroText(e.target.value)} />
                    <ComboFilter options={opcoesFiltro} value={filtroCombo} handleChange={(e) => setFiltroCombo(e.target.value)} />
                    <ComboFilter options={opcoesFiltroSubcat} value={filtroCategoria} handleChange={(event) => setFiltroCategoria(event.target.value)} />
                </div>
                <div style={{ height: '65vh', width: '99%', overflowY: 'auto', paddingBottom: '40px',border: 'none', boxShadow: 'none'}}>
                    <DataTable rows={tableRows || []} columns={tableColumns}/>
                </div>
            </div>
            <NovaSubcategoria open={isNewModalOpen} onClose={() => setNewModalOpen(false)} setAlertOpen={setAlertOpen} setAlertProps={setAlertProps} />
            <EditarSubcategoria open={isEditModalOpen} onClose={() => setEditModalOpen(false)} subcategoriaId={selectedSubcategoriaId} setAlertOpen={setAlertOpen} setAlertProps={setAlertProps} />
            <Alert open={alertOpen} setOpen={setAlertOpen} title={alertProps.title} label={alertProps.label} severity={alertProps.severity} />
        </div>
    )
}