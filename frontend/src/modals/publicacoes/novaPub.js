import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import BasicTextField from '../../components/textFields/basic';
import SubmitButton from '../../components/buttons/submitButton';
import CancelButton from '../../components/buttons/cancelButton';
import ImageTable from '../../components/tables/imageTable';

const AddPublicacao = ({ open, onClose, setAlertOpen, setAlertProps }) => {
    //VARS
    //FIELDS
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [opcoesCat, setOpcoesCat] = useState([]);
    const [categoria, setCategoria] = useState(null);
    const [opcoesSubcat, setOpcoesSubcat] = useState([]);
    const [subcategoria, setSubcategoria] = useState(null);
    const [poloOptions, setPoloOptions] = useState([]);
    const [polo, setPolo] = useState(null);
    const [error, setError] = useState(null);
    const [images, setImages] = useState([]);

    //ERRORS
    const [titleError, setTitleError] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);
    const [catError, setCatError] = useState(false);
    const [subcatError, setSubcatError] = useState(false);
    const [poloError, setPoloError] = useState(false);

    const fetchPolos = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/polo`, {
                headers: { Authorization: `${token}` }
            });
            const polosData = response.data.data;
            const polosOptions = polosData.map(polo => ({
                value: polo.poloid,
                label: polo.descricao
            }));

            setPoloOptions(polosOptions);
        } catch (error) {
            console.error('Erro ao buscar polos:', error);
        }
    };

    const fetchCategorias = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/categoria`, {
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

    const handleCategoriaChange = async (event, newValue) => {
        setCategoria(newValue);
        setSubcategoria(null);
        if (newValue) {
            try {
                const token = sessionStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/subcategoria/categoria/${newValue.value}`, {
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

        if (!polo) {
            errors.poloError = true;
        }

        return errors;
    };

    const handleAddEvent = async () => {
        const errors = validateForm();
        setTitleError(errors.titleError || false);
        setDescriptionError(errors.descriptionError || false);
        setCatError(errors.catError || false);
        setSubcatError(errors.subcatError || false);
        setPoloError(errors.poloError || false);

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
            const novaPublicacao = {
                subcategoriaid: subcategoria.value,
                utilizadorid: userid,
                titulo: title,
                poloid: polo.value,
                mensagem: description,
                idiomaid: 1,
                imagens: imagesRtn
            };
            await axios.post(`${process.env.REACT_APP_API_URL}/thread/add`, novaPublicacao, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                }
            });
            onClose();
            setAlertProps({ title: 'Sucesso', label: `Publicação criada com sucesso.`, severity: 'success' });
            setAlertOpen(true);
            resetForm();
        } catch (error) {
            console.error('Erro ao adicionar evento:', error);
            setAlertProps({ title: 'Erro', label: `Ocorreu um erro ao criar a publicação.`, severity: 'error' });
            setAlertOpen(true);
        }
    };

    useEffect(() => {
        fetchCategorias();
        fetchPolos();
    }, []);

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
        setDescription('');
        setCategoria(null);
        setSubcategoria(null);
        setPolo(null);
        setImages([]);
    };

    const handleCancel = () => {
        resetForm();
        setTitleError(false);
        setDescriptionError(false);
        setCatError(false);
        setSubcatError(false);
        setPoloError(false);
        onClose();
    };

    return (
        <Modal open={open} onClose={handleCancel} >
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '1000px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px', overflow: 'auto' }}>
                <h2 style={{ marginTop: 0, color: 'white' }}>Nova Publicação</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12 }}>
                    <div style={{ marginBottom: 15 }}>
                        <div style={{ display: 'flex', marginBottom: 10, gap: 10 }}>
                            <div style={{ width: '100%' }} >
                                <BasicTextField caption='Titulo' valor={title} onchange={(e) => setTitle(e.target.value)} fullwidth={true} type="text" error={titleError}
                                    helperText={titleError ? "Introduza um título válido" : ""} allowOnlyLetters={true} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', marginBottom: 10, gap: 10 }}>
                            <div style={{ width: '33%' }}>
                                <Autocomplete options={poloOptions} getOptionLabel={(option) => option.label} renderInput={(params) => (
                                    <TextField {...params} label="Polo" variant="outlined" type="text" error={poloError} helperText={poloError ? "Escolha um Polo" : ""} />
                                )}
                                    value={polo}
                                    onChange={(event, newValue) => { setPolo(newValue); }}
                                    fullWidth={true}
                                />
                            </div>
                            <div style={{ width: '33%' }}>
                                <Autocomplete options={opcoesCat} getOptionLabel={(option) => option.label} renderInput={(params) => (
                                    <TextField {...params} label="Categoria" variant="outlined" type="text" error={catError} helperText={catError ? "Escolha uma categoria" : ""} />)}
                                    value={categoria}
                                    onChange={handleCategoriaChange}
                                    fullWidth={true} />
                            </div>
                            <div style={{ width: '33%' }}>
                                <Autocomplete options={opcoesSubcat} getOptionLabel={(option) => option.label} renderInput={(params) => (
                                    <TextField {...params} label="Subcategoria" variant="outlined" error={subcatError} helperText={subcatError ? "Escolha uma subcategoria" : ""} />)}
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
                            <ImageTable images={images} onAddImage={handleImage} onDelete={resetImage} />
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
}
export default AddPublicacao;
