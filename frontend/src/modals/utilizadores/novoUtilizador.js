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

const AddUserModal = ({ open, onClose }) => {
    const [poloid, setPoloid] = useState('');
    const [perfilid, setPerfilid] = useState('');
    const [pnome, setPnome] = useState('');
    const [unome, setUnome] = useState('');
    const [email, setEmail] = useState('');
    const [passwd, setPasswd] = useState('');
    const [idiomaid, setIdiomaid] = useState('');
    const [departamentoid, setDepartamentoid] = useState('');
    const [departamentos, setDepartamentos] = useState([]);
    const [polos, setPolos] = useState([]);
    const [funcao, setFuncao] = useState([]);
    const [perfil, setPerfil] = useState([]);
    const [funcaoid, setFuncaoid] = useState('');
    const [sobre, setSobre] = useState('');
    const [ativo, setAtivo] = useState(true);
    const [image, setImage] = useState('https://i0.wp.com/ctmirror-images.s3.amazonaws.com/wp-content/uploads/2021/01/dummy-man-570x570-1.png?fit=570%2C570&ssl=1');

    useEffect(() => {
        const fetchDepartamentos = async () => {
            try {
                const token = 'tokenFixo';
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
                const token = 'tokenFixo';
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
                const token = 'tokenFixo';
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
                const token = 'tokenFixo';
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

    const handleAddUser = async () => {
        try {
            const token = 'tokenFixo';
            const newUser = {
                poloid,
                perfilid,
                pnome,
                unome,
                email,
                passwd,
                chavesalt: '',
                idiomaid: 1,
                departamentoid,
                funcaoid,
                sobre,
                ativo
            };
            console.log(JSON.stringify(newUser));
            await axios.post('http://localhost:8000/utilizadores/add', newUser, {
                headers: { 
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json' 
                },
                data: JSON.stringify(newUser)
            });
            console.log('Utilizador Adicionado com sucesso');
            onClose();
        } catch (error) {
            console.error('Erro ao adicionar utilizador:', error);
        }
    };

    const handleChangeAtivo = () => {
        setAtivo(!ativo);
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
                                        <BasicTextField caption='Primeiro Nome' valor={pnome} onchange={(e) => setPnome(e.target.value)} fullwidth={true} />
                                    </div>
                                    <div style={{ width: "50%" }} >
                                        <BasicTextField caption='Último Nome' valor={unome} onchange={(e) => setUnome(e.target.value)} fullwidth={true} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', marginTop: 20, gap: 10 }}>
                                    <BasicTextField caption='Email' valor={email} onchange={(e) => setEmail(e.target.value)} fullwidth={true} />
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
                                    <InputImage image={image} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <FormControlLabel labelPlacement="start" control={<Switch checked={ativo} onChange={handleChangeAtivo} />} label="Inativo" sx={{ marginTop: '10px' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
                        <CancelButton onclick={onClose} caption='Cancelar' />
                        <SubmitButton onclick={handleAddUser} caption='Guardar' />
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default AddUserModal;
