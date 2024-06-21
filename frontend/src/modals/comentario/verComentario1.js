import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import CommentsList from '../../components/comments/commentList';
import axios from 'axios';

const ReportCommentModal = ({ open, onClose, commentId }) => {
    const [poiData, setPoiData] = useState(null);
    const [reportedComment, setReportedComment] = useState(null);

    useEffect(() => {
        if (open) {
            const fetchData = async () => {
                try {
                    const token = sessionStorage.getItem('token');
                    const response = await axios.get('http://localhost:8000/comentario', {
                        headers: { Authorization: `${token}` }
                    });

                    if (response.data && response.data.data) {
                        const transformedData = transformCommentsData(response.data.data, commentId);
                        setPoiData(transformedData.poi);
                        setReportedComment(transformedData.reportedComment);
                    }
                } catch (error) {
                    console.error('Error fetching comments data:', error);
                }
            };

            fetchData();
        }
    }, [open, commentId]);

    const transformCommentsData = (data, commentId) => {
        console.log("Transforming comments data...");
        let poi = null;
        let reportedComment = null;

        for (const p of data) {
            for (const comment of p.comentarios) {
                const result = findAndTransformComment(comment, commentId);
                if (result) {
                    poi = {
                        titulo: p.titulo,
                        descricao: p.descricao,
                        utilizadorcriou: p.utilizador_nome
                    };
                    reportedComment = result;
                    break;
                }
            }
            if (reportedComment) break;
        }

        console.log("POI:", poi);
        console.log("Reported Comment:", reportedComment);

        return { poi, reportedComment };
    };

    const findAndTransformComment = (comment, commentId) => {
        console.log("Finding comment:", comment.comentarioid, "Target:", commentId);
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
        console.log("Transforming comment:", comment.comentarioid, "Is reported:", isReported);
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
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 5, borderRadius: 12 }}>
                    <div>
                        <h3>Título: {poiData.titulo}</h3>
                        <p>Descrição: {poiData.descricao}</p>
                        <p>Comentários:</p>
                        <CommentsList commentsData={[reportedComment]} />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ReportCommentModal;
