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
import Alert from '../components/alerts/alert';
import StateChanger from '../components/stateChanger/stateChanger';
/* FIM COMPONENTES */
import NovoEvento from '../modals/eventos/novoEvento';
import EditarEvento from '../modals/eventos/editarEvento';
import VerEvento from '../modals/aprovacoes/verEvento';

const opcoesFiltroEstado = [
    { value: 'Todos', label: 'Todos' },
    { value: 'Por Aprovar', label: 'Por Aprovar' },
    { value: 'Aprovados', label: 'Apenas Aprovados' },
    { value: 'Rejeitados', label: 'Apenas Rejeitados' },
    { value: 'Cancelados', label: 'Apenas Cancelados' },
];

export default function ListaEventos() {
    const [isNewModalOpen, setNewModalOpen] = useState(false);
    const [filtroText, setFiltroText] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('Todos');
    const [opcoesFiltroSubcat, setOpcoesSubcat] = useState([]);
    const [filtroCategoria, setFiltroCategoria] = useState(0);
    const [tableRows, setTableRows] = useState([]);
    const [isVerModalOpen, setVerModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedEventoId, setSelectedEventoId] = useState(null);
    const [error, setError] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertProps, setAlertProps] = useState({ title: '', label: '', severity: '' });

    const tableColumns = [
        { field: 'id', headerName: 'ID', width: 100, headerAlign: 'left', disableColumnMenu: true },
        { field: 'titulo', headerName: 'Título', flex: 1, headerAlign: 'left', disableColumnMenu: true },
        { field: 'nParticipantes', headerName: '# Participantes', flex: 1, headerAlign: 'left', disableColumnMenu: true },
        { field: 'dataHora', headerName: 'Data e Hora de Começo', type: 'dateTime', width: 250, headerAlign: 'left', disableColumnMenu: true },
        { field: 'localizacao', headerName: 'Localização', flex: 1, headerAlign: 'left', disableColumnMenu: true },
        { field: 'subcategoria', headerName: 'Subcategoria', flex: 1, headerAlign: 'left', disableColumnMenu: true },
        { field: 'estado', headerName: 'Estado', width: 120, headerAlign: 'center', renderCell: (row) => (<StateChanger status={row.value} />), disableColumnMenu: true },
        { field: 'edit', headerName: ' ', width: 90, headerAlign: 'left', sortable: false, renderCell: (row) => ( <EditButton caption=' ' onclick={() => openModal(row)} />), disableColumnMenu: true },
    ];

    const openModal = (row) => {
        const dataHora = new Date(row.row.dataHora);
        const now = new Date();

        setSelectedEventoId(row.id);
        if (dataHora >= now || row.row.estado === 'Cancelado') {
            setEditModalOpen(true);
        } else {
            setVerModalOpen(true);
        }
    }

    const fetchCategorias = async () => {
        const token = sessionStorage.getItem('token');

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/categoria`, {
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
    }

    const fetchData = async () => {
        try {
            const token = sessionStorage.getItem('token');
            let poloid = sessionStorage.getItem('poloid');
            
            if (!poloid) {
                poloid = '';
            }

            let estado = undefined;
            
            if (filtroEstado === 'Aprovados') {
                estado = true;
            } else if (filtroEstado === 'Rejeitados') {
                estado = false;
            } else if (filtroEstado === 'Por Aprovar') {
                estado = "NULL";
            } else if (filtroEstado === 'Cancelados') {
                estado = "Cancelados";
            }

            const response = await axios.get(`${process.env.REACT_APP_API_URL}/evento/filtro`, {
                headers: {
                    Authorization: `${token}`
                },
                params: {
                    estado: estado,
                    categoria: filtroCategoria,
                    descricao: filtroText,
                    poloid: poloid
                }
            });
            const eventos = response.data.data;

            const sortedEvent = eventos.sort((a, b) => a.eventoid - b.eventoid);

            const determinarEstado = (evento) => {
                if (evento.cancelado){
                    return 'Cancelado';
                } else if ((evento.aprovado === null || evento.aprovado === undefined) && evento.cancelado === false ){
                    return 'Por Aprovar';
                }  
                return evento.aprovado ? 'Aprovado' : 'Rejeitado';
            };

            const eventosTable = sortedEvent.map((evento) => {
                const totalParticipantes = parseInt(parseInt(evento.numinscritos) + parseInt(evento.numinscritos));
                return {
                    key: evento.eventoid,
                    id: evento.eventoid,
                    titulo: evento.titulo,
                    nParticipantes: `${totalParticipantes} / ${evento.nmrmaxparticipantes}`,
                    dataHora: new Date(evento.datainicio),
                    localizacao: evento.localizacao,
                    subcategoria: evento.valorpt,
                    estado: determinarEstado(evento),
                    status: evento.aprovado
                };
            });
            
            setTableRows(eventosTable);
            
            if (eventosTable.length === 0) {
                setAlertProps({
                    title: 'Sem Registos',
                    label: 'Nenhum evento encontrado com os filtros aplicados.',
                    severity: 'info'
                });
                setAlertOpen(true);
            }
            
        } catch (error) {
            setError(error);
        }
    };

    useEffect(() => {
        fetchCategorias();
    }, []);

    useEffect(() => {
        fetchData();
    }, [filtroEstado, filtroCategoria, filtroText]);

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
            <Header caption='Eventos' />
            <div className="data-container">
                <div style={{ marginBottom: '20px', paddingTop: '20px' }}>
                    <AddButton caption='Adicionar' onclick={() => setNewModalOpen(true)} />
                    <Search onchange={(e) => setFiltroText(e.target.value)} />
                    <ComboFilter options={opcoesFiltroEstado} value={filtroEstado} handleChange={(e) => setFiltroEstado(e.target.value)} />
                    <ComboFilter options={opcoesFiltroSubcat} value={filtroCategoria} handleChange={(event) => setFiltroCategoria(event.target.value)} />
                </div>
                <div style={{ height: '65vh', width: '99%', overflowY: 'auto', paddingBottom: '40px', border: 'none', boxShadow: 'none' }}>
                    <DataTable rows={tableRows || []} columns={tableColumns} />
                </div>
            </div>
            <NovoEvento open={isNewModalOpen} onClose={() => setNewModalOpen(false)} setAlertOpen={setAlertOpen} setAlertProps={setAlertProps} />
            {isEditModalOpen && (<EditarEvento open={isEditModalOpen} onClose={() => setEditModalOpen(false)} eventData={selectedEventoId} setAlertOpen={setAlertOpen} setAlertProps={setAlertProps} />)}
            {isVerModalOpen && (<VerEvento open={isVerModalOpen} onClose={() => setVerModalOpen(false)} eventoId={selectedEventoId} />)}
            <Alert open={alertOpen} setOpen={setAlertOpen} title={alertProps.title} label={alertProps.label} severity={alertProps.severity} />
        </div>
    );
}
