import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import BasicTextField from '../../components/textFields/basic';
import SubmitButton from '../../components/buttons/submitButton';
import CancelButton from '../../components/buttons/cancelButton';
import axios from 'axios';

const EditDepartamento = ({ open, onClose, departamentoId, setAlertOpen, setAlertProps }) => {
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
        if (departamentoId && open) {
            const fetchData = async () => {
                try {
                    const token = sessionStorage.getItem('token');
                    const response = await axios.get(`http://localhost:8000/departamento/${departamentoId}`, {
                        headers: {
                            Authorization: `${token}`
                        }
                    });
                    const departamento = response.data;

                    console.log('Dados recebidos:', departamento);

                    if (departamento) {
                        setDescricaoPT(departamento.valorpt || '');
                        setDescricaoEN(departamento.valoren || '');
                        setDescricaoES(departamento.valores || '');
                        setInactivo(departamento.inactivo || false);
                    }
                } catch (error) {
                    console.error('Erro ao carregar departamento:', error);
                }
            };

            fetchData();
        }
    }, [departamentoId, open]);

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
            const response = await axios.put(`http://localhost:8000/departamento/update/${departamentoId}`, {
                valorpt: descricaoPT,
                valoren: descricaoEN,
                valores: descricaoES,
                inactivo
            }, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                console.log('Departamento atualizado com sucesso');
                setAlertProps({ title: 'Sucesso', label: `Departamento ${descricaoPT} editado com sucesso.`, severity: 'success' });
                setAlertOpen(true);
                onClose();
            }
        } catch (error) {
            console.error('Erro ao atualizar departamento:', error);
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
                <h2 style={{marginTop: 0, color: 'white'}}>Editar Departamento</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12 }}>
                    <div style={{ marginBottom: 15 }}>
                        <BasicTextField caption='Descrição Português' valor={descricaoPT} onchange={(e) => setDescricaoPT(e.target.value)} fullwidth={true} type="text" error={ptError}
                            helperText={ptError ? "Introduza uma descrição válida" : ""} />
                    </div>
                    <div style={{ marginBottom: 15 }}>
                        <BasicTextField caption='Descrição Inglês' valor={descricaoEN} onchange={(e) => setDescricaoEN(e.target.value)} fullwidth={true} type="text" error={engError}
                            helperText={engError ? "Introduza uma descrição válida" : ""} />
                    </div>
                    <div style={{ marginBottom: 15 }}>
                        <BasicTextField caption='Descrição Espanhol' valor={descricaoES} onchange={(e) => setDescricaoES(e.target.value)} fullwidth={true} type="text" error={esError}
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

export default EditDepartamento;
