import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './page.css';
/* COMPONENTES */
import DataTable from '../components/tables/dataTable';
import DetailButton from '../components/buttons/detailButton';
import AprovButton from '../components/buttons/aproveButton';
import RejButton from '../components/buttons/rejectButton';
import Header from '../components/header/header';
import Search from '../components/textFields/search';
/* FIM COMPONENTES */
import VerComentario from '../modals/comentario/verComentario';
import ConfirmarDenuncia from '../modals/comentario/confirmarDenuncia';
import RejeitarDebuncia from '../modals/comentario/rejeitarDenuncia';
import Alert from '../components/alerts/alert';

export default function ModDen() {
    const [isNewModalOpen, setNewModalOpen] = useState(false);
    const [filtroText, setFiltroText] = useState('');
    const [tableRows, setTableRows] = useState([]);
    const [error, setError] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedRegisto, setSelectedRegisto] = useState({ id: null });
    const [isModalOpen1, setIsModalOpen1] = useState(false);
    const [isModalOpen2, setIsModalOpen2] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertProps, setAlertProps] = useState({ title: '', label: '', severity: '' });

    const tableColumns = [
        { field: 'id', headerName: 'ID', width: 100, headerAlign: 'left', disableColumnMenu: true },
        { field: 'motivo', headerName: 'Motivo', flex: 1, headerAlign: 'left', disableColumnMenu: true },
        { field: 'dataHora', headerName: 'Data e Hora Criacao', type: 'dateTime', width: 300, headerAlign: 'left', disableColumnMenu: true },
        { field: 'denunciadopor', headerName: 'Denunciado Por', flex: 1, headerAlign: 'left', disableColumnMenu: true },
        { field: 'permitir', headerName: 'Permitir', width: 85, headerAlign: 'left', sortable: false, renderCell: (params) => (<AprovButton onclick={() => handleOpenConfirmarAprov(params.row)} />), disableColumnMenu: true },
        { field: 'remover', headerName: 'Remover', width: 85, headerAlign: 'left', sortable: false, renderCell: (params) => (<RejButton onclick={() => handleOpenRejeitarAprov(params.row)} />), disableColumnMenu: true },
        { field: 'ver', headerName: 'Ver', width: 85, headerAlign: 'left', sortable: false, renderCell: (params) => (<DetailButton onclick={() => handleVerClick(params.row.comentarioId)} />), disableColumnMenu: true },
    ];

    const fetchData = async () => {
        try {
            const token = sessionStorage.getItem('token');
            let poloid = sessionStorage.getItem('poloid');

            if (!poloid) {
                poloid = '';
            }

            const response = await axios.get(`${process.env.REACT_APP_API_URL}/denuncia/filtro`, {
                headers: {
                    Authorization: `${token}`
                },
                params: {
                    descricao: filtroText,
                    poloid: poloid
                }
            });
            const denuncias = response.data.data;

            const sortedDen = denuncias.sort((a, b) => a.denunciaid - b.denunciaid);

            const formattedData = sortedDen.map(denuncia => {
                return {
                    id: denuncia.denunciaid,
                    motivo: denuncia.texto,
                    dataHora: new Date(denuncia.datacriacao),
                    denunciadopor: denuncia.utilizadorcriou,
                    comentarioId: denuncia.comentarioid,
                    tipo: denuncia.tipo
                };
            });

            setTableRows(formattedData);
        } catch (error) {
            setError(error);
        }
    };

    const aprovarRegisto = async (id) => {
        try {
            const userid = sessionStorage.getItem('userid');
            const token = sessionStorage.getItem('token');
            const aprovacao = {
                utilizadormodera: userid
            };

            await axios.put(`${process.env.REACT_APP_API_URL}/denuncia/aprovar/${id}`, aprovacao, {
                headers: {
                    Authorization: `${token}`
                }
            });

            fetchData();
            setAlertProps({ title: 'Sucesso', label: `O comentário foi permitido com sucesso.`, severity: 'success' });
            setAlertOpen(true);
        } catch (error) {
            console.error('Erro ao aprovar registo:', error.message);
            setAlertProps({ title: 'Erro', label: `Ocorreu um erro ao permitir o comentário.`, severity: 'error' });
            setAlertOpen(true);
        }
    };

    const rejeitarRegisto = async (idDenuncia) => {
        try {
            const userid = sessionStorage.getItem('userid');
            const token = sessionStorage.getItem('token');
            const requestData = {
                utilizadormodera: userid,
                comentarioid: selectedRegisto.comentarioId
            };

            await axios.put(`${process.env.REACT_APP_API_URL}/denuncia/rejeitar/${idDenuncia}`, requestData, {
                headers: {
                    Authorization: `${token}`
                }
            });

            fetchData();
            setAlertProps({ title: 'Sucesso', label: 'O comentario foi rejeitado com sucesso.', severity: 'success' });
            setAlertOpen(true);
        } catch (error) {
            console.error('Erro ao rejeitar registo:', error.message);
            setAlertProps({ title: 'Erro', label: 'Ocorreu um erro ao rejeitar o comentario.', severity: 'error' });
            setAlertOpen(true);
        }
    };


    useEffect(() => {
        fetchData();
    }, [filtroText]);

    const handleVerClick = (comentarioId) => {
        setSelectedId(comentarioId);
        setNewModalOpen(true);
    };

    const handleOpenConfirmarAprov = (row) => {
        setSelectedRegisto({ id: row.id });
        setIsModalOpen1(true);
    };

    const handleOpenRejeitarAprov = (row) => {
        setSelectedRegisto({ id: row.id, comentarioId: row.comentarioId });
        setIsModalOpen2(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen1(false);
        setIsModalOpen2(false);
        setSelectedRegisto({ id: null });
    };

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="page-container">
            <Header caption='Denúncias' />
            <div className="data-container">
                <div style={{ marginBottom: '20px', paddingTop: '20px' }}>
                    <Search onchange={(e) => setFiltroText(e.target.value)} />
                </div>
                <div style={{ height: '65vh', width: '99%', overflowY: 'auto', paddingBottom: '40px', border: 'none', boxShadow: 'none' }}>
                    <DataTable rows={tableRows || []} columns={tableColumns} />
                </div>
            </div>
            <VerComentario open={isNewModalOpen} onClose={() => setNewModalOpen(false)} commentId={selectedId} />~
            {isModalOpen1 && (<ConfirmarDenuncia open={isModalOpen1} onClose={handleCloseModal} dados={selectedRegisto} onConfirm={aprovarRegisto} />)}
            {isModalOpen2 && (<RejeitarDebuncia open={isModalOpen2} onClose={handleCloseModal} dados={selectedRegisto} onConfirm={rejeitarRegisto} />)}
            <Alert open={alertOpen} setOpen={setAlertOpen} title={alertProps.title} label={alertProps.label} severity={alertProps.severity} />
        </div>
    );
}
