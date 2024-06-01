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
/* FIM COMPONENTES */
import NovoPolo from '../modals/polos/novoPolo';

const opcoesFiltro = [
    { value:'Todos', label: 'Todos'},
    { value:'Ativos', label: 'Apenas Ativos'},
    { value:'inativos', label: 'Apenas Inativos'}
];

export default function ConfigPolos() {
    const [isNewModalOpen, setNewModalOpen] = useState(false);
    const [filtroText, setFiltroText] = useState('');
    const [filtroCombo, setFiltroCombo] = useState('Todos');
    const [tableRows, setTableRows] = useState([]);
    const [error, setError] = useState('');

    const tableColumns = [
        { field: 'id', headerName: 'ID', width: 100, headerAlign: 'left' },
        { field: 'descricao', headerName: 'Descrição', flex: 0.5, headerAlign: 'left' },
        { field: 'numerousers', headerName: 'Nº de Utilizadores', flex: 0.5, headerAlign: 'left' },
        { field: 'localidade', headerName: 'Localidade', flex: 0.5, headerAlign: 'left' },
        { field: 'coordenador', headerName: 'Coordenador', flex: 0.5, headerAlign: 'left' },
        { field: 'estado', headerName: 'Estado', width: 120, headerAlign: 'center', renderCell: (row) => ( <StateChanger status={row.value} />) },
        { field: 'status', headerName: ' ', width: 100, headerAlign: 'left', sortable: false , renderCell: (row) => ( <EditButton caption=' ' /*onclick={} id={row.id}*/ />)},
    ];

    const fetchData = async () => {
        try {
            const token = 'tokenFixo';
            const response = await axios.get('http://localhost:8000/polo', {
                headers: {
                    Authorization: `${token}`
                }
            });
            const polos = response.data.data;
            
            setTableRows(polos.map((polo) => ({
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
        if(!isNewModalOpen){
            fetchData();
        }
    }, [isNewModalOpen])

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
                    <ComboFilter options={opcoesFiltro} value={filtroCombo} handleChange={(e) => setFiltroCombo(e.target.value)} />
                </div>
                <div style={{ height: '65vh', width: '99%', overflowY: 'auto', paddingBottom: '40px',border: 'none', boxShadow: 'none'}}>
                    <DataTable rows={tableRows || []} columns={tableColumns}/>
                </div>
            </div>
            <NovoPolo open={isNewModalOpen} onClose={() => setNewModalOpen(false)}/>
        </div>
    )
}