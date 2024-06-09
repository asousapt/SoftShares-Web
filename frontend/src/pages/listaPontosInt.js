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
import NovoPontoInt from '../modals/pontosInteresse/novoPontoInt';

const opcoesFiltro = [
    { value:'Todos', label: 'Todos'},
    { value:'Aprovados', label: 'Apenas Aprovados'},
    { value:'Rejeitados', label: 'Apenas Rejeitados'}
];

export default function ListaPontosInt() {
    const [isNewModalOpen, setNewModalOpen] = useState(false);
    const [filtroText, setFiltroText] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('Todos');
    const [opcoesFiltroSubcat, setOpcoesSubcat] = useState([]);
    const [filtroCategoria, setFiltroCategoria] = useState(0);
    const [tableRows, setTableRows] = useState([]);
    const [error, setError] = useState(null);

    const tableColumns = [
        { field: 'id', headerName: 'ID', width: 100, headerAlign: 'left' },
        { field: 'titulo', headerName: 'Título', flex: 0.5, headerAlign: 'left' },
        { field: 'dataHora', headerName: 'Data e Hora de Começo', type: 'dateTime', width: 300, headerAlign: 'left' },
        { field: 'localizacao', headerName: 'Localização', flex: 0.5, headerAlign: 'left' },
        { field: 'subcategoria', headerName: 'Subcategoria', flex: 1, headerAlign: 'left' },
        { field: 'edit', headerName: ' ', width: 90, headerAlign: 'left', sortable: false , renderCell: (row) => ( <EditButton caption=' ' /*onclick={} id={row.id}*/ />)},
    ];

    const fetchCategorias = async () => {
        const token = sessionStorage.getItem('token');

        const response = await axios.get('http://localhost:8000/categoria', {
            headers: {
                Authorization: `${token}`
            }
        });
        const categorias = response.data;
        console.log(categorias);

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

            let estado = undefined;
            if (filtroEstado === 'Aprovados') {
                estado = true;
            } else if (filtroEstado === 'Rejeitados') {
                estado = false;
            }
            const response = await axios.get('http://localhost:8000/pontoInteresse/filtro', {
                headers: {
                    Authorization: `${token}`
                },
                params: {
                    estado: estado,
                    categoria: filtroCategoria,
                    descricao: filtroText
                }
            });
            const eventos = response.data.data;

            const pontosInteresseTable = eventos.map((ponto) => ({
                key: ponto.pontointeresseid,
                id: ponto.pontointeresseid,
                titulo: ponto.titulo,
                dataHora: new Date(ponto.datacriacao),
                localizacao: ponto.localizacao,
                subcategoria: ponto.valorpt
            }));

            setTableRows(pontosInteresseTable);
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

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return(
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
            <NovoPontoInt open={isNewModalOpen} onClose={() => setNewModalOpen(false)}/>
        </div>
    )
}