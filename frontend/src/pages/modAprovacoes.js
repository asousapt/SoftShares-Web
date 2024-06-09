import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './page.css';
/* COMPONENTES */
import DataTable from '../components/tables/dataTable';
import AprovButton from '../components/buttons/aproveButton';
import DetailButton from '../components/buttons/detailButton';
import RejButton from '../components/buttons/rejectButton';
import Header from '../components/header/header';
import Search from '../components/textFields/search';
/* FIM COMPONENTES */

export default function ModAprov() {
    const [filtroText, setFiltroText] = useState('');
    const [tableRows, setTableRows] = useState([]);
    const [error, setError] = useState('');

    const tableColumns = [
        { field: 'id', headerName: 'ID', width: 100, headerAlign: 'left' },
        { field: 'tipo', headerName: 'Tipo', flex: 1, headerAlign: 'left' },
        { field: 'titulo', headerName: 'Título', flex: 2, headerAlign: 'left' },
        { field: 'criadoPor', headerName: 'Criado Por', flex: 1, headerAlign: 'left' },
        { field: 'permitir', headerName: 'Permitir', width: 85, headerAlign: 'left', sortable: false , renderCell: (row) => ( <AprovButton onclick={aprovarRegisto(row)} />)},
        { field: 'remover', headerName: 'Remover', width: 85, headerAlign: 'left', sortable: false , renderCell: (row) => ( <RejButton onclick={rejeitarRegisto(row)} />)},
        { field: 'ver', headerName: 'Ver', width: 85, headerAlign: 'left', sortable: false , renderCell: (row) => ( <DetailButton /*onclick={} id={row.id}*/ />)},
    ];

    const fetchData = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const responseEventos = await axios.get('http://localhost:8000/evento/porAprovar', {
                headers: {
                    Authorization: `${token}`
                },
                params: {
                    descricao: filtroText
                }
            });
            const eventos = responseEventos.data.data;

            const responsePontosInteresse = await axios.get('http://localhost:8000/pontoInteresse/porAprovar', {
                headers: {
                    Authorization: `${token}`
                },
                params: {
                    descricao: filtroText
                }
            });
            const pontosinteresse = responsePontosInteresse.data.data;
            
            const linhatemp = [
                ...pontosinteresse.map((ponto) => ({
                    key: 'PDI'+ponto.pontointeresseid,
                    id: ponto.pontointeresseid,
                    tipo: 'Ponto de Interesse',
                    titulo: ponto.titulo,
                    criadoPor: ponto.utilizadorcriou_utilizador.pnome + ' ' + ponto.utilizadorcriou_utilizador.unome
                })),
                ...eventos.map((evento) => ({
                    key: 'evento'+evento.eventoid,
                    id: evento.eventoid,
                    tipo: 'Evento',
                    titulo: evento.titulo,
                    criadoPor: evento.utilizadorcriou_utilizador.pnome + ' ' + evento.utilizadorcriou_utilizador.unome
                }))
            ];
            
            setTableRows(linhatemp);
            
        } catch (error) {
            setError(error);
        }
    };

    const aprovarRegisto = async (row) =>{
        console.log(row);
    }

    const rejeitarRegisto = async (row) =>{
        console.log(row);
    }

    useEffect(() => {
        fetchData();
    }, [filtroText]);
    
    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return(
        <div className="page-container">
            <Header caption='Aprovações' />
            <div className="data-container">
                <div style={{marginBottom:'20px', paddingTop: '20px'}}>
                    <Search onchange={(e) => setFiltroText(e.target.value)} />
                </div>
                <div style={{ height: '65vh', width: '99%', overflowY: 'auto', paddingBottom: '40px',border: 'none', boxShadow: 'none'}}>
                    <DataTable rows={tableRows || []} columns={tableColumns}/>
                </div>
            </div>
        </div>
    )
}