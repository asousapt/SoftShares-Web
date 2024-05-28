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

const opcoesFiltro = [
    { value:'Todos', label: 'Todos'},
    { value:'Ativos', label: 'Apenas Ativos'},
    { value:'inativos', label: 'Apenas Inativos'}
];

export default function ConfigCategorias() {
    const [isNewModalOpen, setNewModalOpen] = useState(false);
    const [filtroText, setFiltroText] = useState('');
    const [filtroCombo, setFiltroCombo] = useState('Todos');
    const [tableRows, setTableRows] = useState([]);
    const [error, setError] = useState('');

    const tableColumns = [
        { field: 'id', headerName: 'ID', width: 100, headerAlign: 'left' },
        { field: 'categoria', headerName: 'Categoria', flex: 1, headerAlign: 'left' },
        { field: 'dataHora', headerName: 'Data e Hora de Criação', type: 'dateTime', width: 300, headerAlign: 'left' },
        { field: 'estado', headerName: 'Estado', width: 120, headerAlign: 'center', renderCell: (row) => ( <StateChanger status={row.value} />) },
        { field: 'ver', headerName: 'Ver', width: 100, headerAlign: 'left', sortable: false , renderCell: (row) => ( <EditButton caption=' ' /*onclick={} id={row.id}*/ />)},
    ];

    const fetchData = async () => {
        try {
            const token = 'tokenFixo';
            const response = await axios.get('http://localhost:8000/categoria', {
                headers: {
                    Authorization: `${token}`
                }
            });
            const categorias = response.data;
            
            setTableRows(categorias.map((categoria) => ({
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

    useEffect(() => {
        fetchData();
    }, []);

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
            <NovaCategoria open={isNewModalOpen} onClose={() => setNewModalOpen(false)}/>
        </div>
    )
}