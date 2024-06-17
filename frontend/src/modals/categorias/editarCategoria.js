import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import BasicTextField from '../../components/textFields/basic';
import SubmitButton from '../../components/buttons/submitButton';
import CancelButton from '../../components/buttons/cancelButton';

const EditarCategoria = ({ open, onClose, categoriaId, setAlertOpen, setAlertProps }) => {
    //VARS
    //FIELDS
    const [descricao, setDescricaoPT] = useState('');
    const [descricaoENG, setDescricaoEN] = useState('');
    const [descricaoSPA, setDescricaoES] = useState('');
    const [inactivo, setInactivo] = useState(false);

    //ERRORS
    const [ptError, setPtError] = useState(false);
    const [engError, setEngError] = useState(false);
    const [esError, setEsError] = useState(false);

    useEffect(() => {
        if (categoriaId && open) {
            const fetchCategoria = async () => {
                try {
                    const token = sessionStorage.getItem('token');
                    const response = await axios.get(`http://localhost:8000/categoria/${categoriaId}`, {
                        headers: {
                            Authorization: `${token}`,
                        },
                    });
                    const categoria = response.data;

                    if (categoria) {
                        setDescricaoPT(categoria.valorpt || '');
                        setDescricaoEN(categoria.valoren || '');
                        setDescricaoES(categoria.valores || '');
                        setInactivo(categoria.inactivo || false);
                    }
                } catch (error) {
                    console.error('Erro ao buscar categoria:', error);
                }
            };

            if (categoriaId) {
                fetchCategoria();
            }
        }
    }, [categoriaId, open]);

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

    const handleUpdateEvent = async () => {
        const errors = validateForm();

        setPtError(errors.ptError || false);
        setEsError(errors.esError || false);
        setEngError(errors.engError || false);

        if (Object.keys(errors).length > 0) {
            return;
        }

        try {
            const token = sessionStorage.getItem('token');
            await axios.put(`http://localhost:8000/categoria/update/${categoriaId}`, {
                descricaoPT: descricao,
                descricaoEN: descricaoENG,
                descricaoES: descricaoSPA,
                inactivo
            }, {
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                }
            });

            console.log('Categoria Atualizada');
            onClose();
            setAlertProps({ title: 'Sucesso', label: `Categoria ${descricao} editado com sucesso.`, severity: 'success' });
                setAlertOpen(true);
        } catch (error) {
            console.error('Erro ao atualizar categoria:', error);
            setAlertProps({ title: 'Erro', label: `Ocorreu um erro ao editar a categoria.`, severity: 'error' });
            setAlertOpen(true);
        }
    };

    const handleChangeAtivo = (event) => {
        setInactivo(event.target.checked);
    };

    const handleCancel = () => {
        setPtError(false);
        setEsError(false);
        setEngError(false);
        onClose();
    };

    return (
        <Modal open={open} onClose={handleCancel} >
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px' }}>
                <h2 style={{ marginTop: 0, color: 'white' }}>Editar Categoria</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12 }}>
                    <div style={{ marginBottom: 25 }}>
                        <BasicTextField caption='Descrição Portugues' valor={descricao} onchange={(e) => setDescricaoPT(e.target.value)} fullwidth={true} type="text" error={ptError}
                            helperText={ptError ? "Introduza uma descrição válida" : ""} />
                    </div>
                    <div style={{ marginBottom: 25 }}>
                        <BasicTextField caption='Descrição Inglês' valor={descricaoENG} onchange={(e) => setDescricaoEN(e.target.value)} fullwidth={true} type="text" error={engError}
                            helperText={engError ? "Introduza uma descrição válida" : ""} />
                    </div>
                    <div style={{ marginBottom: 25 }}>
                        <BasicTextField caption='Descrição Espanhol' valor={descricaoSPA} onchange={(e) => setDescricaoES(e.target.value)} fullwidth={true} type="text" error={esError}
                            helperText={esError ? "Introduza uma descrição válida" : ""} />
                    </div>
                    <div style={{ marginBottom: 15 }}>
                        <FormControlLabel
                            control={<Switch checked={inactivo} onChange={handleChangeAtivo} />}
                            label="Inativo"
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        <CancelButton onclick={handleCancel} caption='Cancelar' />
                        <SubmitButton onclick={handleUpdateEvent} caption='Guardar' />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default EditarCategoria;
