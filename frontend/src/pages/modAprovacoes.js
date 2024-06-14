import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './page.css';
import DataTable from '../components/tables/dataTable';
import AprovButton from '../components/buttons/aproveButton';
import DetailButton from '../components/buttons/detailButton';
import RejButton from '../components/buttons/rejectButton';
import Header from '../components/header/header';
import Search from '../components/textFields/search';
import VerEvento from '../modals/aprovacoes/verEvento';
import VerPontoInteresse from '../modals/aprovacoes/verPontoInteresse';
import ConfirmarAprov from '../modals/aprovacoes/confirmarAprov';
import RejeitarAprov from '../modals/aprovacoes/rejeitarAprov';

export default function ModAprov() {
    const [filtroText, setFiltroText] = useState('');
    const [tableRows, setTableRows] = useState([]);
    const [error, setError] = useState('');
    const [isModalOpen1, setIsModalOpen1] = useState(false);
    const [isModalOpen2, setIsModalOpen2] = useState(false);
    const [isModalOpen3, setIsModalOpen3] = useState(false);
    const [isModalOpen4, setIsModalOpen4] = useState(false);
    const [selectedRegisto, setSelectedRegisto] = useState({ id: null, tipo: null });

    const tableColumns = [
        { field: 'id', headerName: 'ID', width: 100, headerAlign: 'left' },
        { field: 'tipo', headerName: 'Tipo', flex: 1, headerAlign: 'left' },
        { field: 'titulo', headerName: 'Título', flex: 2, headerAlign: 'left' },
        { field: 'criadoPor', headerName: 'Criado Por', flex: 1, headerAlign: 'left' },
        { field: 'permitir', headerName: 'Permitir', width: 85, headerAlign: 'left', sortable: false, renderCell: (params) => (<AprovButton onclick={() => handleOpenConfirmarAprov(params.row)} />) },
        { field: 'remover', headerName: 'Remover', width: 85, headerAlign: 'left', sortable: false, renderCell: (params) => (<RejButton onclick={() => handleOpenRejeitarAprov(params.row)} />) },
        { field: 'ver', headerName: 'Ver', width: 85, headerAlign: 'left', sortable: false, renderCell: (params) => (<DetailButton onclick={() => handleOpenModal(params.row)} />) },
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
                    key: 'PDI' + ponto.pontointeresseid,
                    id: ponto.pontointeresseid,
                    tipo: 'Ponto de Interesse',
                    titulo: ponto.titulo,
                    criadoPor: ponto.utilizadorcriou_utilizador.pnome + ' ' + ponto.utilizadorcriou_utilizador.unome
                })),
                ...eventos.map((evento) => ({
                    key: 'evento' + evento.eventoid,
                    id: evento.eventoid,
                    tipo: 'Evento',
                    titulo: evento.titulo,
                    criadoPor: evento.utilizadorcriou_utilizador.pnome + ' ' + evento.utilizadorcriou_utilizador.unome
                }))
            ];

            setTableRows(linhatemp);
        } catch (error) {
            setError(error.message);
        }
    };

    const aprovarRegisto = async (id, tipo) => {
        try {
            const userid = sessionStorage.getItem('userid');
            const token = sessionStorage.getItem('token');
            const aprovacao = {
                userAprovacao: userid
            };

            if (tipo === 'Ponto de Interesse') {
                await axios.put(`http://localhost:8000/pontoInteresse/aprovar/${id}`, aprovacao, {
                    headers: {
                        Authorization: `${token}`
                    }
                });
            } else if (tipo === 'Evento') {
                await axios.put(`http://localhost:8000/evento/aprovar/${id}`, aprovacao, {
                    headers: {
                        Authorization: `${token}`
                    }
                });
            }
            fetchData();
        } catch (error) {
            console.error('Erro ao aprovar registo:', error.message);
        }
    };

    const rejeitarRegisto = async (id, tipo) => {
        try {
            const userid = sessionStorage.getItem('userid');
            const token = sessionStorage.getItem('token');
            const aprovacao = {
                userAprovacao: userid
            };

            if (tipo === 'Ponto de Interesse') {
                await axios.put(`http://localhost:8000/pontoInteresse/rejeitar/${id}`, aprovacao, {
                    headers: {
                        Authorization: `${token}`
                    }
                });
            } else if (tipo === 'Evento') {
                await axios.put(`http://localhost:8000/evento/rejeitar/${id}`, aprovacao, {
                    headers: {
                        Authorization: `${token}`
                    }
                });
            }
            fetchData();
        } catch (error) {
            console.error('Erro ao rejeitar registo:', error.message);
        }
    };

    const handleOpenModal = (row) => {
        setSelectedRegisto({ id: row.id, tipo: row.tipo });
        if (row.tipo === 'Evento') {
            setIsModalOpen1(true);
        } else if (row.tipo === 'Ponto de Interesse') {
            setIsModalOpen2(true);
        }
    };

    const handleOpenConfirmarAprov = (row) => {
        setSelectedRegisto({ id: row.id, tipo: row.tipo });
        setIsModalOpen3(true);
    };

    const handleOpenRejeitarAprov = (row) => {
        setSelectedRegisto({ id: row.id, tipo: row.tipo });
        setIsModalOpen4(true);
    };
    
    const handleCloseModal = () => {
        setIsModalOpen1(false);
        setIsModalOpen2(false);
        setIsModalOpen3(false);
        setIsModalOpen4(false);
        setSelectedRegisto({ id: null, tipo: null });
    };
    
    useEffect(() => {
        fetchData();
    }, [filtroText]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="page-container">
            <Header caption='Aprovações' />
            <div className="data-container">
                <div style={{ marginBottom: '20px', paddingTop: '20px' }}>
                    <Search onChange={(e) => setFiltroText(e.target.value)} />
                </div>
                <div style={{ height: '65vh', width: '99%', overflowY: 'auto', paddingBottom: '40px', border: 'none', boxShadow: 'none' }}>
                    <DataTable rows={tableRows || []} columns={tableColumns} />
                </div>
            </div>
            {isModalOpen1 && (<VerEvento open={isModalOpen1} onClose={handleCloseModal} eventoId={selectedRegisto.id}/>)}
            {isModalOpen2 && (<VerPontoInteresse open={isModalOpen2} onClose={handleCloseModal} registoId={selectedRegisto.id} />)}
            {isModalOpen3 && (<ConfirmarAprov open={isModalOpen3} onClose={handleCloseModal} dados={selectedRegisto} onConfirm={aprovarRegisto}/>)}
            {isModalOpen4 && (<RejeitarAprov open={isModalOpen4} onClose={handleCloseModal} dados={selectedRegisto} onConfirm={rejeitarRegisto}/>)}
        </div>
    );
}
