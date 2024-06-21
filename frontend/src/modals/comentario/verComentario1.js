import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import CommentsList from '../../components/comments/commentList1';
import axios from 'axios';

const ReportCommentModal = ({ open, onClose, commentId }) => {
    const [poiData, setPoiData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (open) {
            const fetchComments = async () => {
                setLoading(true);
                setError(null);
                try {
                    const token = sessionStorage.getItem('token');
                    const response = await axios.get(`http://localhost:8000/comentario`, {
                        headers: { Authorization: `${token}` }
                    });

                    const data = response.data.data;
                    console.log(data);

                    // Find the point of interest and comments related to the provided commentId
                    const poi = data.find(poi => poi.comentarios.some(comment => comment.comentarioid === 3));

                    if (poi) {
                        // Process comments and their replies
                        const commentsMap = {};
                        poi.comentarios.forEach(comment => {
                            commentsMap[comment.comentarioid] = {
                                ...comment,
                                respostas: []
                            };
                        });

                        // Nesting replies
                        poi.comentarios.forEach(comment => {
                            comment.respostas.forEach(reply => {
                                commentsMap[reply.comentarioid] = {
                                    ...reply,
                                    respostas: []
                                };
                                if (commentsMap[comment.comentarioid]) {
                                    commentsMap[comment.comentarioid].respostas.push(commentsMap[reply.comentarioid]);
                                }
                            });
                        });

                        // Filtering root comments
                        const rootComments = Object.values(commentsMap).filter(comment => comment.tipo === "POI");

                        setPoiData({ ...poi, comentarios: rootComments });
                    } else {
                        setError('Ponto de interesse não encontrado.');
                    }
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchComments();
        }
    }, [open, commentId]);

    return (
        <Modal open={open} onClose={onClose}>
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '1000px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px', overflow: 'auto' }}>
                <h2 style={{ marginTop: 0, color: 'white' }}>Ver Comentário</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12 }}>
                    {loading && <p>Loading comments...</p>}
                    {error && <p>Error: {error}</p>}
                    {!loading && !error && poiData && (
                        <>
                            <h3>{poiData.titulo}</h3>
                            <p>{poiData.descricao}</p>
                            <p>{poiData.utilizadorcriou}</p>
                            <CommentsList commentsData={poiData.comentarios} />
                        </>
                    )}
                </div>
            </div>
        </Modal>
    );
}

export default ReportCommentModal;
