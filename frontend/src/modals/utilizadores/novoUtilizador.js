import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import BasicTextField from '../../components/textFields/basic';
import ComboBox from '../../components/combobox/comboboxBasic';
import SubmitButton from '../../components/buttons/submitButton';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CancelButton from '../../components/buttons/cancelButton';
import InputImage from '../../components/image/imageInput';

const AddUserModal = ({ open, onClose, setAlertOpen, setAlertProps }) => {
    //VARS
    //FIELDS
    const [poloid, setPoloid] = useState(null);
    const [poloadmid, setPoloAdmid] = useState('');
    const [perfilid, setPerfilid] = useState('');
    const [pnome, setPnome] = useState('');
    const [unome, setUnome] = useState('');
    const [email, setEmail] = useState('');
    const [passwd, setPasswd] = useState('');
    const [departamentoid, setDepartamentoid] = useState('');
    const [departamentos, setDepartamentos] = useState([]);
    const [polos, setPolos] = useState([]);
    const [funcao, setFuncao] = useState([]);
    const [perfil, setPerfil] = useState([]);
    const [funcaoid, setFuncaoid] = useState('');
    const [sobre, setSobre] = useState('');
    const [inactivo, setInactivo] = useState(false);
    const [image, setImage] = useState('');
    const [imageName, setImageName] = useState('');
    const [imageSize, setImageSize] = useState(0);
    const [isPoloAdmidDisabled, setIsPoloAdmidDisabled] = useState(true);
    const [isPoloDisabled, setIsPoloDisabled] = useState(false);
    const [isPerfilDisabled, setIsPerfilDisabled] = useState(false);

    //ERRORS
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [pnomeError, setPnomeError] = useState(false);
    const [unomeError, setUnomeError] = useState(false);
    const [passError, setPassError] = useState(false);
    const [poloError, setPoloError] = useState(false);
    const [poloAdmError, setPoloAdmError] = useState(false);
    const [perfilError, setPerfilError] = useState(false);
    const [departamentoError, setDepartamentoError] = useState(false);
    const [funcaoError, setFuncaoError] = useState(false);

    useEffect(() => {
        const fetchDepartamentos = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/departamento`, {
                    headers: { Authorization: `${token}` }
                });
                const departamentosData = response.data;

                const departamentosOptions = departamentosData.map(departamento => ({
                    value: departamento.departamentoid,
                    label: departamento.valorpt
                }));

                setDepartamentos(departamentosOptions);
            } catch (error) {
                console.error('Erro ao buscar departamentos:', error);
            }
        };

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

                setPolos(polosOptions);
            } catch (error) {
                console.error('Erro ao buscar polos:', error);
            }
        };

        const fetchFuncao = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/funcao`, {
                    headers: { Authorization: `${token}` }
                });
                const funcaoData = response.data;
                const funcaoOptions = funcaoData.map(funcao => ({
                    value: funcao.funcaoid,
                    label: funcao.valorpt
                }));

                setFuncao(funcaoOptions);
            } catch (error) {
                console.error('Erro ao buscar funções:', error);
            }
        };

        const fetchPerfil = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/perfil`, {
                    headers: { Authorization: `${token}` }
                });
                const perfilData = response.data.data;

                const perfilOptions = perfilData.map(perfil => ({
                    value: perfil.perfilid,
                    label: perfil.descricao
                }));

                setPerfil(perfilOptions);
            } catch (error) {
                console.error('Erro ao buscar funções:', error);
            }
        };

        fetchPerfil();
        fetchFuncao();
        fetchPolos();
        fetchDepartamentos();

        const perfilsess = sessionStorage.getItem('perfil');
        if (perfilsess === 'Admin') {
            setIsPoloDisabled(true);

            const selectedPerfil = perfil.find(p => p.label === 'User');
            if (selectedPerfil){
                setPerfilid(selectedPerfil.value);
            }
            setIsPerfilDisabled(true);

            const poloid = sessionStorage.getItem('poloid');
            const descpolo = sessionStorage.getItem('descpolo');
            setPoloid({ value: poloid, label: descpolo });
        } else {
            setIsPoloDisabled(false);
            setIsPerfilDisabled(false);
        }
    }, [open]);

    const handlePerfilChange = (event) => {
        const selectedPerfilId = event.target.value;
        setPerfilid(selectedPerfilId);

        const selectedPerfil = perfil.find(p => p.value === selectedPerfilId);

        if (selectedPerfil && selectedPerfil.label === 'Admin') {
            setIsPoloAdmidDisabled(false);
        } else {
            setIsPoloAdmidDisabled(true);
            setPoloAdmid('');
        }

        setPerfilError(false);
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const verificarEmail = async (email) => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/utilizadores/email/${email}`, {
                headers: { Authorization: `${token}` }
            });
            return response.status === 200;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return false;
            }
            console.error('Erro ao verificar e-mail:', error);
            return true;
        }
    };

    const validateForm = async () => {
        let errors = {};

        if (!validateEmail(email)) {
            errors.emailError = true;
        } else {
            const emailExists = await verificarEmail(email);
            if (emailExists) {
                errors.emailError = true;
                errors.emailMessage = "Este e-mail já está em uso.";
            }
        }

        if (!pnome) {
            errors.pnomeError = true;
        }

        if (!unome) {
            errors.unomeError = true;
        }

        if (!passwd) {
            errors.passError = true;
        }

        if (!poloid) {
            errors.poloError = true;
        }

        if (!perfilid) {
            errors.perfilError = true;
        }

        if (!departamentoid) {
            errors.departamentoError = true;
        }

        if (!funcaoid) {
            errors.funcaoError = true;
        }

        if (!isPoloAdmidDisabled && !poloadmid) {
            errors.poloAdmError = true;
        }

        return errors;
    };

    const handleAddUser = async () => {
        const emailErrorState = !validateEmail(email);
        setEmailError(emailErrorState);

        if (emailErrorState) {
            setEmailErrorMessage("Introduza um e-mail válido");
            return;
        }

        const emailExists = await verificarEmail(email);
        if (emailExists) {
            setEmailError(true);
            setEmailErrorMessage("Este e-mail já está em uso.");
            return;
        }
        
        const errors = await validateForm();
        setEmailError(errors.emailError || false);
        setEmailErrorMessage(errors.emailMessage || "");
        setPnomeError(errors.pnomeError || false);
        setUnomeError(errors.unomeError || false);
        setPassError(errors.passError || false);
        setPoloError(errors.poloError || false);
        setPerfilError(errors.perfilError || false);
        setDepartamentoError(errors.departamentoError || false);
        setFuncaoError(errors.funcaoError || false);
        setPoloAdmError(errors.poloAdmError || false);

        if (Object.keys(errors).length > 0) {
            return;
        }

        try {
            const token = sessionStorage.getItem('token');
            const imagem = [{
                nome: imageName,
                base64: image,
                tamanho: imageSize
            }];
            const newUser = {
                poloid: poloid ? poloid.value : '',
                perfilid,
                pnome,
                unome,
                email,
                passwd,
                chavesalt: 'saltsalt',
                idiomaid: 1,
                departamentoid,
                funcaoid,
                sobre,
                inactivo,
                imagem,
                administrador_poloid: isPoloAdmidDisabled ? null : poloadmid
            };

            await axios.post(`${process.env.REACT_APP_API_URL}/utilizadores/add`, newUser, {
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json'
                },
            });
            console.log('Utilizador Adicionado com sucesso');
            setAlertProps({ title: 'Sucesso', label: `O utilizador ${pnome} ${unome} foi criado com sucesso.`, severity: 'success' });
            setAlertOpen(true);
            resetForm();
            onClose();
        } catch (error) {
            console.error('Erro ao adicionar utilizador:', error);
            setAlertProps({ title: 'Erro', label: `Ocorreu um erro ao adicionar o utilizador.`, severity: 'error' });
            setAlertOpen(true);
        }
    };

    const handleChangeAtivo = () => {
        setInactivo((prevInactivo) => {
            const novoInactivo = !prevInactivo;
            return novoInactivo;
        });
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

    const resetImage = async () => {
        setImageName('');
        setImageSize(0);
        setImage('');
    }

    const resetForm = () => {
        setPoloid(null);
        setPoloAdmid('');
        setPerfilid('');
        setPnome('');
        setUnome('');
        setEmail('');
        setPasswd('');
        setDepartamentoid('');
        setFuncaoid('');
        setSobre('');
        setInactivo(false);
        setImage('');
        setImageName('');
        setImageSize(0);
        setEmailError(false);
    };

    const handleCancel = () => {
        resetForm();
        setEmailError(false);
        setPnomeError(false);
        setUnomeError(false);
        setPassError(false);
        setPoloError(false);
        setPerfilError(false);
        setDepartamentoError(false);
        setFuncaoError(false);
        setPoloAdmError(false);
        onClose();
    };

    return (
        <Modal open={open} onClose={handleCancel}>
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '1000px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px', overflow: 'auto' }}>
                <h2 style={{ marginTop: 0, color: 'white' }}>Novo Utilizador</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ flex: '65%', paddingRight: 15 }}>
                            <div style={{ marginBottom: 15 }}>
                                <div style={{ display: 'flex', marginTop: 20, gap: 10 }}>
                                    <div style={{ width: "50%" }} >
                                        <BasicTextField caption='Primeiro Nome' valor={pnome} onchange={(e) => setPnome(e.target.value)} fullwidth={true} type="text" error={pnomeError}
                                            helperText={pnomeError ? "Introduza um nome válido" : ""} allowOnlyLetters={true} />
                                    </div>
                                    <div style={{ width: "50%" }} >
                                        <BasicTextField caption='Último Nome' valor={unome} onchange={(e) => setUnome(e.target.value)} fullwidth={true} type="text" error={unomeError}
                                            helperText={unomeError ? "Introduza um nome válido" : ""} allowOnlyLetters={true} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', marginTop: 20, gap: 10 }}>
                                    <BasicTextField caption='Email' valor={email} onchange={(e) => setEmail(e.target.value)} fullwidth={true} type="email" error={emailError}
                                        helperText={emailError ? emailErrorMessage : ""} />
                                </div>
                                <div style={{ display: 'flex', marginTop: 20, gap: 10 }}>
                                    <div style={{ width: "50%" }}>
                                        <BasicTextField caption='Senha' valor={passwd} onchange={(e) => setPasswd(e.target.value)} fullwidth={true} type="password" error={passError}
                                            helperText={passError ? "Introduza uma password válida" : ""} />
                                    </div>
                                    <div style={{ width: "50%" }}>
                                        <Autocomplete options={polos} getOptionLabel={(option) => option.label} renderInput={(params) => (
                                            <TextField {...params} label="Polo" variant="outlined" type="text" error={poloError} helperText={poloError ? "Escolha um Polo" : ""} />
                                        )}
                                            value={poloid}
                                            onChange={(event, newValue) => { setPoloid(newValue); }}
                                            fullWidth={true}
                                            disabled={isPoloDisabled}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', marginTop: 20, gap: 10 }}>
                                    <div style={{ width: "50%" }}>
                                        <ComboBox caption='Perfil' options={perfil} value={perfilid} handleChange={handlePerfilChange} error={perfilError}
                                            helperText={perfilError ? "Selecione um perfil válido" : ""} disabled={isPerfilDisabled}/>
                                    </div>
                                    <div style={{ width: "50%" }}>
                                        <ComboBox caption='Polo a Administrar' options={polos} value={poloadmid} handleChange={(e) => { setPoloAdmid(e.target.value); setPoloAdmError(false); }} error={poloAdmError}
                                            helperText={poloAdmError ? "Selecione um polo válido" : ""} disabled={isPoloAdmidDisabled} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', marginTop: 20, gap: 10 }}>
                                    <div style={{ width: "50%" }}>
                                        <ComboBox caption='Departamento' options={departamentos} value={departamentoid} handleChange={(e) => { setDepartamentoid(e.target.value); setDepartamentoError(false); }}
                                            error={departamentoError} helperText={departamentoError ? "Selecione um departamento válido" : ""} />
                                    </div>
                                    <div style={{ width: "50%" }} >
                                        <ComboBox caption='Função' options={funcao} value={funcaoid} handleChange={(e) => { setFuncaoid(e.target.value); setFuncaoError(false); }} error={funcaoError}
                                            helperText={funcaoError ? "Selecione uma função válida" : ""} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <div style={{ padding: '20px' }}>
                                <div style={{ paddingLeft: '5%' }}>
                                    <InputImage image={image} onAddImage={handleImage} onDelete={resetImage} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <FormControlLabel
                                        labelPlacement="start"
                                        control={<Switch checked={inactivo} onChange={handleChangeAtivo} />}
                                        label="Inativo"
                                        sx={{ marginTop: '10px' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
                        <CancelButton onclick={handleCancel} caption='Cancelar' />
                        <SubmitButton onclick={handleAddUser} caption='Guardar' />
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default AddUserModal;
