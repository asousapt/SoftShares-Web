import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import BasicTextField from '../../components/textFields/basic';
import DataHora from '../../components/textFields/dataHora';
import SubmitButton from '../../components/buttons/submitButton';
import CancelButton from '../../components/buttons/cancelButton';
import ImageTable from '../../components/tables/imageTable';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import FormAnswerer from '../../components/forms/FormAnswerer';

const AddPontoIntModal = ({ open, onClose, setAlertOpen, setAlertProps }) => {
    //VARS
    //FIELDS
    const [title, setTitle] = useState('');
    const [localizacao, setLocalizacao] = useState('');
    const [description, setDescription] = useState('');
    const [cidade, setCidade] = useState(null);
    const [cidades, setCidades] = useState([]);
    const [distrito, setDistrito] = useState(null);
    const [distritos, setDistritos] = useState([]);
    const [categoria, setCategoria] = useState(null);
    const [opcoesFiltroCat, setOpcoesCat] = useState([]);
    const [subcategoria, setSubcategoria] = useState(null);
    const [opcoesFiltroSubcat, setOpcoesSubcat] = useState([]);
    const [error, setError] = useState(null);
    const [images, setImages] = useState([]);
    const [questions , setQuestions] = useState([]);
    
    const componentRef = useRef();

    const executeFunction = () => {
        componentRef.current.generateJSON();
    };

    //ERRORS
    const [titleError, setTittleError] = useState(false);
    const [localizacaoError, setLocalizacaoError] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);
    const [cidadeError, setCidadeError] = useState(false);
    const [distritoError, setDistritoError] = useState(false);
    const [categoriaError, setCategoriaError] = useState(false);
    const [subcategoriaError, setSubcategoriaError] = useState(false);

    const validateForm = () => {
        let errors = {};

        if (!title) {
            errors.titleError = true;
        }

        if (!localizacao) {
            errors.localizacaoError = true;
        }

        if (!description) {
            errors.descriptionError = true;
        }

        if (!cidade) {
            errors.cidadeError = true;
        }

        if (!distrito) {
            errors.distritoError = true;
        }

        if (!categoria) {
            errors.categoriaError = true;
        }

        if (!subcategoria) {
            errors.subcategoriaError = true;
        }

        return errors;
    };

    useEffect(() => {
        const fetchDistritos = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const response = await axios.get('http://localhost:8000/cidades/distritos', {
                    headers: { Authorization: `${token}` }
                });
                const distritoData = response.data.data;
                const distritosOptions = distritoData.map(distrito => ({
                    value: distrito.distritoid,
                    label: distrito.nome
                }));

                setDistritos(distritosOptions);
            } catch (error) {
                console.error('Erro ao buscar distritos:', error);
            }
        };

        const fetchCategorias = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const response = await axios.get('http://localhost:8000/categoria', {
                    headers: { Authorization: `${token}` }
                });
                const categorias = response.data;
                const categoriasOptions = categorias.map((cat) => ({
                    value: cat.categoriaid,
                    label: cat.valorpt
                }));
                setOpcoesCat(categoriasOptions);
            } catch (error) {
                setError(error);
            }
        };

        fetchDistritos();
        fetchCategorias();
    }, []);

    const fetchCidades = async (distritoId) => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get(`http://localhost:8000/cidades/distrito/${distritoId}`, {
                headers: { Authorization: `${token}` }
            });
            const cidadesData = response.data.data;
            const cidadesOptions = cidadesData.map(cidade => ({
                value: cidade.cidadeid,
                label: cidade.nome
            }));

            setCidades(cidadesOptions);
        } catch (error) {
            console.error('Erro ao buscar cidades:', error);
        }
    };

    const handleDistritoChange = (event, newValue) => {
        setDistrito(newValue);
        setCidade(null);
        if (newValue) {
            fetchCidades(newValue.value);
        } else {
            setCidades([]);
        }
    };

    const handleCategoriaChange = async (event, newValue) => {
        setCategoria(newValue);
        setQuestions([]);
        setSubcategoria(null);
        if (newValue) {
            try {
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
            } catch (error) {
                setError(error);
            }
        } else {
            setOpcoesSubcat([]);
            setSubcategoria(null);
        }
    };

    const handleAddPontInt = async (data, formErrors) => {
        const errors = validateForm();

        setTittleError(errors.titleError || false);
        setLocalizacaoError(errors.localizacaoError || false);
        setDescriptionError(errors.descriptionError || false);
        setCidadeError(errors.cidadeError || false);
        setDistritoError(errors.distritoError || false);
        setCategoriaError(errors.categoriaError || false);
        setSubcategoriaError(errors.subcategoriaError || false);

        setQuestions(prevQuestions => prevQuestions.map(q => ({ ...q, error: '' })));

        data = JSON.parse(data);
        if (data && Array.isArray(data)) {
            setQuestions(prevQuestions => {
                const updatedQuestions = prevQuestions.map(q => {
                    const value = data.find(val => val.id === q.id);
                    return value ? { ...q, text: value.text, options: value.options } : q;
                });
                return updatedQuestions;
            });
        }
        
        if (formErrors && Array.isArray(formErrors)) {
            setQuestions(prevQuestions => {
                const updatedQuestions = prevQuestions.map(q => {
                    const error = formErrors.find(err => err.id === q.id);
                    return error ? { ...q, error: error.message } : q;
                });
                return updatedQuestions;
            });
            return;
        }

        if (Object.keys(errors).length > 0) {
            return;
        }

        try {
            const imagesRtn = images.map(image => ({
                nome: image.alt,
                base64: image.src,
                tamanho: image.size
            }));

            const userid = sessionStorage.getItem('userid');
            const token = sessionStorage.getItem('token');
            const novoEvento = {
                titulo: title,
                descricao: description,
                localizacao: localizacao,
                latitude: 0,
                longitude: 0,
                idiomaid: 1,
                cidadeid: cidade ? cidade.value : '',
                utilizadorcriou: userid,
                subcategoriaid: subcategoria ? subcategoria.value : '',
                imagens: imagesRtn,
                formRespostas: data
            };
            console.log(novoEvento);
            await axios.post('http://localhost:8000/pontoInteresse/add', novoEvento, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                }
            });
            onClose();
            setAlertProps({ title: 'Sucesso', label: `Ponto de Interesse criado com sucesso.`, severity: 'success' });
            setAlertOpen(true);
            resetForm();
        } catch (error) {
            console.error('Erro ao adicionar Ponto de Interesse:', error);
            setAlertProps({ title: 'Erro', label: `Ocorreu um erro ao criar o ponto de interesse.`, severity: 'error' });
            setAlertOpen(true);
        }
    };

    const handleImage = async () => {
        try {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*'; 
    
            fileInput.addEventListener('change', async (event) => {
                const file = event.target.files[0];
                if (!file) return; 
                const fileName = file.name;
                const fileSize = file.size;
                
                const reader = new FileReader();
                reader.readAsDataURL(file);
        
                reader.onload = async () => {
                    const imageData = reader.result;
                    console.log('reader',reader);
                    const fileData = imageData;
                    const image = {
                        src: fileData,
                        alt: fileName,
                        size: fileSize
                    }
                    setImages(prevImages => [...prevImages, image]);
                };
            });
            fileInput.click();
        } catch (error) {
            console.error('Error uploading image:', error.message);
        }
    };

    const resetImage = async (index) => {
        setImages(prevImages => {
            const newImages = [...prevImages];
            newImages.splice(index, 1);
            return newImages;
        });
    }

    const resetForm = () => {
        setTitle('');
        setLocalizacao('');
        setDescription('');
        setCidade(null);
        setDistrito(null);
        setCategoria(null);
        setSubcategoria(null);
        setImages([]);
        setQuestions([]);
    };

    const handleCancel = () => {
        resetForm();
        setTittleError(false);
        setLocalizacaoError(false);
        setDescriptionError(false);
        setCidadeError(false);
        setDistritoError(false);
        setCategoriaError(false);
        setSubcategoriaError(false);
        setImages([]);
        onClose();
    };

    const getForm = async (idSubcat) => {
        try {
            if (idSubcat){
                const token = sessionStorage.getItem('token');
                const response = await axios.get(`http://localhost:8000/formulario/subcat/${idSubcat}`, {
                    headers: {
                        Authorization: `${token}`
                    }
                });
                const form = response.data;

                setQuestions(form.map(detail => ({
                    id: detail.formulariodetalhesid,
                    type: detail.tipodados,
                    label: detail.pergunta,
                    text: '',
                    options: detail.respostaspossiveis
                            ? detail.respostaspossiveis.split(', ').map(option => ({ opcao: option.trim(), selected: false }))
                            : [{}], 
                    required: detail.obrigatorio,
                    minValue: detail.minimo,
                    maxValue: detail.maximo,
                    error: ''
                })));
            }
        } catch (error) {
            console.error("Erro ao encontrar o formulário", error);
        }
    }

    const handleSubcatChange = (event, newValue) => {
        setSubcategoria(newValue); 
        setQuestions([]);
        if (newValue){
            getForm(newValue.value); 
        }
        setSubcategoriaError(false); 
    }

    return (
        <Modal open={open} onClose={handleCancel}>
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '1000px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px', overflow: 'auto' }}>
                <h2 style={{ marginTop: 0, color: 'white' }}>Novo Ponto Interesse</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12, maxHeight: '70vh', overflowY: 'auto' }}>
                    <div style={{ marginBottom: 15 }}>
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                            <div style={{ width: '50%' }}>
                                <BasicTextField caption='Titulo' valor={title} onchange={(e) => setTitle(e.target.value)} fullwidth={true} type="text" error={titleError}
                                helperText={titleError ? "Introduza um título válido" : ""} />
                            </div>
                            <div style={{ width: '49.4%' }}>
                                <BasicTextField caption='Localização' valor={localizacao} onchange={(e) => setLocalizacao(e.target.value)} fullwidth={true} type="text" error={localizacaoError}
                                helperText={localizacaoError ? "Introduza uma localização válida" : ""} />
                            </div>
                        </div>
                        <div style={{ marginBottom: 20 }}></div>
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                            <div style={{ width: '100%' }}>
                                <BasicTextField caption='Descrição' valor={description} onchange={(e) => setDescription(e.target.value)} fullwidth={true} type="text" error={descriptionError}
                                helperText={descriptionError ? "Introduza uma descrição válida" : ""} />
                            </div>
                        </div>
                        <div style={{ marginBottom: 20 }}></div>
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                            <div style={{ width: '25%' }}>
                                <Autocomplete options={distritos} getOptionLabel={(option) => option.label} renderInput={(params) => (
                                    <TextField {...params} label="Distrito" variant="outlined" type="text" error={distritoError} helperText={distritoError ? "Escolha um distrito" : ""} /> )}
                                    value={distrito}
                                    onChange={handleDistritoChange}
                                    fullWidth={true} />
                            </div>
                            <div style={{ width: '23.4%' }}>
                                <Autocomplete options={cidades} getOptionLabel={(option) => option.label} renderInput={(params) => (
                                    <TextField {...params} label="Cidade" variant="outlined" error={cidadeError} helperText={cidadeError ? "Escolha uma cidade" : ""} />)}
                                    value={cidade}
                                    onChange={(event, newValue) => { setCidade(newValue); setCidadeError(false); }}
                                    fullWidth={true} />
                            </div>
                            <div style={{ width: '25%' }}>
                                <Autocomplete options={opcoesFiltroCat} getOptionLabel={(option) => option.label} renderInput={(params) => (
                                    <TextField {...params} label="Categoria" variant="outlined" type="text" error={categoriaError} helperText={categoriaError ? "Escolha uma categoria" : ""} /> )}
                                    value={categoria}
                                    onChange={handleCategoriaChange}
                                    fullWidth={true} />
                            </div>
                            <div style={{ width: '25%' }}>
                                <Autocomplete options={opcoesFiltroSubcat} getOptionLabel={(option) => option.label} renderInput={(params) => (
                                    <TextField {...params} label="Subcategoria" variant="outlined" error={subcategoriaError} helperText={subcategoriaError ? "Escolha uma categoria subcategoria" : ""} />)}
                                    value={subcategoria}
                                    onChange={handleSubcatChange}
                                    fullWidth={true} />
                            </div>
                        </div>
                        <FormAnswerer ref={componentRef} initialQuestions={questions} onFormSubmit={handleAddPontInt} />

                        <ImageTable images={images} styleProp={{ paddingTop: 10 }} onAddImage={handleImage} onDelete={resetImage}/>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        <CancelButton onclick={handleCancel} caption='Cancelar' />
                        <SubmitButton onclick={executeFunction /*handleAddPontInt*/} caption='Guardar' /> 
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default AddPontoIntModal;
