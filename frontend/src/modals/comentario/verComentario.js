import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import CommentsList from '../../components/comments/commentList';
import CancelButton from '../../components/buttons/cancelButton';
import axios from 'axios';
import ImageTable from '../../components/tables/imageTable';

const ReportCommentModal = ({ open, onClose, commentId }) => {
    const [poiData, setPoiData] = useState(null);
    const [reportedComment, setReportedComment] = useState(null);
    const [images, setImages] = useState([]);

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
                        fetchImages(transformedData.poi.poiId);
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
                        poiId: p.poiId, // Add POI ID for image fetching
                        titulo: p.titulo,
                        descricao: p.descricao,
                        utilizadorcriou: p.utilizador_nome
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

    const fetchImages = async (poiId) => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get(`http://localhost:8000/pontoInteresse/${poiId}/imagens`, {
                headers: { Authorization: `${token}` }
            });
            const imagesData = response.data.data;
            const transformedImages = await Promise.all(
                imagesData.map(async (image) => {
                    const base64String = await getBase64FromUrl(image.url);
                    return {
                        src: base64String,
                        alt: image.name,
                        size: image.size,
                    };
                })
            );
            setImages(transformedImages);
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    const getBase64FromUrl = async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const resetImage = async (index) => {
        setImages(prevImages => {
            const newImages = [...prevImages];
            newImages.splice(index, 1);
            return newImages;
        });
    };

    if (!poiData || !reportedComment) {
        return null;
    }

    return (
        <Modal open={open} onClose={onClose}>
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '1000px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px', overflow: 'auto' }}>
                <h2 style={{ marginTop: 0, color: 'white' }}>Ver Comentário</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 5, borderRadius: 12 }}>
                    <div style={{ display: 'flex' }}>
                        <div style={{ flex: 0.5 }}>
                            <h3>Título: {poiData.titulo}</h3>
                            <p>Descrição: {poiData.descricao}</p>
                        </div>
                    </div>
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
