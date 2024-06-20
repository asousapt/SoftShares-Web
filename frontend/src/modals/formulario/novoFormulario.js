import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
/* COMPONENTES */
import BasicTextField from '../../components/textFields/basic';
import ComboBox from '../../components/combobox/comboboxBasic';
import SubmitButton from '../../components/buttons/submitButton';
import CancelButton from '../../components/buttons/cancelButton';
import FormBuilder from '../../components/forms/FormBuilder';
/* FIM COMPONENTES */

const NovoFormulario = ({ open, onClose, setAlertOpen, setAlertProps }) => {
    //VARS
    //FIELDS
    const [desc, setDesc] = useState('');
    const [categoria, setCategoria] = useState(null);
    const [opcoesCat, setOpcoesCat] = useState([]);
    const [subcategoria, setSubcategoria] = useState(null);
    const [opcoesSubcat, setOpcoesSubcat] = useState([]);
    const [formData, setFormData] = useState(null);

    const componentRef = useRef();

    const executeFunction = () => {
        componentRef.current.generateJSON();
    };

    //ERRORS
    const [catError, setCatError] = useState(false);
    const [descError, setDescError] = useState(false);
    const [subError, setSubError] = useState(false);

    const validateForm = () => {
        let errors = {};

        if (!desc) {
            errors.descError = true;
        }

        if (!categoria) {
            errors.catError = true;
        }

        if (!subcategoria) {
            errors.subError = true;
        }

        return errors;
    };

    const handleFormSubmit = async (data) => {
        const errors = validateForm();

        setDescError(errors.descError || false);
        setCatError(errors.catError || false);
        setSubError(errors.subError || false);

        if (Object.keys(errors).length > 0) {
            return;
        }

        setFormData(data);
        data = JSON.parse(data);

        if (data.length === 0) {
            alert('Adicione alguma pergunta!');
            return;
        }

        for (let question of data) {
            if (!question.text.trim()) {
                alert('Preencha o texto de todas as perguntas!');
                return;
            }
        }

        if (!desc.trim() || !subcategoria) {
            alert('Preencha todos os campos!')
            return
        }

        try {
            const token = sessionStorage.getItem('token');
            const novoForm = {
                idRegisto: subcategoria.value,
                tipoConfig: 'SUBCAT',
                tipoForm: 'GENERICO',
                descForm: desc,
                perguntas: data
            };
            await axios.post('http://localhost:8000/formulario/add', novoForm, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                }
            });
            onClose();
            setAlertProps({ title: 'Sucesso', label: `Formulário criado com sucesso.`, severity: 'success' });
            setAlertOpen(true);
            resetForm();
        } catch (e) {
            console.error('Erro ao adicionar evento:', e);
            setAlertProps({ title: 'Erro', label: `Ocorreu um erro ao criaro formulário.`, severity: 'error' });
            setAlertOpen(true);
        }
    };

    const fetchCategorias = async () => {
        const token = sessionStorage.getItem('token');
        const response = await axios.get(`http://localhost:8000/categoria`, {
            headers: { Authorization: `${token}` }
        });
        const categorias = response.data;

        setOpcoesCat(categorias.map((cat) => ({
            value: cat.categoriaid,
            label: cat.valorpt
        })));
    }

    const handleCategoriaChange = async (event, newValue) => {
        setCategoria(newValue);
        setSubcategoria(null);
        if (newValue) {
            const token = sessionStorage.getItem('token');
            const response = await axios.get(`http://localhost:8000/subcategoria/categoria/${newValue.value}`, {
                headers: { Authorization: `${token}` }
            });
            const subcategorias = response.data;
            const subcategoriasOptions = subcategorias.map((subcat) => ({
                value: subcat.subcategoriaid,
                label: subcat.valorpt
            }));
            setOpcoesSubcat(subcategoriasOptions);
        } else {
            setOpcoesSubcat([]);
            setSubcategoria(null);
        }
    };

    useEffect(() => {
        fetchCategorias();
    }, []);

    const resetForm = () => {
        setDesc('');
        setCategoria(null);
        setSubcategoria(null);
    };

    const handleCancel = () => {
        resetForm();
        setDescError(false);
        setSubError(false);
        setCatError(false);
        onClose();
    };

    return (
        <Modal open={open} onClose={handleCancel} >
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px' }}>
                <h2 style={{ marginTop: 0, color: 'white' }}>Novo Formulario</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12 }}>
                    <div style={{ marginBottom: 15 }}>
                        <BasicTextField caption='Descrição' valor={desc} onchange={(e) => setDesc(e.target.value)} fullwidth={true} type="text" error={descError}
                                helperText={descError ? "Introduza uma descrição válida" : ""} />
                        <div style={{ display: 'flex', marginTop: 20, gap: 10 }}>
                            <div style={{ display: 'flex', gap: 10, width: '100%' }}>
                                <div style={{ width: '50%' }}>
                                    <Autocomplete options={opcoesCat} getOptionLabel={(option) => option.label} renderInput={(params) => (
                                        <TextField {...params} label="Categoria" variant="outlined" type="text" error={catError} helperText={catError ? "Escolha uma categoria" : ""} /> )}
                                    value={categoria}
                                    onChange={handleCategoriaChange}
                                    fullWidth={true} />
                                </div>
                                <div style={{ width: '50%' }}>
                                    <Autocomplete options={opcoesSubcat} getOptionLabel={(option) => option.label} renderInput={(params) => (
                                        <TextField {...params} label="Subcategoria" variant="outlined" type="text" error={subError} helperText={subError ? "Escolha uma subcategoria" : ""} /> )}
                                    value={subcategoria}
                                    onChange={(event, newValue) => { setSubcategoria(newValue); }}
                                    fullWidth={true} />
                                </div>
                            </div>
                        </div>
                        <div style={{ overflowY: 'auto', maxHeight: '50vh', marginTop: 20 }}>
                            <FormBuilder ref={componentRef} onFormSubmit={handleFormSubmit} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        <CancelButton onclick={handleCancel} caption='Cancelar' />
                        <SubmitButton onclick={executeFunction} caption='Guardar' />
                    </div>
                </div>
            </div>
        </Modal>
    );
}


export default NovoFormulario;