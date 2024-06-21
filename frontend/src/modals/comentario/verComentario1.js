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

                    console.log('Comments data:', response.data);

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
        for (let poi of data) {
            for (let comment of poi.comentarios) {
                if (comment.comentarioid === commentId) {
                    return {
                        poi: {
                            titulo: poi.titulo,
                            descricao: poi.descricao,
                            utilizadorcriou: poi.utilizador_nome // Use utilizador_nome to get the creator's name
                        },
                        reportedComment: transformComment(comment, true) // Mark only the reported comment
                    };
                }
                const result = findCommentInReplies(comment, commentId, poi);
                if (result) {
                    return result;
                }
            }
        }
        return { poi: null, reportedComment: null };
    };

    const findCommentInReplies = (comment, commentId, poi) => {
        for (let reply of comment.respostas) {
            if (reply.comentarioid === commentId) {
                return {
                    poi: {
                        titulo: poi.titulo,
                        descricao: poi.descricao,
                        utilizadorcriou: poi.utilizador_nome // Use utilizador_nome to get the creator's name
                    },
                    reportedComment: transformComment(comment) // Include the parent comment as well
                };
            }
            const foundComment = findCommentInReplies(reply, commentId, poi);
            if (foundComment) {
                return foundComment;
            }
        }
        return null;
    };

    const transformComment = (comment, isReported = false) => {
        return {
            author: comment.utilizador_nome, // Correctly assign the author's name
            text: comment.comentario,
            reported: isReported, // Mark this comment as reported only if it's the target comment
            replies: comment.respostas.map(reply => transformComment(reply, reply.comentarioid === commentId)) // Replies should only be marked if they are the reported comment
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
                        <p>Descrição:</p>
                        <p>{poiData.descricao}</p>
                        {/* <p>Autor: {poiData.utilizadorcriou}</p> */}
                        <p>Comentários:</p>
                        <CommentsList commentsData={[reportedComment]} />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ReportCommentModal;
