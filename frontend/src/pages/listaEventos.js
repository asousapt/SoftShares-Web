import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './page.css';
/* COMPONENTES */
import DataTable from '../components/tables/dataTable';
import EditButton from '../components/buttons/editButton';
import Header from '../components/header/header';
import AddButton from '../components/buttons/addButton';
import Search from '../components/textFields/search';
import ComboFilter from '../components/combobox/comboFilter';
/* FIM COMPONENTES */
import NovoEvento from '../modals/eventos/novoEvento'; 

const opcoesFiltroEstado = [
    { value: 'Todos', label: 'Todos' },
    { value: 'Ativos', label: 'Apenas Ativos' },
    { value: 'inativos', label: 'Apenas Inativos' }
];

export default function ListaEventos() {
    const [isNewModalOpen, setNewModalOpen] = useState(false);
    const [filtroText, setFiltroText] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('Todos');
    const [opcoesFiltroCat, setOpcoesCat] = useState([]);
    const [filtroCategoria, setFiltroCategoria] = useState(0);
    const [tableRows, setTableRows] = useState([]);
    const [error, setError] = useState(null);

    const tableColumns = [
        { field: 'id', headerName: 'ID', width: 100, headerAlign: 'left' },
        { field: 'titulo', headerName: 'Título', flex: 1, headerAlign: 'left' },
        { field: 'nParticipantes', headerName: '# Participantes', flex: 0.5, headerAlign: 'left' },
        { field: 'dataHora', headerName: 'Data e Hora de Começo', type: 'dateTime', width: 300, headerAlign: 'left' },
        { field: 'localizacao', headerName: 'Localização', flex: 1, headerAlign: 'left' },
        { field: 'edit', headerName: ' ', width: 90, headerAlign: 'left', sortable: false, renderCell: (row) => (
                <EditButton caption=' ' /*onclick={} id={row.id}*/ />
            )
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = 'tokenFixo';
                const response = await axios.get('http://localhost:8000/evento', {
                    headers: {
                        Authorization: `${token}`
                    }
                });
                const eventos = response.data.data;
                setTableRows(
                    eventos.map((evento) => ({
                        key: evento.eventoid,
                        id: evento.eventoid,
                        titulo: evento.titulo,
                        nParticipantes: `- / ${evento.nmrmaxparticipantes}`,
                        dataHora: new Date(evento.datainicio),
                        localizacao: evento.localizacao
                    }))
                );
            } catch (error) {
                setError(error);
            }
        };
        
        const fetchCategorias = async () => {
            try {
                const token = 'tokenFixo';
                const response = await axios.get('http://localhost:8000/categoria', {
                    headers: {
                        Authorization: `${token}`
                    }
                });
                const categorias = response.data;
                console.log(categorias);
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
        fetchCategorias();
        fetchData();
    }, []);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="page-container">
            <Header caption='Eventos' />
            <div className="data-container">
                <div style={{ marginBottom: '20px', paddingTop: '20px' }}>
                    <AddButton caption='Adicionar' onclick={() => setNewModalOpen(true)} />
                    <Search onchange={(e) => setFiltroText(e.target.value)} />
                    <ComboFilter options={opcoesFiltroEstado} value={filtroEstado} handleChange={(e) => setFiltroEstado(e.target.value)} />
                    <ComboFilter options={opcoesFiltroCat} value={filtroCategoria} handleChange={(event) => setFiltroCategoria(event.target.value)} />
                </div>
                <div style={{ height: '65vh', width: '99%', overflowY: 'auto', paddingBottom: '40px', border: 'none', boxShadow: 'none' }}>
                    <DataTable rows={tableRows || []} columns={tableColumns} />
                </div>
            </div>
            <NovoEvento open={isNewModalOpen} onClose={() => setNewModalOpen(false)} />
        </div>
    );
}
