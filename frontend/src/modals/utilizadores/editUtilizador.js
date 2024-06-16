import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import BasicTextField from '../../components/textFields/basic';
import ComboBox from '../../components/combobox/comboboxBasic';
import SubmitButton from '../../components/buttons/submitButton';
import CancelButton from '../../components/buttons/cancelButton';
import InputImage from '../../components/image/imageInput';

const EditUserModal = ({ open, onClose, userId, setAlertOpen, setAlertProps }) => {
    //VARS
    //FIELDS
    const [poloid, setPoloid] = useState('');
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

    //ERRORS
    const [emailError, setEmailError] = useState(false);
    const [pnomeError, setPnomeError] = useState(false);
    const [unomeError, setUnomeError] = useState(false);
    const [passError, setPassError] = useState(false);
    const [poloError, setPoloError] = useState(false);
    const [perfilError, setPerfilError] = useState(false);
    const [departamentoError, setDepartamentoError] = useState(false);
    const [funcaoError, setFuncaoError] = useState(false);

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

    const fetchUserData = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get(`http://localhost:8000/utilizadores/${userId}`, {
                headers: { Authorization: `${token}` }
            });
            const userData = response.data.data;
            console.log('userData',userData);

            setPoloid(userData.poloid);
            setPerfilid(userData.perfilid);
            setPnome(userData.pnome);
            setUnome(userData.unome);
            setEmail(userData.email);
            setDepartamentoid(userData.departamentoid);
            setFuncaoid(userData.funcaoid);
            setPasswd(userData.passwd);
            setSobre(userData.sobre);
            setInactivo(userData.inactivo);
            const base64String = await getBase64FromUrl(userData.imagem.url);
            setImage(base64String);
            setImageName(userData.imagem.name);
            setImageSize(userData.imagem.size);
        } catch (error) {
            console.error('Erro ao buscar dados do utilizador:', error);
        }
    };

    useEffect(() => {
        if (open) {
            fetchUserData();
        }
    }, [open, userId]);

    useEffect(() => {
        const fetchDepartamentos = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const response = await axios.get('http://localhost:8000/departamento', {
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
                const response = await axios.get('http://localhost:8000/polo', {
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
                const response = await axios.get('http://localhost:8000/funcao', {
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
                const response = await axios.get('http://localhost:8000/perfil', {
                    headers: { Authorization: `${token}` }
                });
                const perfilData = response.data.data;

                const perfilOptions = perfilData.map(perfil => ({
                    value: perfil.perfilid,
                    label: perfil.descricao
                }));

                setPerfil(perfilOptions);
            } catch (error) {
                console.error('Erro ao buscar perfis:', error);
            }
        };

        fetchPerfil();
        fetchFuncao();
        fetchPolos();
        fetchDepartamentos();
    }, []);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validateForm = () => {
        let errors = {};

        if (!validateEmail(email)) {
            errors.emailError = true;
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

        return errors;
    };

    const handleEditUser = async () => {
        const errors = validateForm();
        setEmailError(errors.emailError || false);
        setPnomeError(errors.pnomeError || false);
        setUnomeError(errors.unomeError || false);
        setPassError(errors.passError || false);
        setPoloError(errors.poloError || false);
        setPerfilError(errors.perfilError || false);
        setDepartamentoError(errors.departamentoError || false);
        setFuncaoError(errors.funcaoError || false);

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
            const updatedUser = {
                poloid,
                perfilid,
                pnome,
                unome,
                email,
                passwd,
                departamentoid,
                funcaoid,
                sobre,
                inactivo,
                imagem
            };
            await axios.put(`http://localhost:8000/utilizadores/update/${userId}`, updatedUser, {
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json'
                },
            });
            console.log('Utilizador atualizado com sucesso');
            onClose();
            setAlertProps({ title: 'Sucesso', label: `O utilizador ${pnome} ${unome} foi atualizado com sucesso.`, severity: 'success' });
            setAlertOpen(true);
        } catch (error) {
            console.error('Erro ao atualizar utilizador:', error);
            setAlertProps({ title: 'Erro', label: `Ocorreu um erro ao atualizar o utilizador.`, severity: 'error' });
            setAlertOpen(true);
        }
    };

    const handleChangeAtivo = () => {
        setInactivo((prevInactivo) => !prevInactivo);
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
                    console.log('reader',reader);
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
        setPnomeError(false);
        setUnomeError(false);
        setPassError(false);
        setPoloError(false);
        setPerfilError(false);
        setDepartamentoError(false);
        setFuncaoError(false);
        onClose();
    };

    return (
        <Modal open={open} onClose={handleCancel}>
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '1000px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px', overflow: 'auto' }}>
                <h2 style={{ marginTop: 0, color: 'white' }}>Editar Utilizador</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ flex: '65%', paddingRight: 15 }}>
                            <div style={{ marginBottom: 15 }}>
                                <div style={{ display: 'flex', marginTop: 20, gap: 10 }}>
                                    <div style={{ width: "50%" }}>
                                        <BasicTextField caption='Primeiro Nome' valor={pnome} onchange={(e) => setPnome(e.target.value)} fullwidth={true} error={pnomeError}
                                            helperText={pnomeError ? "Introduza um nome válido" : ""} />
                                    </div>
                                    <div style={{ width: "50%" }}>
                                        <BasicTextField caption='Último Nome' valor={unome} onchange={(e) => setUnome(e.target.value)} fullwidth={true} type="text" error={unomeError}
                                            helperText={unomeError ? "Introduza um nome válido" : ""} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', marginTop: 20, gap: 10 }}>
                                    <BasicTextField caption='Email' valor={email} onchange={(e) => setEmail(e.target.value)} fullwidth={true} type="email" error={emailError}
                                        helperText={emailError ? "Introduza um e-mail válido" : ""} />
                                </div>
                                <div style={{ display: 'flex', marginTop: 20, gap: 10 }}>
                                    <BasicTextField caption='Senha' valor={passwd} onchange={(e) => setPasswd(e.target.value)} fullwidth={true} type="password" error={passError}
                                        helperText={passError ? "Introduza uma password válida" : ""} />
                                </div>
                                <div style={{ display: 'flex', marginTop: 20, gap: 10 }}>
                                    <div style={{ width: "50%" }}>
                                        <ComboBox caption='Polo' options={polos} value={poloid} handleChange={(e) => { setPoloid(e.target.value); setPoloError(false); }} error={poloError}
                                            helperText={poloError ? "Selecione um polo válido" : ""} />
                                    </div>
                                    <div style={{ width: "50%" }}>
                                        <ComboBox caption='Perfil' options={perfil} value={perfilid} handleChange={(e) => { setPerfilid(e.target.value); setPerfilError(false); }} error={perfilError}
                                            helperText={perfilError ? "Selecione um perfil válido" : ""} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', marginTop: 20, gap: 10 }}>
                                    <div style={{ width: "50%" }}>
                                        <ComboBox caption='Departamento' options={departamentos} value={departamentoid} handleChange={(e) => { setDepartamentoid(e.target.value); setDepartamentoError(false); }}
                                            error={departamentoError} helperText={departamentoError ? "Selecione um departamento válido" : ""} />
                                    </div>
                                    <div style={{ width: "50%" }}>
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
                                        sx={{ marginTop: '10px' }}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
                        <CancelButton onclick={handleCancel} caption='Cancelar' />
                        <SubmitButton onclick={handleEditUser} caption='Guardar' />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default EditUserModal;
