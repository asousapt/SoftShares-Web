import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import BasicTextField from '../../components/textFields/basic';
import SubmitButton from '../../components/buttons/submitButton';
import CancelButton from '../../components/buttons/cancelButton';
import axios from 'axios';

const EditFuncao = ({ open, onClose, funcaoId, setAlertOpen, setAlertProps  }) => {
    //VARS
    //FIELDS
    const [descricaoPT, setDescricaoPT] = useState('');
    const [descricaoEN, setDescricaoEN] = useState('');
    const [descricaoES, setDescricaoES] = useState('');
    const [inactivo, setInactivo] = useState(false);

    //ERRORS
    const [ptError, setPtError] = useState(false);
    const [engError, setEngError] = useState(false);
    const [esError, setEsError] = useState(false);

    useEffect(() => {
        if (funcaoId && open) {
            const fetchFuncao = async () => {
                try {
                    const token = sessionStorage.getItem('token');
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/funcao/${funcaoId}`, {
                        headers: {
                            Authorization: `${token}`
                        }
                    });
                    const funcao = response.data;

                    if (funcao) {
                        setDescricaoPT(funcao.valorpt || '');
                        setDescricaoEN(funcao.valoren || '');
                        setDescricaoES(funcao.valores || '');
                        setInactivo(funcao.inactivo || false);
                    }
                } catch (error) {
                    console.error('Erro ao carregar função:', error);
                }
            };
    
            fetchFuncao();
        }
    }, [funcaoId, open]);

    const validateForm = () => {
        let errors = {};

        if (!descricaoPT) {
            errors.ptError = true;
        }

        if (!descricaoEN) {
            errors.engError = true;
        }

        if (!descricaoES) {
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
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/funcao/update/${funcaoId}`, {
                descricaoPT: descricaoPT,
                descricaoEN: descricaoEN,
                descricaoES: descricaoES,
                inactivo
            }, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            if (response.status === 200) {
                onClose();
                setAlertProps({ title: 'Sucesso', label: `Função ${descricaoPT} editada com sucesso.`, severity: 'success' });
                setAlertOpen(true);
            }
        } catch (error) {
            console.error('Erro ao atualizar função:', error);
            setAlertProps({ title: 'Erro', label: `Ocorreu um erro ao editar o departamento.`, severity: 'error' });
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
        <Modal open={open} onClose={handleCancel}>
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px' }}>
                <h2 style={{marginTop: 0, color: 'white'}}>Editar Função</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12 }}>
                    <div style={{ marginBottom: 15 }}>
                        <BasicTextField caption='Descrição Português' valor={descricaoPT} onchange={(e) => setDescricaoPT(e.target.value)} fullwidth={true} type="text" error={ptError}
                            helperText={ptError ? "Introduza uma descrição válida" : ""} allowOnlyLetters={true}/>
                    </div>
                    <div style={{ marginBottom: 15 }}>
                        <BasicTextField caption='Descrição Inglês' valor={descricaoEN} onchange={(e) => setDescricaoEN(e.target.value)} fullwidth={true} type="text" error={engError}
                            helperText={engError ? "Introduza uma descrição válida" : ""} allowOnlyLetters={true}/>
                    </div>
                    <div style={{ marginBottom: 15 }}>
                        <BasicTextField caption='Descrição Espanhol' valor={descricaoES} onchange={(e) => setDescricaoES(e.target.value)} fullwidth={true} type="text" error={esError}
                            helperText={esError ? "Introduza uma descrição válida" : ""} allowOnlyLetters={true}/>
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

export default EditFuncao;
