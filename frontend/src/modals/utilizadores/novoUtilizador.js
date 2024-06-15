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

const AddUserModal = ({ open, onClose, setAlertOpen, setAlertProps }) => {
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
    const [emailError, setEmailError] = useState(false);
    const [pnomeError, setPnomeError] = useState(false);
    const [unomeError, setUnomeError] = useState(false);

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
                console.log(departamentosOptions);
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
                console.log(polosOptions);
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
                console.log(funcaoData);
                const funcaoOptions = funcaoData.map(funcao => ({
                    value: funcao.funcaoid,
                    label: funcao.valorpt
                }));

                setFuncao(funcaoOptions);
                console.log(funcaoOptions);
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
                console.log(perfilData);
                const perfilOptions = perfilData.map(perfil => ({
                    value: perfil.perfilid,
                    label: perfil.descricao
                }));

                setPerfil(perfilOptions);
                console.log(perfilOptions);
            } catch (error) {
                console.error('Erro ao buscar funções:', error);
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

        return errors;
    };

    const handleAddUser = async () => {
        const errors = validateForm();

        setEmailError(errors.emailError || false);
        setPnomeError(errors.pnomeError || false);
        setUnomeError(errors.unomeError || false);

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
                poloid,
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
                imagem
            };
            await axios.post('http://localhost:8000/utilizadores/add', newUser, {
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

    const resetForm = () => {
        setPoloid('');
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
        onClose();
    };
    return (
        <Modal open={open} onClose={onClose}>
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '1000px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px', overflow: 'auto' }}>
                <h2 style={{ marginTop: 0, color: 'white' }}>Novo Utilizador</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ flex: '65%', paddingRight: 15 }}>
                            <div style={{ marginBottom: 15 }}>
                                <div style={{ display: 'flex', marginTop: 20, gap: 10 }}>
                                    <div style={{ width: "50%" }} >
                                        <BasicTextField caption='Primeiro Nome' valor={pnome} onchange={(e) => setPnome(e.target.value)} fullwidth={true} type="text" error={pnomeError}
                                            helperText={pnomeError ? "Introduza um nome válido" : ""} />
                                    </div>
                                    <div style={{ width: "50%" }} >
                                        <BasicTextField caption='Último Nome' valor={unome} onchange={(e) => setUnome(e.target.value)} fullwidth={true} type="text" error={unomeError}
                                            helperText={unomeError ? "Introduza um nome válido" : ""} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', marginTop: 20, gap: 10 }}>
                                    <BasicTextField caption='Email' valor={email} onchange={(e) => setEmail(e.target.value)} fullwidth={true} type="email" error={emailError}
                                        helperText={emailError ? "Endereço de e-mail inválido." : ""} />
                                </div>
                                <div style={{ display: 'flex', marginTop: 20, gap: 10 }}>
                                    <BasicTextField caption='Senha' valor={passwd} onchange={(e) => setPasswd(e.target.value)} fullwidth={true} type="password" />
                                </div>
                                <div style={{ display: 'flex', marginTop: 20, gap: 10 }}>
                                    <div style={{ width: "50%" }}>
                                        <ComboBox caption='Polo' options={polos} value={poloid} handleChange={(e) => setPoloid(e.target.value)} />
                                    </div>
                                    <div style={{ width: "50%" }}>
                                        <ComboBox caption='Perfil' options={perfil} value={perfilid} handleChange={(e) => setPerfilid(e.target.value)} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', marginTop: 20, gap: 10 }}>
                                    <div style={{ width: "50%" }}>
                                        <ComboBox caption='Departamento' options={departamentos} value={departamentoid} handleChange={(e) => setDepartamentoid(e.target.value)} />
                                    </div>
                                    <div style={{ width: "50%" }} >
                                        <ComboBox caption='Função' options={funcao} value={funcaoid} handleChange={(e) => setFuncaoid(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <div style={{ padding: '20px' }}>
                                <div style={{ paddingLeft: '5%' }}>
                                    <InputImage image={image} onAddImage={handleImage} onChange={handleImage} />
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
