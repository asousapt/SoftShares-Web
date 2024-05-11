import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import BasicTextField from '../components/textFields/basic';
import SubmitButton from '../components/buttons/submitButton';
import CancelButton from '../components/buttons/cancelButton';

const AddPontoIntModal = ({ open, onClose }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleAddEvent = () => {
        console.log('Adding event:', { title, description });
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px' }}>
                <h2 style={{ marginTop: 0, color: 'white' }}>Adicionar Ponto Interesse</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12 }}>
                    <div style={{ marginBottom: 15 }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <BasicTextField caption='Nome' valor={title} onchange={(e) => setTitle(e.target.value)} />
                            <BasicTextField caption='Descrição' valor={description} onchange={(e) => setDescription(e.target.value)} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        <CancelButton onclick={() => { onClose(); }} caption='Cancelar' />
                        <SubmitButton onclick={handleAddEvent} caption='Guardar' />
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default AddPontoIntModal;
