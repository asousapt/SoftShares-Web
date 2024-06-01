import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import BasicTextField from '../../components/textFields/basic';
import SubmitButton from '../../components/buttons/submitButton';
import CancelButton from '../../components/buttons/cancelButton';
import axios from 'axios';

const NovaFuncao = ({ open, onClose }) => {
    const [descricaoPT, setDescricaoPT] = useState('');
    const [descricaoEN, setDescricaoEN] = useState('');
    const [descricaoES, setDescricaoES] = useState('');

    const handleAddEvent = async () => {
        try {
            const token = 'tokenFixo';
            const response = await axios.post('http://localhost:8000/funcao/add', {
                descricaoPT,
                descricaoEN,
                descricaoES
            }, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.status === 201) {
                console.log('Departamento adicionado com sucesso');
                onClose(); 
            }
        } catch (error) {
            console.error('Erro ao adicionar departamento:', error);
        }
    };
        return (
            <Modal open={open} onClose={onClose}>
                <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px' }}>
                    <h2 style={{marginTop: 0, color: 'white'}}>Nova Funcao</h2>
                    <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12 }}>
                        <div style={{ marginBottom: 15 }}>
                            <BasicTextField caption='Descrição Português' valor={descricaoPT} onchange={(e) => setDescricaoPT(e.target.value)} fullwidth={true} />
                        </div>
                        <div style={{ marginBottom: 15 }}>
                            <BasicTextField caption='Descrição Inglês' valor={descricaoEN} onchange={(e) => setDescricaoEN(e.target.value)} fullwidth={true} />
                        </div>
                        <div style={{ marginBottom: 15 }}>
                            <BasicTextField caption='Descrição Espanhol' valor={descricaoES} onchange={(e) => setDescricaoES(e.target.value)} fullwidth={true} />
                        </div>
                        <div style={{display: 'flex', justifyContent: 'center', gap: '20px'}}>
                            <CancelButton onclick={() => { onClose(); }} caption='Cancelar' />
                            <SubmitButton onclick={handleAddEvent} caption='Guardar' />
                        </div>
                    </div>
                </div>
            </Modal>
        );
    };
export default NovaFuncao;
