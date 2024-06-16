import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './page.css';
/* COMPONENTES */
import DataTable from '../components/tables/dataTable';
import DetailButton from '../components/buttons/detailButton';
import AprovButton from '../components/buttons/aproveButton';
import RejButton from '../components/buttons/rejectButton';
import AddButton from '../components/buttons/addButton';
import Header from '../components/header/header';
import Search from '../components/textFields/search';
/* FIM COMPONENTES */
import VerComentario from '../modals/comentario/verComentario';

export default function ModDen() {
    const [isNewModalOpen, setNewModalOpen] = useState(false);
    const [filtroText, setFiltroText] = useState('');
    const [tableRows, setTableRows] = useState([]);
    const [error, setError] = useState(null);

    const tableColumns = [
        { field: 'id', headerName: 'ID', width: 100, headerAlign: 'left' },
        { field: 'motivo', headerName: 'Motivo', flex: 1, headerAlign: 'left' },
        { field: 'dataHora', headerName: 'Data e Hora Criacao', type: 'dateTime', width: 300, headerAlign: 'left' },
        { field: 'criadoPor', headerName: 'Criado por', flex: 1, headerAlign: 'left' },
        { field: 'denunciadopor', headerName: 'Denunciado Por', flex: 1, headerAlign: 'left' },
        { field: 'permitir', headerName: 'Permitir', width: 85, headerAlign: 'left', sortable: false , renderCell: (row) => ( <AprovButton /*onclick={} id={row.id}*/ />)},
        { field: 'remover', headerName: 'Remover', width: 85, headerAlign: 'left', sortable: false , renderCell: (row) => ( <RejButton /*onclick={} id={row.id}*/ />)},
        { field: 'ver', headerName: 'Ver', width: 85, headerAlign: 'left', sortable: false , renderCell: (row) => ( <DetailButton onclick={() => setNewModalOpen(true)} /*id={row.id}*/ />)},
    ];

    const fetchData = async () => {
        try {
            const token = sessionStorage.getItem('token');

            const response = await axios.get('http://localhost:8000/denuncia/filtro', {
                headers: {
                    Authorization: `${token}`
                },
                params: {
                    descricao: filtroText
                }
            });
            const denuncias = response.data.data;

            const sortedDen = denuncias.sort((a, b) => a.denunciaid - b.denunciaid);

            const formattedData = sortedDen.map(denuncia => ({
                id: denuncia.denunciaid,
                motivo: denuncia.texto,
                dataHora: new Date(denuncia.datacriacao),
                criadoPor: denuncia.utilizadorcriou,
                denunciadopor: denuncia.utilizadordenunciado
            }));

            setTableRows(formattedData);
        } catch (error) {
            setError(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filtroText]);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return(
        <div className="page-container">
            <Header caption='Denúncias' />
            <div className="data-container">
                <div style={{marginBottom:'20px', paddingTop: '20px'}}>
                    <Search onchange={(e) => setFiltroText(e.target.value)} /> 
                    <AddButton caption='Adicionar' onclick={() => setNewModalOpen(true)} /> {/*so para teste */}
                </div>
                <div style={{ height: '65vh', width: '99%', overflowY: 'auto', paddingBottom: '40px',border: 'none', boxShadow: 'none'}}>
                    <DataTable rows={tableRows || []} columns={tableColumns}/>
                </div>
            </div>
            <VerComentario open={isNewModalOpen} onClose={() => setNewModalOpen(false)}/>
        </div>
    )
}
