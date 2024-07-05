import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import CommentsList from '../../components/comments/commentList';
import BasicTextField from '../../components/textFields/basic';
import CancelButton from '../../components/buttons/cancelButton';
import axios from 'axios';

const ReportCommentModal = ({ open, onClose, commentId }) => {
    const [poiData, setPoiData] = useState(null);
    const [reportedComment, setReportedComment] = useState(null);
    const [titulo, setTitle] = useState('');
    const [tipo, setTipo] = useState('');

    useEffect(() => {
        if (open) {
            const fetchData = async () => {
                try {
                    const token = sessionStorage.getItem('token');
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/comentario`, {
                        headers: { Authorization: `${token}` }
                    });
                    const coments = response.data.data;
                    
                    if (response.data) {
                        const transformedData = transformCommentsData(coments, commentId);
                        
                        setPoiData(transformedData.poi);
                        setReportedComment(transformedData.reportedComment);
                        setTitle(transformedData.poi.titulo);
                        if (transformedData.poi.tipo === 'POI')
                        {
                            setTipo('Ponto de Interesse');
                        }
                        else if (transformedData.poi.tipo === 'THREAD')
                        {
                            setTipo('Publicação');
                        }
                        
                    }
                } catch (error) {
                    console.error('Error fetching comments data:', error);
                }
            };

            fetchData();
        }
    }, [open, commentId]);

    const transformCommentsData = (data, commentId) => {
        let poi = null;
        let reportedComment = null;

        for (const p of data) {
            for (const comment of p.comentarios) {
                if (reportedComment) break;
                const result = findAndTransformComment(comment, commentId);
                if (result) {
                    poi = {
                        titulo: p.titulo,
                        tipo: p.tipo
                    };
                    reportedComment = result;
                }
            }
            if (reportedComment) break;
        }

        return { poi, reportedComment };
    };

    const findAndTransformComment = (comment, commentId) => {
        if (comment.comentarioid === commentId) {
            return transformComment(comment, true, commentId);
        }

        for (const reply of comment.respostas) {
            const result = findAndTransformComment(reply, commentId);
            if (result) {
                return transformComment(comment, false, commentId);
            }
        }

        return null;
    };

    const transformComment = (comment, isReported = false, reportedCommentId = null) => {
        return {
            comentarioid: comment.comentarioid,
            author: comment.utilizador_nome,
            text: comment.comentario,
            reported: isReported,
            replies: comment.respostas.map(reply => transformComment(reply, reply.comentarioid === reportedCommentId, reportedCommentId))
        };
    };

    if (!poiData || !reportedComment) {
        return null;
    }

    return (
        <Modal open={open} onClose={onClose}>
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '1000px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px', overflow: 'auto' }}>
                <h2 style={{ marginTop: 0, color: 'white' }}>Ver Comentário</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12 }}>
                    <div style={{ marginBottom: 15 }}>
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                            <div style={{ width: '50%' }}>
                                <BasicTextField caption='Tipo' valor={tipo} onchange={(e) => setTipo(e.target.value)} fullwidth={true} disabled={true} />
                            </div>
                            <div style={{ width: '49.4%' }}>
                                <BasicTextField caption='Titulo' valor={titulo} onchange={(e) => setTitle(e.target.value)} fullwidth={true} disabled={true} />
                            </div>
                        </div>
                    </div>
                    <div style={{ marginBottom: 20 }}></div>
                    <h3>Comentários:</h3>
                    <CommentsList commentsData={[reportedComment]} />
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <CancelButton onclick={() => { onClose(); }} caption='Voltar' />
                    </div>
                </div>
            </div>
        </Modal>

    );
};

export default ReportCommentModal;
