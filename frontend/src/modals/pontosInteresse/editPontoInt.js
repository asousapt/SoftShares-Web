import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import BasicTextField from '../../components/textFields/basic';
import SubmitButton from '../../components/buttons/submitButton';
import CancelButton from '../../components/buttons/cancelButton';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import ImageTable from '../../components/tables/imageTable';
import FormAnswerer from '../../components/forms/FormAnswerer';

const EditPontoIntModal = ({ open, onClose, eventData, setAlertOpen, setAlertProps }) => {
    //VARS
    //FIELDS
    const [titulo, setTitle] = useState('');
    const [localizacao, setLocalizacao] = useState('');
    const [descricao, setDescription] = useState('');
    const [cidadeID, setCidade] = useState(null);
    const [cidades, setCidades] = useState([]);
    const [distrito, setDistrito] = useState(null);
    const [distritos, setDistritos] = useState([]);
    const [error, setError] = useState(null);
    const [images, setImages] = useState([]);
    const [categoria, setCategoria] = useState(null);
    const [subcategoria, setSubcategoria] = useState(null);
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

    const getBase64FromUrl = async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const validateForm = () => {
        let errors = {};

        if (!titulo) {
            errors.titleError = true;
        }

        if (!localizacao) {
            errors.localizacaoError = true;
        }

        if (!descricao) {
            errors.descriptionError = true;
        }

        if (!cidadeID) {
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

    const fetchDistritoByCidadeId = async (cidadeId) => {
        const token = sessionStorage.getItem('token');
        const response = await axios.get(`http://localhost:8000/cidades/${cidadeId}/distrito`, {
            headers: { Authorization: `${token}` }
        });
        const distritoData = response.data.data;
        return { value: distritoData.distritoid, label: distritoData.nome };
    };

    const fetchCidades = async (distritoId, cidadeId) => {
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
            setCidade(cidadesOptions.find(cidade => cidade.value === cidadeId));
        } catch (error) {
            console.error('Erro ao buscar cidades:', error);
        }
    };

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

    const handleDistritoChange = (event, newValue) => {
        setDistrito(newValue);
        setCidade(null);
        if (newValue) {
            fetchCidades(newValue.value);
        } else {
            setCidades([]);
        }
    };

    const fetchEventData = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get(`http://localhost:8000/pontoInteresse/${eventData}`, {
                headers: { Authorization: `${token}` }
            });
            const userData = response.data.data;
            console.log(userData);

            setTitle(userData.titulo);
            setLocalizacao(userData.localizacao);
            setDescription(userData.descricao);

            const distrito = await fetchDistritoByCidadeId(userData.cidadeid);
            setDistrito(distrito);
            fetchCidades(distrito.value, userData.cidadeid);

            const subcatResponse = await axios.get(`http://localhost:8000/subcategoria/${userData.subcategoriaid}`, {
                headers: { Authorization: `${token}` }
            });
            const subcat = subcatResponse.data;

            const catResponse = await axios.get(`http://localhost:8000/categoria/${subcat.categoriaid}`, {
                headers: { Authorization: `${token}` }
            });
            const cat = catResponse.data;

            setCategoria(cat.valorpt);
            setSubcategoria(subcat.valorpt);

            const transformedImages = await Promise.all(
                userData.imagens.map(async (imagem) => {
                    const base64String = await getBase64FromUrl(imagem.url);
                    return {
                        src: base64String,
                        alt: imagem.name,
                        size: imagem.size,
                    };
                })
            );
            setImages(transformedImages);

            setQuestions(userData.formdata.map(detail => {
                const responseArray = detail.resposta ? detail.resposta.split(',').map(res => res.trim()) : [];
            
                return {
                    id: detail.id,
                    type: detail.tipodados,
                    label: detail.pergunta,
                    text: detail.resposta,
                    options: detail.respostaspossiveis ? detail.respostaspossiveis.split(', ').map(option => ({
                                opcao: option.trim(),
                                selected: responseArray.includes(option.trim())
                            })) : [{}],
                    required: detail.obrigatorio,
                    minValue: detail.minimo,
                    maxValue: detail.maximo,
                    error: ''
                };
            }));
            
        } catch (error) {
            console.error('Erro ao receber dados do Ponto de Interesse:', error);
        }
    };

    useEffect(() => {
        fetchDistritos();
        fetchEventData();
    }, [eventData]);

    const handleEditPontoInt = async (data, formErrors) => {
        const errors = validateForm();

        setTittleError(errors.titleError || false);
        setLocalizacaoError(errors.localizacaoError || false);
        setDescriptionError(errors.descriptionError || false);
        setCidadeError(errors.cidadeError || false);
        setDistritoError(errors.distritoError || false);

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
            const poiEditado = {
                titulo: titulo,
                descricao: descricao,
                localizacao: localizacao,
                latitude: 0,
                longitude: 0,
                cidadeid: cidadeID.value,
                subcategoriaid: subcategoria.value,
                imagens: imagesRtn,
                utilizadorid: userid,
                formRespostas: data
            };

            await axios.put(`http://localhost:8000/pontoInteresse/update/${eventData}`, poiEditado, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                }
            });
            onClose();
            setAlertProps({ title: 'Sucesso', label: `Ponto de Interesse editado com sucesso.`, severity: 'success' });
            setAlertOpen(true);
        } catch (error) {
            console.error('Erro ao editar Ponto de Interesse:', error);
            setAlertProps({ title: 'Erro', label: `Ocorreu um erro ao editar o ponto de interesse.`, severity: 'error' });
            setAlertOpen(true);
        }
    };

    const handleCancel = () => {
        setTittleError(false);
        setLocalizacaoError(false);
        setDescriptionError(false);
        setCidadeError(false);
        setDistritoError(false);
        setImages([]);
        onClose();
    };

    const handleImage = async () => {
        try {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*'; 
    
            fileInput.addEventListener('change', async (event) => {
                const file = event.target.files[0];
                if (!file) return; 
                console.log(file);
                const fileName = file.name;
                const fileSize = file.size;
                
                const reader = new FileReader();
                reader.readAsDataURL(file);
        
                reader.onload = async () => {
                    const imageData = reader.result;
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

    return (
        <Modal open={open} onClose={handleCancel}>
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '1000px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px', overflow: 'auto' }}>
                <h2 style={{ marginTop: 0, color: 'white' }}>Editar Ponto Interesse</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12 }}>
                    <div style={{ marginBottom: 15 }}>
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                            <div style={{ width: '50%' }}>
                                <BasicTextField caption='Titulo' valor={titulo} onchange={(e) => setTitle(e.target.value)} fullwidth={true} type="text" error={titleError}
                                    helperText={titleError ? "Introduza um título válido" : ""} allowOnlyLetters={true}/>
                            </div>
                            <div style={{ width: '49.4%' }}>
                                <BasicTextField caption='Localização' valor={localizacao} onchange={(e) => setLocalizacao(e.target.value)} fullwidth={true} type="text" error={localizacaoError}
                                    helperText={localizacaoError ? "Introduza uma localização válida" : ""} />
                            </div>
                        </div>
                        <div style={{ marginBottom: 20 }}></div>
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                            <div style={{ width: '100%' }}>
                                <BasicTextField caption='Descrição' valor={descricao} onchange={(e) => setDescription(e.target.value)} fullwidth={true} type="text" error={descriptionError}
                                    helperText={descriptionError ? "Introduza uma descrição válida" : ""} />
                            </div>
                        </div>
                        <div style={{ marginBottom: 20 }}></div>
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                            <div style={{ width: '25%' }}>
                                <Autocomplete options={distritos} getOptionLabel={(option) => option.label} renderInput={(params) => (
                                    <TextField {...params} label="Distrito" variant="outlined" type="text" error={distritoError} helperText={distritoError ? "Escolha um distrito" : ""} />)}
                                    value={distrito}
                                    onChange={handleDistritoChange}
                                    fullWidth={true} />
                            </div>
                            <div style={{ width: '23.4%' }}>
                                <Autocomplete options={cidades} getOptionLabel={(option) => option.label} renderInput={(params) => (
                                    <TextField {...params} label="Cidade" variant="outlined" error={cidadeError} helperText={cidadeError ? "Escolha uma cidade" : ""} />)}
                                    value={cidadeID}
                                    onChange={(event, newValue) => { setCidade(newValue); setCidadeError(false); }}
                                    fullWidth={true} />
                            </div>
                            <div style={{ width: '25%' }}>
                                <BasicTextField caption='Categoria' valor={categoria} onchange={() => {}} fullwidth={true} disabled={true} />
                            </div>
                            <div style={{ width: '25%' }}>
                                <BasicTextField caption='Subcategoria' valor={subcategoria} onchange={() => {}} fullwidth={true} disabled={true} />
                            </div>
                        </div>
                        <FormAnswerer ref={componentRef} initialQuestions={questions} onFormSubmit={handleEditPontoInt}  />

                        <div style={{ marginTop: 10 }}>
                            <ImageTable images={images} onAddImage={handleImage} onDelete={resetImage}/>
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
};

export default EditPontoIntModal;