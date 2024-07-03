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
import Alert from '../components/alerts/alert';

export default function ModAprov() {
    const [filtroText, setFiltroText] = useState('');
    const [tableRows, setTableRows] = useState([]);
    const [error, setError] = useState('');
    const [isModalOpen1, setIsModalOpen1] = useState(false);
    const [isModalOpen2, setIsModalOpen2] = useState(false);
    const [isModalOpen3, setIsModalOpen3] = useState(false);
    const [isModalOpen4, setIsModalOpen4] = useState(false);
    const [selectedRegisto, setSelectedRegisto] = useState({ id: null, tipo: null });
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertProps, setAlertProps] = useState({ title: '', label: '', severity: '' });

    const tableColumns = [
        { field: 'id', headerName: 'ID', width: 100, headerAlign: 'left', disableColumnMenu: true },
        { field: 'tipo', headerName: 'Tipo', flex: 1, headerAlign: 'left', disableColumnMenu: true },
        { field: 'titulo', headerName: 'Título', flex: 2, headerAlign: 'left', disableColumnMenu: true },
        { field: 'criadoPor', headerName: 'Criado Por', flex: 1, headerAlign: 'left', disableColumnMenu: true },
        { field: 'permitir', headerName: 'Permitir', width: 85, headerAlign: 'left', sortable: false, renderCell: (params) => (<AprovButton onclick={() => handleOpenConfirmarAprov(params.row)} />), disableColumnMenu: true },
        { field: 'remover', headerName: 'Remover', width: 85, headerAlign: 'left', sortable: false, renderCell: (params) => (<RejButton onclick={() => handleOpenRejeitarAprov(params.row)} />), disableColumnMenu: true },
        { field: 'ver', headerName: 'Ver', width: 85, headerAlign: 'left', sortable: false, renderCell: (params) => (<DetailButton onclick={() => handleOpenModal(params.row)} />), disableColumnMenu: true },
    ];

    const fetchData = async () => {
        try {
            const token = sessionStorage.getItem('token');
            let poloid = sessionStorage.getItem('poloid');

            if (!poloid) {
                poloid = '';
            }

            const responseEventos = await axios.get(`${process.env.REACT_APP_API_URL}/evento/porAprovar`, {
                headers: {
                    Authorization: `${token}`
                },
                params: {
                    descricao: filtroText,
                    poloid: poloid
                }
            });
            const eventos = responseEventos.data.data;

            const responsePontosInteresse = await axios.get(`${process.env.REACT_APP_API_URL}/pontoInteresse/porAprovar`, {
                headers: {
                    Authorization: `${token}`
                },
                params: {
                    descricao: filtroText
                }
            });
            const pontosinteresse = responsePontosInteresse.data.data;

            const sortedPint = pontosinteresse.sort((a, b) => a.pontointeresseid - b.pontointeresseid);
            const sortedEvent = eventos.sort((a, b) => a.eventoid - b.eventoid);

            const linhatemp = [
                ...sortedPint.map((ponto) => ({
                    key: 'PDI' + ponto.pontointeresseid,
                    id: ponto.pontointeresseid,
                    tipo: 'Ponto de Interesse',
                    titulo: ponto.titulo,
                    criadoPor: ponto.utilizadorcriou_utilizador.pnome + ' ' + ponto.utilizadorcriou_utilizador.unome
                })),
                ...sortedEvent.map((evento) => ({
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
                await axios.put(`${process.env.REACT_APP_API_URL}/pontoInteresse/aprovar/${id}`, aprovacao, {
                    headers: {
                        Authorization: `${token}`
                    }
                });
            } else if (tipo === 'Evento') {
                await axios.put(`${process.env.REACT_APP_API_URL}/evento/aprovar/${id}`, aprovacao, {
                    headers: {
                        Authorization: `${token}`
                    }
                });
            }
            fetchData();
            setAlertProps({ title: 'Sucesso', label: `O ${tipo} foi aprovado com sucesso.`, severity: 'success' });
            setAlertOpen(true);
        } catch (error) {
            console.error('Erro ao aprovar registo:', error.message);
            setAlertProps({ title: 'Erro', label: `Ocorreu um erro ao aprovar o ${tipo}.`, severity: 'error' });
            setAlertOpen(true);
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
                await axios.put(`${process.env.REACT_APP_API_URL}/pontoInteresse/rejeitar/${id}`, aprovacao, {
                    headers: {
                        Authorization: `${token}`
                    }
                });
            } else if (tipo === 'Evento') {
                await axios.put(`${process.env.REACT_APP_API_URL}/evento/rejeitar/${id}`, aprovacao, {
                    headers: {
                        Authorization: `${token}`
                    }
                });
            }
            fetchData();
            setAlertProps({ title: 'Sucesso', label: 'O registo foi rejeitado com sucesso.', severity: 'success' });
            setAlertOpen(true);
        } catch (error) {
            console.error('Erro ao rejeitar registo:', error.message);
            setAlertProps({ title: 'Erro', label: 'Ocorreu um erro ao rejeitar o registo.', severity: 'error' });
            setAlertOpen(true);
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
            <Alert open={alertOpen} setOpen={setAlertOpen} title={alertProps.title} label={alertProps.label} severity={alertProps.severity} />
        </div>
    );
}
