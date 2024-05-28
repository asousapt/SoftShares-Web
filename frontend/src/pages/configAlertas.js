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
import NovoAlerta from '../modals/alertas/novoAlerta';

const opcoesFiltro = [
    { value:'Todos', label: 'Todos'},
    { value:'Ativos', label: 'Apenas Ativos'},
    { value:'Inativos', label: 'Apenas Inativos'}
];

export default function ConfigAlertas() {
    const [isNewModalOpen, setNewModalOpen] = useState(false);
    const [filtroText, setFiltroText] = useState('');
    const [filtroCombo, setFiltroCombo] = useState('Todos');
    const [tableRows, setTableRows] = useState([]);
    const [error, setError] = useState(null);

    const tableColumns = [
        { field: 'id', headerName: 'ID', width: 100, headerAlign: 'left' },
        { field: 'alerta', headerName: 'Alerta', flex: 1, headerAlign: 'left' },
        { field: 'dataHora', headerName: 'Data e Hora de Começo', type: 'dateTime', width: 300, headerAlign: 'left' },
        { field: 'criadoPor', headerName: 'Criado por', flex: 1, headerAlign: 'left' },
        { field: 'estado', headerName: 'Estado', width: 120, headerAlign: 'center', renderCell: (row) => ( <StateChanger status={row.value} />) },
        { field: 'ver', headerName: ' ', width: 100, headerAlign: 'left', sortable: false , renderCell: (row) => ( <EditButton caption=' ' /*onclick={} id={row.id}*/ />)},
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = 'tokenFixo';
    
                const response = await axios.get('http://localhost:8000/alerta', {
                    headers: {
                        Authorization: `${token}`
                    }
                });
                const alertas = response.data.data;
                
                setTableRows(alertas.map((alerta) => ({
                    key: alerta.alertaid,
                    id: alerta.alertaid,
                    alerta: alerta.texto,
                    dataHora: new Date(alerta.datainicio),
                    criadoPor: alerta.utilizador.pnome+' '+alerta.utilizador.unome,
                    estado: alerta.inactivo ? 'Inativo' : 'Ativo',
                })));
            } catch (error) {
                setError(error);
            }
        };
    
        fetchData();
    }, [])

    if (error) {
        return <div>Error: {error.message}</div>;
    }


    return(
        <div className="page-container">
            <Header caption='Alertas' />
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
            <NovoAlerta open={isNewModalOpen} onClose={() => setNewModalOpen(false)}/>
        </div>
    )
}