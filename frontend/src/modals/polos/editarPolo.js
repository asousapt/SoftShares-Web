import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import BasicTextField from '../../components/textFields/basic';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import InputImage from '../../components/image/imageInput';
import SubmitButton from '../../components/buttons/submitButton';
import CancelButton from '../../components/buttons/cancelButton';
import axios from 'axios';

const EditarPolo = ({ open, onClose, poloId, setAlertOpen, setAlertProps }) => {
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

    useEffect(() => {
        if (open) {
            fetchPoloData(poloId);
        }
    }, [open, poloId]);

    useEffect(() => {
        fetchDistritos();
    }, []);

    const fetchPoloData = async (id) => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/polo/${id}`, {
                headers: { Authorization: `${token}` }
            });
            const polo = response.data.data;
            setDescricao(polo.descricao);
            setMorada(polo.morada);
            setEmail(polo.email);
            setTelefone(polo.telefone);
            setResponsavel(polo.coordenador);
            setImage(polo.image || image);
            const distrito = await fetchDistritoByCidadeId(polo.cidadeid);
            setDistrito(distrito);
            fetchCidades(distrito.value, polo.cidadeid);
            
            if (polo.imagem === undefined){
                setImageName('');
                setImageSize(0);
                setImage('');
            } else {
                if (polo.imagem.url === '' || polo.imagem.url === null) {
                    setImageName('');
                    setImageSize(0);
                    setImage('');
                } else {
                    const base64String = await getBase64FromUrl(polo.imagem.url);
                    setImage(base64String);
                    setImageName(polo.imagem.name);
                    setImageSize(polo.imagem.size);
                }
            }
        } catch (error) {
            console.error('Erro ao buscar dados do polo:', error);
        }
    };

    const fetchDistritoByCidadeId = async (cidadeId) => {
        const token = sessionStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/cidades/${cidadeId}/distrito`, {
            headers: { Authorization: `${token}` }
        });
        const distritoData = response.data.data;
        return { value: distritoData.distritoid, label: distritoData.nome };
    };

    const fetchDistritos = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/cidades/distritos`, {
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

    const fetchCidades = async (distritoId, cidadeId) => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/cidades/distrito/${distritoId}`, {
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

    const handleDistritoChange = (event, newValue) => {
        setDistrito(newValue);
        setCidade(null);
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
            alert('Contacto deve começar por 232 e ter 9 digitos!');
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

    const handleUpdateEvent = async () => {
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
                descricao,
                morada,
                email,
                telefone,
                coordenador: responsavel,
                cidadeID: cidade.value,
                imagem: imagem,
                utilizadorid: userid
            };

            await axios.put(`${process.env.REACT_APP_API_URL}/polo/update/${poloId}`, novoPolo, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                }
            });
            onClose();
            setAlertProps({ title: 'Sucesso', label: `${descricao} editado com sucesso`, severity: 'success' });
            setAlertOpen(true);
        } catch (error) {
            console.error('Erro ao atualizar polo:', error);
            setAlertProps({ title: 'Erro', label: `Ocorreu um erro ao editar o ${descricao}.`, severity: 'error' });
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
                    setImage(imageData);
                };
            });
            fileInput.click();
        } catch (error) {
            console.error('Error uploading image:', error.message);
        }
    };

    const resetImage = async () => {
        setImageName('');
        setImageSize(0);
        setImage('');
    }

    const handleCancel = () => {
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
                <h2 style={{ marginTop: 0, color: 'white' }}>Editar Polo</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12 }}>
                    <div style={{ marginBottom: 15 }}>
                        <BasicTextField caption='Descrição' valor={descricao} onchange={(e) => setDescricao(e.target.value)} fullwidth={true} type="text" error={descError}
                            helperText={descError ? "Introduza uma descrição válida" : ""} />
                        <div style={{ display: 'flex', marginTop: 20, gap: 5 }}>
                            <div style={{ width: '50%' }}>
                                <Autocomplete options={distritos} getOptionLabel={(option) => option.label} renderInput={(params) => (
                                    <TextField {...params} label="Distrito" variant="outlined" type="text" error={distritoError} helperText={distritoError ? "Escolha um distrito" : ""} />)}
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
                        <SubmitButton onclick={handleUpdateEvent} caption='Guardar' />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default EditarPolo;