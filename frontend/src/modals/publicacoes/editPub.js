import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import BasicTextField from '../../components/textFields/basic';
import SubmitButton from '../../components/buttons/submitButton';
import CancelButton from '../../components/buttons/cancelButton';
import ImageTable from '../../components/tables/imageTable';

const EditPublicacao = ({ open, onClose, idPub, setAlertOpen, setAlertProps }) => {
    //VARS
    //FIELDS
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [opcoesCat, setOpcoesCat] = useState([]);
    const [categoria, setCategoria] = useState(null);
    const [opcoesSubcat, setOpcoesSubcat] = useState([]);
    const [subcategoria, setSubcategoria] = useState(null);
    const [inativo, setInativo] = useState(null);
    const [error, setError] = useState(null);
    const [images, setImages] = useState([]);

    //ERRORS
    const [titleError, setTitleError] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);
    const [catError, setCatError] = useState(false);
    const [subcatError, setSubcatError] = useState(false);

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

    const fetchCategorias = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get(`http://localhost:8000/categoria`, {
                headers: { Authorization: `${token}` }
            });
            const categorias = response.data;

            setOpcoesCat(categorias.map((cat) => ({
                value: cat.categoriaid,
                label: cat.valorpt
            })));
        } catch (error) {
            setError(error);
        }
    }

    const fetchSubcategoria = async (idcat) => {
        try {
            if (idcat) {
                const token = sessionStorage.getItem('token');
                const response = await axios.get(`http://localhost:8000/subcategoria/categoria/${idcat}`, {
                    headers: { Authorization: `${token}` }
                });
                const subcategorias = response.data;
                const subcategoriasOptions = subcategorias.map((subcat) => ({
                    value: subcat.subcategoriaid,
                    label: subcat.valorpt
                }));
                setOpcoesSubcat(subcategoriasOptions);
            }
        } catch (error) {
            setError(error);
        }
    }

    const handleCategoriaChange = async (event, newValue) => {
        setCategoria(newValue);
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

    const fetchData = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get(`http://localhost:8000/thread/${idPub}`, {
                headers: { Authorization: `${token}` }
            });
            const threads = response.data.data[0];

            setTitle(threads.titulo);
            setDescription(threads.mensagem);
            setInativo(threads.inativo);

            const catResponse = await axios.get(`http://localhost:8000/categoria/${threads.categoriaid}`, {
                headers: { Authorization: `${token}` }
            });
            const cat = catResponse.data;
            setCategoria({ value: threads.categoriaid, label: cat.valorpt });
            fetchSubcategoria(threads.categoriaid);

            const subcatResponse = await axios.get(`http://localhost:8000/subcategoria/${threads.subcategoriaid}`, {
                headers: { Authorization: `${token}` }
            });
            const subcat = subcatResponse.data;
            setSubcategoria({ value: threads.subcategoriaid, label: subcat.valorpt });

            const transformedImages = await Promise.all(
                threads.imagens.map(async (imagem) => {
                    const base64String = await getBase64FromUrl(imagem.url);
                    return {
                        src: base64String,
                        alt: imagem.name,
                        size: imagem.size,
                    };
                })
            );
            setImages(transformedImages);
        } catch (error) {
            setError(error);
        }
    }

    const validateForm = () => {
        let errors = {};

        if (!title) {
            errors.titleError = true;
        }

        if (!description) {
            errors.descriptionError = true;
        }

        if (!categoria) {
            errors.catError = true;
        }

        if (!subcategoria) {
            errors.subcatError = true;
        }

        return errors;
    };

    const handleSaveEvent = async () => {
        const errors = validateForm();
        setTitleError(errors.titleError || false);
        setDescriptionError(errors.descriptionError || false);
        setCatError(errors.catError || false);
        setSubcatError(errors.subcatError || false);

        if (Object.keys(errors).length > 0) {
            return;
        }

        try {
            if (!subcategoria || !title.trim() || !description.trim()) {
                alert('Preencha todos os campos!');
                return;
            }

            const imagesRtn = images.map(image => ({
                nome: image.alt,
                base64: image.src,
                tamanho: image.size
            }));
            
            const userid = sessionStorage.getItem('userid');
            const token = sessionStorage.getItem('token');
            const editarPublicacao = {
                subcategoriaid: subcategoria.value,
                titulo: title,
                mensagem: description,
                inactivo: inativo,
                imagens: imagesRtn,
                utilizadorid: userid
            };
            console.log(editarPublicacao);
            await axios.put('http://localhost:8000/thread/update/' + idPub, editarPublicacao, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                }
            });
            onClose();
            setAlertProps({ title: 'Sucesso', label: `Publicação editada com sucesso`, severity: 'success' });
            setAlertOpen(true);
        } catch (error) {
            console.error('Erro ao editar a publicação:', error);
            setAlertProps({ title: 'Erro', label: `Ocorreu um erro ao editar a publicação.`, severity: 'error' });
            setAlertOpen(true);
        }
    };

    const handleChangeAtivo = (e) => {
        console.log(e.target.checked);
        setInativo(e.target.checked);
    };

    useEffect(() => {
        fetchCategorias();
        fetchData();
    }, []);

    const handleCancel = () => {
        setTitleError(false);
        setDescriptionError(false);
        setCatError(false);
        setSubcatError(false);
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

    return (
        <Modal open={open} onClose={handleCancel} >
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '1000px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px' }}>
                <h2 style={{ marginTop: 0, color: 'white' }}>Editar Publicação</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12 }}>
                    <div style={{ marginBottom: 15 }}>
                        <div style={{ display: 'flex', marginBottom: 10, gap: 10 }}>
                            <div style={{ width: '50%' }} >
                                <BasicTextField caption='Titulo' valor={title} onchange={(e) => setTitle(e.target.value)} fullwidth={true} type="text" error={titleError}
                                    helperText={titleError ? "Introduza um título válido" : ""} />
                            </div>
                            <div style={{ width: '25%' }}>
                                <Autocomplete options={opcoesCat} getOptionLabel={(option) => option.label} renderInput={(params) => (
                                    <TextField {...params} label="Categoria" variant="outlined" type="text" error={catError} helperText={catError ? "Escolha uma categoria" : ""} />)}
                                    value={categoria}
                                    onChange={handleCategoriaChange}
                                    fullWidth={true} />
                            </div>
                            <div style={{ width: '25%' }}>
                                <Autocomplete options={opcoesSubcat} getOptionLabel={(option) => option.label} renderInput={(params) => (
                                    <TextField {...params} label="Subcategoria" variant="outlined" error={subcatError} helperText={subcatError ? "Escolha uma categoria subcategoria" : ""} />)}
                                    value={subcategoria}
                                    onChange={(event, newValue) => { setSubcategoria(newValue); setSubcatError(false); }}
                                    fullWidth={true} />
                            </div>
                        </div>
                        <div style={{ marginBottom: 20 }}>
                            <BasicTextField multiline={true} caption='Descrição' valor={description} onchange={(e) => setDescription(e.target.value)} fullwidth={true} type="text" error={descriptionError}
                            helperText={descriptionError ? "Introduza uma descrição válida" : ""} />
                        </div>
                        <div style={{ marginBottom: 20 }}>
                            <FormControlLabel
                                control={<Switch checked={inativo} onChange={handleChangeAtivo} />}
                                label="Inativo"
                            />
                        </div>
                        <div style={{ marginBottom: 20 }}>
                            <ImageTable images={images} onAddImage={handleImage} onDelete={resetImage}/>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        <CancelButton onclick={handleCancel} caption='Cancelar' />
                        <SubmitButton onclick={handleSaveEvent} caption='Guardar' />
                    </div>
                </div>
            </div>
        </Modal>
    );
}
export default EditPublicacao;
