import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import BasicTextField from '../../components/textFields/basic';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import InputImage from '../../components/image/imageInput';
import SubmitButton from '../../components/buttons/submitButton';
import CancelButton from '../../components/buttons/cancelButton';
import axios from 'axios';

const NovoPolo = ({ open, onClose, setAlertOpen, setAlertProps }) => {
    //VARS
    //FIELDS
    const [descricao, setDescricao] = useState('');
    const [morada, setMorada] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [responsavel, setResponsavel] = useState('');
    const [cidade, setCidade] = useState(null);
    const [cidades, setCidades] = useState([]);
    const [distrito, setDistrito] = useState(null);
    const [distritos, setDistritos] = useState([]);
    const [utilizadores, setUtilizadores] = useState([]);
    const [image, setImage] = useState('');
    const [imageName, setImageName] = useState('');
    const [imageSize, setImageSize] = useState(0);

    //ERRORS
    const [emailError, setEmailError] = useState(false);
    const [descError, setDescError] = useState(false);
    const [distritoError, setDistritoError] = useState(false);
    const [cidadeError, setCidadeError] = useState(false);
    const [moradaError, setMoradaError] = useState(false);
    const [telefoneError, setTelefoneError] = useState(false);
    const [coordError, setCoordError] = useState(false);

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

        fetchDistritos();
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
        setDistritoError(false);
        if (newValue) {
            fetchCidades(newValue.value);
        } else {
            setCidades([]);
        }
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validateTelefone = (telefone) => {
        const re = /^232\d{6}$/;
        return re.test(telefone);
    };

    const validateForm = () => {
        let errors = {};

        if (!validateEmail(email)) {
            errors.emailError = true;
        }

        if (!validateTelefone(telefone)) {
            errors.telefoneError = true;
        }

        if (!descricao) {
            errors.descError = true;
        }

        if (!morada) {
            errors.moradaError = true;
        }

        if (!responsavel) {
            errors.coordError = true;
        }

        if (!cidade) {
            errors.cidadeError = true;
        }

        if (!distrito) {
            errors.distritoError = true;
        }

        return errors;
    };

    const handleAddEvent = async () => {
        const errors = validateForm();
        setEmailError(errors.emailError || false);
        setCidadeError(errors.cidadeError || false);
        setCoordError(errors.coordError || false);
        setDescError(errors.descError || false);
        setDistritoError(errors.distritoError || false);
        setMoradaError(errors.moradaError || false);
        setTelefoneError(errors.telefoneError || false);

        if (Object.keys(errors).length > 0) {
            return;
        }

        try {
            const userid = sessionStorage.getItem('userid');
            const token = sessionStorage.getItem('token');
            const imagem = [{
                nome: imageName,
                base64: image,
                tamanho: imageSize
            }];
            const novoPolo = {
                descricao: descricao,
                morada: morada,
                email: email,
                telefone: telefone,
                coordenador: responsavel,
                cidadeID: cidade.value,
                imagem: imagem,
                utilizadorid: userid
            };

            await axios.post('http://localhost:8000/polo/add', novoPolo, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                }
            });
            console.log('Evento Adicionado');
            onClose();
            setAlertProps({ title: 'Sucesso', label: `Polo criado com sucesso.`, severity: 'success' });
            setAlertOpen(true);
            resetForm();
        } catch (error) {
            console.error('Erro ao adicionar evento:', error);
            setAlertProps({ title: 'Erro', label: `Ocorreu um erro ao criar o polo.`, severity: 'error' });
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
                setImageName(file.name);
                setImageSize(file.size);

                const reader = new FileReader();
                reader.readAsDataURL(file);

                reader.onload = async () => {
                    const imageData = reader.result;
                    console.log('reader', reader);
                    setImage(imageData);
                };
            });
            fileInput.click();
        } catch (error) {
            console.error('Error uploading image:', error.message);
        }
    };

    const resetForm = () => {
        setDescricao('');
        setMorada('');
        setEmail('');
        setTelefone('');
        setResponsavel('');
        setDistrito(null);
        setCidade(null);
        setImageName('');
        setImageSize(0);
        setImage('');
    };

    const resetImage = async () => {
        setImageName('');
        setImageSize(0);
        setImage('');
    }

    const handleCancel = () => {
        resetForm();
        setEmailError(false);
        setCidadeError(false);
        setCoordError(false);
        setDescError(false);
        setDistritoError(false);
        setMoradaError(false);
        setTelefoneError(false);
        onClose();
    };

    return (
        <Modal open={open} onClose={handleCancel} >
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '1000px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px', overflow: 'auto' }}>
                <h2 style={{ marginTop: 0, color: 'white' }}>Novo Polo</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12 }}>
                    <div style={{ marginBottom: 15 }}>
                        <BasicTextField caption='Descrição' valor={descricao} onchange={(e) => setDescricao(e.target.value)} fullwidth={true} type="text" error={descError}
                            helperText={descError ? "Introduza uma descrição válida" : ""} />
                        <div style={{ display: 'flex', marginTop: 20, gap: 5 }}>
                            <div style={{ width: '50%' }}>
                                <Autocomplete options={distritos} getOptionLabel={(option) => option.label} renderInput={(params) => (
                                        <TextField {...params} label="Distrito" variant="outlined" type="text" error={distritoError} helperText={distritoError ? "Escolha um distrito" : ""} /> )}
                                    value={distrito}
                                    onChange={handleDistritoChange}
                                    fullWidth={true} />
                            </div>
                            <div style={{ width: '50%' }}>
                                <Autocomplete options={cidades} getOptionLabel={(option) => option.label} renderInput={(params) => (
                                    <TextField {...params} label="Cidade" variant="outlined" error={cidadeError} helperText={cidadeError ? "Escolha uma cidade" : ""} />)}
                                    value={cidade}
                                    onChange={(event, newValue) => { setCidade(newValue); setCidadeError(false); }}
                                    fullWidth={true} />
                            </div>
                        </div>
                        <div style={{ marginTop: 20 }}>
                            <BasicTextField caption='Morada' valor={morada} onchange={(e) => setMorada(e.target.value)} fullwidth={true} type="text" error={moradaError}
                                helperText={moradaError ? "Introduza uma morada válida" : ""} />
                        </div>
                        <div style={{ display: 'flex', marginTop: 20, gap: 5 }}>
                            <div style={{ width: '34%' }}>
                                <BasicTextField caption='Email' valor={email} onchange={(e) => setEmail(e.target.value)} fullwidth={true} type="email" error={emailError}
                                    helperText={emailError ? "Introduza uma email válido" : ""} />
                            </div>
                            <div style={{ width: '25%' }}>
                                <BasicTextField caption='Telefone' valor={telefone} onchange={(e) => setTelefone(e.target.value)} fullwidth={true} type="numeric" error={telefoneError}
                                    helperText={telefoneError ? "Introduza uma nº telefone válido" : ""} />
                            </div>
                            <div style={{ width: '40%' }}>
                                <BasicTextField caption='Coordenador' valor={responsavel} onchange={(e) => setResponsavel(e.target.value)} fullwidth={true} type="text" error={coordError}
                                    helperText={coordError ? "Introduza um nome válido" : ""} allowOnlyLetters={true} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
                            <InputImage image={image} onAddImage={handleImage} onDelete={resetImage} />
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

export default NovoPolo;
