import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import BasicTextField from '../../components/textFields/basic';
import ComboBox from '../../components/combobox/comboboxBasic';
import SubmitButton from '../../components/buttons/submitButton';
import CancelButton from '../../components/buttons/cancelButton';
import axios from 'axios';

const NovaSubcategoria = ({ open, onClose, setAlertOpen, setAlertProps }) => {
    //VARS
    //FIELDS
    const [descricaoPT, setDescricaoPT] = useState('');
    const [categoria, setCategoria] = useState('');
    const [descricaoEN, setDescricaoEN] = useState('');
    const [descricaoES, setDescricaoES] = useState('');
    const [categories, setCategories] = useState([]);

    //ERRORS
    const [ptError, setPtError] = useState(false);
    const [engError, setEngError] = useState(false);
    const [esError, setEsError] = useState(false);
    const [catError, setCatError] = useState(false);

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

        if (!categoria) {
            errors.catError = true;
        }

        return errors;
    };

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/categoria`, {
                    headers: {
                        Authorization: `${token}`
                    }
                });
                const categorias = response.data;
                setCategories(categorias.map(cat => ({ value: cat.categoriaid, label: cat.valorpt })));
            } catch (error) {
                console.error("Erro ao encontrar a categoria", error);
            }
        };

        fetchCategorias();
    }, []);

    const handleAddEvent = async () => {
        const errors = validateForm();

        setPtError(errors.ptError || false);
        setEsError(errors.esError || false);
        setEngError(errors.engError || false);
        setCatError(errors.catError || false);

        if (Object.keys(errors).length > 0) {
            return;
        }

        try {
            const token = sessionStorage.getItem('token');
            await axios.post(`${process.env.REACT_APP_API_URL}/subcategoria/add`, {
                categoriaID: categoria,
                descricaoPT: descricaoPT,
                descricaoEN: descricaoEN,
                descricaoES: descricaoES,
            }, {
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                }
            });
            onClose();
            setAlertProps({ title: 'Sucesso', label: `Subcategoria criada com sucesso.`, severity: 'success' });
            setAlertOpen(true);
            resetForm();
        } catch (error) {
            console.error("Erro ao adicionar a subcategoria", error);
            setAlertProps({ title: 'Erro', label: `Ocorreu um erro ao criar a subcategoria.`, severity: 'error' });
            setAlertOpen(true);
        }
    };

    const resetForm = () => {
        setDescricaoEN('');
        setDescricaoES('');
        setDescricaoPT('');
        setCategoria('');
    };

    const handleCancel = () => {
        resetForm();
        setPtError(false);
        setEsError(false);
        setEngError(false);
        setCatError(false);
        onClose();
    };

    return (
        <Modal open={open} onClose={handleCancel}>
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px' }}>
                <h2 style={{ marginTop: 0, color: 'white' }}>Nova Subcategoria</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12 }}>
                    <div style={{ marginBottom: 15 }}>
                        <div style={{ display: 'flex', marginBottom: 20 }}>
                            <div style={{ width: '75%' }}>
                                <ComboBox caption='Categoria' options={categories} value={categoria} handleChange={(e) => { setCategoria(e.target.value); setCatError(false); }} error={catError}
                                    helperText={catError ? "Selecione uma subcategoria" : ""} />
                            </div>
                        </div>
                        <div style={{ marginBottom: 25 }}>
                            <BasicTextField caption='Descrição Português' valor={descricaoPT} onchange={(e) => setDescricaoPT(e.target.value)} fullwidth={true} type="text" error={ptError}
                                helperText={ptError ? "Introduza uma descrição válida" : ""} allowOnlyLetters={true}/>
                        </div>
                        <div style={{ marginBottom: 25 }}>
                            <BasicTextField caption='Descrição Inglês' valor={descricaoEN} onchange={(e) => setDescricaoEN(e.target.value)} fullwidth={true} type="text" error={engError}
                                helperText={engError ? "Introduza uma descrição válida" : ""} allowOnlyLetters={true}/>
                        </div>
                        <div style={{ marginBottom: 25 }}>
                            <BasicTextField caption='Descrição Espanhol' valor={descricaoES} onchange={(e) => setDescricaoES(e.target.value)} fullwidth={true} type="text" error={esError}
                                helperText={esError ? "Introduza uma descrição válida" : ""} allowOnlyLetters={true}/>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        <CancelButton onclick={handleCancel} caption='Cancelar' />
                        <SubmitButton onclick={handleAddEvent} caption='Guardar' />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default NovaSubcategoria;