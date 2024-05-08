import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import BasicTextField from '../components/textFields/basic';
import SubmitButton from '../components/buttons/submitButton';
import CancelButton from '../components/buttons/cancelButton';

const AddPubModal = ({ open, onClose }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleAddEvent = () => {
        console.log('Adding event:', { title, description });
        onClose(); 
    };
    
    const handleCancel = () => {
        onClose(); 
    };
    
    return(
        <Modal open={open} onClose={onClose}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
                <h2 id="add-event-modal-title">Adicionar Publicação</h2>
                <BasicTextField caption='Nome' valor={title} onchange={(e) => setTitle(e.target.value)}/>
                <BasicTextField caption='Descrição' valor={description} onchange={(e) => setDescription(e.target.value)}/>
                <CancelButton onclick={handleCancel} caption='Cancelar' />
                <SubmitButton onclick={handleAddEvent} caption='Adicionar Publicação' />
            </div>
        </Modal>
    );
}

export default AddPubModal;
