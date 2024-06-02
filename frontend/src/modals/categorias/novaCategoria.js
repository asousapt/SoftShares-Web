import React, { useState } from 'react';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import BasicTextField from '../../components/textFields/basic';
import SubmitButton from '../../components/buttons/submitButton';
import CancelButton from '../../components/buttons/cancelButton';

const NovaCategoria = ({ open, onClose }) => {
    const [descricao, setDescricao] = useState('');
    const [descricaoENG, setDescricaoENG] = useState('');
    const [descricaoSPA, setDescricaoSPA] = useState('');

    const handleAddEvent = async () => {
        if (!descricao.trim() || !descricaoENG.trim() || !descricaoSPA.trim()){
            alert('Preencha todos os campos!');
            return;
        }

        try {
            const token = 'tokenFixo';
            await axios.post('http://localhost:8000/categoria/add', {
                descricaoPT: descricao,
                descricaoEN: descricaoENG,
                descricaoES: descricaoSPA
            }, {
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                }
            });

            console.log('Categoria Adicionada');
            onClose();
        } catch (error) {
            console.error('Erro ao adicionar categoria:', error);
        }
    };
    
    return (
        <Modal open={open} onClose={onClose} >
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px' }}>
                <h2 style={{marginTop: 0, color: 'white'}}>Nova Categoria</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12 }}>
                    <div style={{ marginBottom: 25 }}>
                        <BasicTextField caption='Descrição Portugues' valor={descricao} onchange={(e) => setDescricao(e.target.value)} fullwidth={true} />
                        <div style={{ marginBottom: 25 }}></div>
                        <BasicTextField caption='Descrição Inglês' valor={descricaoENG} onchange={(e) => setDescricaoENG(e.target.value)} fullwidth={true} />
                        <div style={{ marginBottom: 25 }}></div>
                        <BasicTextField caption='Descrição Espanhol' valor={descricaoSPA} onchange={(e) => setDescricaoSPA(e.target.value)} fullwidth={true} />
                        <div style={{ marginBottom: 25 }}></div>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center', gap: '20px'}}>
                        <CancelButton onclick={() => { onClose(); }} caption='Cancelar' />
                        <SubmitButton onclick={handleAddEvent} caption='Guardar' />
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default NovaCategoria;
