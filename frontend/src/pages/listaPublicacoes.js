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
import ComboFilter from '../components/combobox/comboFilter';
import Alert from '../components/alerts/alert';
/* FIM COMPONENTES */
import NovaPub from '../modals/publicacoes/novaPub';
import EditPub from '../modals/publicacoes/editPub';

export default function ListaPublicacoes() {
    const [isNewModalOpen, setNewModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [filtroText, setFiltroText] = useState('');
    const [opcoesFiltroCat, setOpcoesCat] = useState([]);
    const [filtroCategoria, setFiltroCategoria] = useState(0);
    const [tableRows, setTableRows] = useState([]);
    const [error, setError] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertProps, setAlertProps] = useState({ title: '', label: '', severity: '' });

    const tableColumns = [
        { field: 'id', headerName: 'ID', width: 100, headerAlign: 'left', disableColumnMenu: true },
        { field: 'titulo', headerName: 'Título', flex: 1, headerAlign: 'left', disableColumnMenu: true },
        { field: 'dataHora', headerName: 'Data e Hora de Criação', type: 'dateTime', width: 250, headerAlign: 'left', disableColumnMenu: true },
        { field: 'criadoPor', headerName: 'Criado por', flex: 1, headerAlign: 'left', disableColumnMenu: true },
        { field: 'subcategoria', headerName: 'Subcategoria', flex: 1, headerAlign: 'left', disableColumnMenu: true },
        { field: 'estado', headerName: 'Estado', width: 120, headerAlign: 'left', renderCell: (row) => ( <StateChanger status={row.value} />), disableColumnMenu: true },
        { field: 'edit', headerName: ' ', width: 90, headerAlign: 'left', sortable: false , renderCell: (row) => ( <EditButton caption=' ' onclick={() => handleEditClick(row.id)}/>), disableColumnMenu: true },
    ];

    const fetchCategorias = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/categoria', {
                headers: {
                    Authorization: `${token}`
                }
            });
            const categorias = response.data;
            setOpcoesCat([
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
            const response = await axios.get('http://localhost:8000/thread/filtro', {
                headers: {
                    Authorization: `${token}`
                },
                params: {
                    categoria: filtroCategoria,
                    descricao: filtroText
                }
            });
            const threads = response.data.data;
            
            const sortedPub= threads.sort((a, b) => a.threadid - b.threadid);
            
            setTableRows(
                sortedPub.map((thread) => ({
                    key: thread.threadid,
                    id: thread.threadid,
                    titulo: thread.titulo,
                    dataHora: new Date(thread.datacriacao),
                    criadoPor: thread.pnome+' '+thread.unome,
                    subcategoria: thread.valorpt,
                    estado: thread.inactivo ? 'Inativo' : 'Ativo'
                }))
            );

            if (sortedPub.length === 0) {
                setAlertProps({
                    title: 'Sem Registos',
                    label: 'Nenhuma publicação encontrada com os filtros aplicados.',
                    severity: 'info'
                });
                setAlertOpen(true);
            }
            
        } catch (error) {
            setError(error);
        }
    };

    const handleEditClick = (id) => {
        setSelectedId(id);
        setEditModalOpen(true);
    };

    useEffect(() => {
        fetchCategorias();
    }, []);

    useEffect(() => {
        fetchData();
    }, [filtroCategoria, filtroText]);

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

    return(
        <div className="page-container">
            <Header caption='Publicações' />
            <div className="data-container">
                <div style={{marginBottom:'20px', paddingTop: '20px'}}>
                    <AddButton caption='Adicionar' onclick={() => setNewModalOpen(true)} />
                    <Search onchange={(e) => setFiltroText(e.target.value)} />
                    <ComboFilter options={opcoesFiltroCat} value={filtroCategoria} handleChange={(e) => setFiltroCategoria(e.target.value)} />
                </div>
                <div style={{ height: '65vh', width: '99%', overflowY: 'auto', paddingBottom: '40px',border: 'none', boxShadow: 'none'}}>
                    <DataTable rows={tableRows || []} columns={tableColumns}/>
                </div>
            </div>
            <NovaPub open={isNewModalOpen} onClose={() => setNewModalOpen(false)} setAlertOpen={setAlertOpen} setAlertProps={setAlertProps} />
            {isEditModalOpen && (<EditPub open={isEditModalOpen} onClose={() => setEditModalOpen(false)} idPub={selectedId} setAlertOpen={setAlertOpen} setAlertProps={setAlertProps} />)}
            <Alert open={alertOpen} setOpen={setAlertOpen} title={alertProps.title} label={alertProps.label} severity={alertProps.severity} />
        </div>
    )
}