import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import CommentsList from '../../components/comments/commentList1';
import axios from 'axios';

const ReportCommentModal = ({ open, onClose, commentId }) => {
    const [commentsData, setCommentsData] = useState([]);
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

                    // Process comments and their replies
                    const commentsMap = {};
                    data.forEach(poi => {
                        poi.comentarios.forEach(comment => {
                            if (!commentsMap[comment.comentarioid]) {
                                commentsMap[comment.comentarioid] = {
                                    ...comment,
                                    respostas: []
                                };
                            }
                        });
                    });

                    // Nesting replies
                    data.forEach(poi => {
                        poi.comentarios.forEach(comment => {
                            comment.respostas.forEach(reply => {
                                if (commentsMap[reply.comentariopaiid]) {
                                    commentsMap[reply.comentariopaiid].respostas.push(commentsMap[reply.respostaid]);
                                }
                            });
                        });
                    });

                    // Filtering root comments
                    const rootComments = Object.values(commentsMap).filter(comment => comment.tipo === "POI");

                    setCommentsData(rootComments);
                    console.log(rootComments);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchComments();
        }
    }, [open]);

    return (
        <Modal open={open} onClose={onClose}>
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '1000px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px', overflow: 'auto' }}>
                <h2 style={{ marginTop: 0, color: 'white' }}>Ver Comentário</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12 }}>
                    {loading && <p>Loading comments...</p>}
                    {error && <p>Error: {error}</p>}
                    {!loading && !error && (
                        <CommentsList commentsData={commentsData} />
                    )}
                </div>
            </div>
        </Modal>
    );
}

export default ReportCommentModal;
