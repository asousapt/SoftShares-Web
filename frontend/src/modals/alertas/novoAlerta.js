import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import BasicTextField from '../../components/textFields/basic';
import ComboBox from '../../components/combobox/comboboxBasic';
import SubmitButton from '../../components/buttons/submitButton';
import CancelButton from '../../components/buttons/cancelButton';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const NovoAlerta = ({ open, onClose, setAlertOpen, setAlertProps }) => {
    //VARS
    //FIELDS
    const [descricao, setDescricao] = useState('');
    const [polo, setPolo] = useState(null);
    const [opcoesPolo, setOpcoes] = useState([]);
    const [error, setError] = useState(null);
    const [isPoloDisabled, setIsPoloDisabled] = useState(false);

    //ERRORS
    const [descError, setDescError] = useState(false);
    const [poloError, setPoloError] = useState(false);

    const validateForm = () => {
        let errors = {};

        if (!descricao) {
            errors.descError = true;
        }

        if (!polo) {
            errors.poloError = true;
        }

        return errors;
    };

    const fetchPolos = async () => {
        try {
            const token = sessionStorage.getItem('token');

            const response = await axios.get('http://localhost:8000/polo', {
                headers: {
                    Authorization: `${token}`
                }
            });
            const polos = response.data.data;

            setOpcoes(polos.map((polo) => ({
                value: polo.poloid,
                label: polo.descricao,
            })));
        } catch (error) {
            setError(error);
        }
    }

    useEffect(() => {
        fetchPolos();

        const perfil = sessionStorage.getItem('perfil');
        if (perfil === 'Admin') {
            setIsPoloDisabled(true);
            const poloid = sessionStorage.getItem('poloid');
            const descpolo = sessionStorage.getItem('descpolo');
            setPolo({ value: poloid, label: descpolo });
        } else {
            setIsPoloDisabled(false);
        }

    }, [open]);

    const handleAddEvent = async () => {
        const errors = validateForm();

        setDescError(errors.descError || false);
        setPoloError(errors.poloError || false);

        if (Object.keys(errors).length > 0) {
            return;
        }

        try {
            const userid = sessionStorage.getItem('userid');
            const token = sessionStorage.getItem('token');

            const novoAlerta = {
                utilizadorID: userid,
                texto: descricao,
                poloID: polo ? polo.value : '',
            };

            await axios.post('http://localhost:8000/alerta/add', novoAlerta, {
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                }
            });
            onClose();
            setAlertProps({ title: 'Sucesso', label: `Alerta criado com sucesso.`, severity: 'success' });
            setAlertOpen(true);
            resetForm();
        } catch (error) {
            console.error('Erro ao adicionar alerta:', error);
            setAlertProps({ title: 'Erro', label: `Ocorreu um erro ao criar o alerta.`, severity: 'error' });
            setAlertOpen(true);
        }
    };

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const resetForm = () => {
        setDescricao('');
        setPolo('');
    };

    const handleCancel = () => {
        resetForm();
        setDescError(false);
        setPoloError(false);
        onClose();
    };

    return (
        <Modal open={open} onClose={handleCancel} >
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px' }}>
                <h2 style={{ marginTop: 0, color: 'white' }}>Novo Alerta</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12 }}>
                    <div style={{ marginBottom: 15 }}>
                        <div style={{ display: 'flex', marginBottom: 20 }}>
                            <div style={{ width: '75%' }}>
                                <Autocomplete options={opcoesPolo} getOptionLabel={(option) => option.label} renderInput={(params) => (
                                    <TextField {...params} label="Polo" variant="outlined" type="text" error={poloError} helperText={poloError ? "Escolha um Polo" : ""} />
                                )}
                                    value={polo}
                                    onChange={(event, newValue) => { setPolo(newValue); }}
                                    fullWidth={true}
                                    disabled={isPoloDisabled}
                                />
                            </div>
                        </div>
                        <BasicTextField caption='Descrição' valor={descricao} onchange={(e) => setDescricao(e.target.value)} fullwidth={true} type="text" error={descError}
                            helperText={descError ? "Introduza uma descrição válida" : ""} />
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

export default NovoAlerta;
