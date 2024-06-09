import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import CommentsList from '../../components/comments/commentList';

const commentsData = [{
    author: 'User1',
    text: 'Este é um comentário.',
    reported: false,
    replies: [
        {
            author: 'Teste',
            text: 'Este é uma resposta.',
            reported: true
        },
    ],
}];

const ReportCommentModal = ({ open, onClose, commentId }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '1000px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px', overflow: 'auto' }}>
                <h2 style={{ marginTop: 0, color: 'white' }}>Ver Comentário</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12 }}>
                    <div>
                        <CommentsList commentsData={commentsData} />
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default ReportCommentModal;
