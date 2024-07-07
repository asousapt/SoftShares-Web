import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './page.css';
import DataTable from '../components/tables/dataTable';
import EditButton from '../components/buttons/editButton';
import Header from '../components/header/header';
import AddButton from '../components/buttons/addButton';
import Search from '../components/textFields/search';
import ComboFilter from '../components/combobox/comboFilter';
import Alert from '../components/alerts/alert';
import StateChanger from '../components/stateChanger/stateChanger';
import NovoPontoInt from '../modals/pontosInteresse/novoPontoInt';
import EditPontoInt from '../modals/pontosInteresse/editPontoInt';

const opcoesFiltro = [
    { value: 'Todos', label: 'Todos' },
    { value: 'Por Aprovar', label: 'Por Aprovar' },
    { value: 'Aprovados', label: 'Apenas Aprovados' },
    { value: 'Rejeitados', label: 'Apenas Rejeitados' },
];

export default function ListaPontosInt() {
    const [isNewModalOpen, setNewModalOpen] = useState(false);
    const [filtroText, setFiltroText] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('Todos');
    const [opcoesFiltroSubcat, setOpcoesSubcat] = useState([]);
    const [filtroCategoria, setFiltroCategoria] = useState(0);
    const [tableRows, setTableRows] = useState([]);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedPontoIntId, setSelectedPontoIntId] = useState(null);
    const [error, setError] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertProps, setAlertProps] = useState({ title: '', label: '', severity: '' });

    const tableColumns = [
        { field: 'id', headerName: 'ID', width: 100, headerAlign: 'left', disableColumnMenu: true },
        { field: 'titulo', headerName: 'Título', flex: 0.5, headerAlign: 'left', disableColumnMenu: true },
        { field: 'dataHora', headerName: 'Data e Hora de Começo', type: 'dateTime', width: 300, headerAlign: 'left', disableColumnMenu: true },
        { field: 'localizacao', headerName: 'Localização', flex: 0.5, headerAlign: 'left', disableColumnMenu: true },
        { field: 'subcategoria', headerName: 'Subcategoria', flex: 1, headerAlign: 'left', disableColumnMenu: true },
        { field: 'estado', headerName: 'Estado', width: 120, headerAlign: 'center', renderCell: (row) => (<StateChanger status={row.value} />), disableColumnMenu: true },
        { field: 'edit', headerName: ' ', width: 90, headerAlign: 'left', sortable: false , renderCell: (row) => ( <EditButton caption=' ' onclick={() => handleEditClick(row.id)} />), disableColumnMenu: true },
    ];

    const fetchCategorias = async () => {
        const token = sessionStorage.getItem('token');

        try {
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
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
        }
    };

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
            }

            const response = await axios.get(`${process.env.REACT_APP_API_URL}/pontoInteresse/filtro`, {
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
            const pontosInt = response.data.data;

            const sortedPint = pontosInt.sort((a, b) => a.pontointeresseid - b.pontointeresseid);

            const determinarEstado = (aprovado) => {
                if (aprovado === null || aprovado === undefined) return 'Por Aprovar';
                return aprovado ? 'Aprovado' : 'Rejeitado';
            };

            const pontosInteresseTable = sortedPint.map((ponto) => ({
                key: ponto.pontointeresseid,
                id: ponto.pontointeresseid,
                titulo: ponto.titulo,
                dataHora: new Date(ponto.datacriacao),
                localizacao: ponto.localizacao,
                subcategoria: ponto.valorpt,
                estado: determinarEstado(ponto.aprovado),
                status: ponto.aprovado
            }));

            setTableRows(pontosInteresseTable);

            if (pontosInteresseTable.length === 0) {
                setAlertProps({
                    title: 'Sem Registos',
                    label: 'Nenhum Ponto de Interesse encontrado com os filtros aplicados.',
                    severity: 'info'
                });
                setAlertOpen(true);
            }

        } catch (error) {
            setError(error);
        }
    };

    const handleEditClick = (id) => {
        setSelectedPontoIntId(id);
        setEditModalOpen(true);
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
            <Header caption='Pontos de Interesse' />
            <div className="data-container">
                <div style={{marginBottom:'20px', paddingTop: '20px'}}>
                    <AddButton caption='Adicionar' onclick={() => setNewModalOpen(true)} />
                    <Search onchange={(e) => setFiltroText(e.target.value)} />
                    <ComboFilter options={opcoesFiltro} value={filtroEstado} handleChange={(e) => setFiltroEstado(e.target.value)} />
                    <ComboFilter options={opcoesFiltroSubcat} value={filtroCategoria} handleChange={(event) => setFiltroCategoria(event.target.value)} />
                </div>
                <div style={{ height: '65vh', width: '99%', overflowY: 'auto', paddingBottom: '40px',border: 'none', boxShadow: 'none'}}>
                    <DataTable rows={tableRows || []} columns={tableColumns}/>
                </div>
            </div>
            <NovoPontoInt open={isNewModalOpen} onClose={() => setNewModalOpen(false)} setAlertOpen={setAlertOpen} setAlertProps={setAlertProps}/>
            {isEditModalOpen && <EditPontoInt open={isEditModalOpen} onClose={() => setEditModalOpen(false)} eventData={selectedPontoIntId} setAlertOpen={setAlertOpen} setAlertProps={setAlertProps}/>}
            <Alert open={alertOpen} setOpen={setAlertOpen} title={alertProps.title} label={alertProps.label} severity={alertProps.severity} />
        </div>
    );
}
