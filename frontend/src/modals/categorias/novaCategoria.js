import React, { useState } from 'react';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import BasicTextField from '../../components/textFields/basic';
import SubmitButton from '../../components/buttons/submitButton';
import CancelButton from '../../components/buttons/cancelButton';

const NovaCategoria = ({ open, onClose, setAlertOpen, setAlertProps }) => {
    //VARS
    //FIELDS
    const [descricao, setDescricao] = useState('');
    const [descricaoENG, setDescricaoENG] = useState('');
    const [descricaoSPA, setDescricaoSPA] = useState('');

    //ERRORS
    const [ptError, setPtError] = useState(false);
    const [engError, setEngError] = useState(false);
    const [esError, setEsError] = useState(false);

    const validateForm = () => {
        let errors = {};

        if (!descricao) {
            errors.ptError = true;
        }

        if (!descricaoENG) {
            errors.engError = true;
        }

        if (!descricaoSPA) {
            errors.esError = true;
        }

        return errors;
    };

    const handleAddEvent = async () => {
        const errors = validateForm();

        setPtError(errors.ptError || false);
        setEsError(errors.esError || false);
        setEngError(errors.engError || false);

        if (Object.keys(errors).length > 0) {
            return;
        }

        try {
            const token = sessionStorage.getItem('token');
            await axios.post(`${process.env.REACT_APP_API_URL}/categoria/add`, {
                descricaoPT: descricao,
                descricaoEN: descricaoENG,
                descricaoES: descricaoSPA
            }, {
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                }
            });
            
            onClose();
            setAlertProps({ title: 'Sucesso', label: `Categoria criada com sucesso.`, severity: 'success' });
            setAlertOpen(true);
            resetForm();
        } catch (error) {
            console.error('Erro ao adicionar categoria:', error);
            setAlertProps({ title: 'Erro', label: `Ocorreu um erro ao criar a categoria.`, severity: 'error' });
            setAlertOpen(true);
        }
    };

    const resetForm = () => {
        setDescricao('');
        setDescricaoENG('');
        setDescricaoSPA('');
    };

    const handleCancel = () => {
        resetForm();
        setPtError(false);
        setEsError(false);
        setEngError(false);
        onClose();
    };

    return (
        <Modal open={open} onClose={handleCancel} >
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px' }}>
                <h2 style={{ marginTop: 0, color: 'white' }}>Nova Categoria</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12 }}>
                    <div style={{ marginBottom: 25 }}>
                        <BasicTextField caption='Descrição Portugues' valor={descricao} onchange={(e) => setDescricao(e.target.value)} fullwidth={true} type="text" error={ptError}
                            helperText={ptError ? "Introduza uma descrição válida" : ""} allowOnlyLetters={true}/>
                    </div>
                    <div style={{ marginBottom: 25 }}>
                        <BasicTextField caption='Descrição Inglês' valor={descricaoENG} onchange={(e) => setDescricaoENG(e.target.value)} fullwidth={true} type="text" error={engError}
                            helperText={engError ? "Introduza uma descrição válida" : ""} allowOnlyLetters={true}/>
                    </div>
                    <div style={{ marginBottom: 25 }}>
                        <BasicTextField caption='Descrição Espanhol' valor={descricaoSPA} onchange={(e) => setDescricaoSPA(e.target.value)} fullwidth={true} type="text" error={esError}
                            helperText={esError ? "Introduza uma descrição válida" : ""} allowOnlyLetters={true}/>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        <CancelButton onclick={handleCancel} caption='Cancelar' />
                        <SubmitButton onclick={handleAddEvent} caption='Guardar' />
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default NovaCategoria;
