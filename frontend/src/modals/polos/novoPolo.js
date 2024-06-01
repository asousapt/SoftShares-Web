import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import BasicTextField from '../../components/textFields/basic';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import InputImage from '../../components/image/imageInput';
import SubmitButton from '../../components/buttons/submitButton';
import CancelButton from '../../components/buttons/cancelButton';
import axios from 'axios';

const NovoPolo = ({ open, onClose }) => {
    const [descricao, setDescricao] = useState('');
    const [morada, setMorada] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [responsavel, setResponsavel] = useState(null);
    const [image, setImage] = useState('https://blog.even3.com.br/wp-content/uploads/2016/12/regra-de-ouro-para-a-organizaao-de-equipes-em-eventos-dividir-para-conquistar.png');
    const [cidade, setCidade] = useState(null);
    const [cidades, setCidades] = useState([]);
    const [distrito, setDistrito] = useState(null);
    const [distritos, setDistritos] = useState([]);
    const [utilizadores, setUtilizadores] = useState([]);

    useEffect(() => {
        const fetchUtilizadores = async () => {
            try {
                const token = 'tokenFixo';
                const response = await axios.get('http://localhost:8000/utilizadores', {
                    headers: { Authorization: `${token}` }
                });
                const utilizadorData = response.data.data;
                const utilizadorOptions = utilizadorData.map(utilizador => ({
                    value: utilizador.utilizadorid,
                    label: utilizador.pnome + ' ' + utilizador.unome
                }));
                setUtilizadores(utilizadorOptions);
            } catch (error) {
                console.error('Erro ao buscar utilizadores:', error);
            }
        };

        const fetchDistritos = async () => {
            try {
                const token = 'tokenFixo';
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

        fetchUtilizadores();
        fetchDistritos();
    }, []);

    const fetchCidades = async (distritoId) => {
        try {
            const token = 'tokenFixo';
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

        const handleAddEvent = async () => {
            try {
                const token = 'tokenFixo';
                const novoPolo = {
                    descricao: descricao,
                    morada: morada,
                    email: email,
                    telefone: telefone,
                    coordenador: responsavel.value,
                    cidadeID: cidade.value
                };

                console.log(JSON.stringify(novoPolo, null, 2));

                await axios.post('http://localhost:8000/polo/add', novoPolo, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                console.log();
                console.log('Evento Adicionado');
                onClose();
            } catch (error) {
                console.error('Erro ao adicionar evento:', error);
            }
        };
        
    return (
        <Modal open={open} onClose={onClose} >
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '1000px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px', overflow: 'auto' }}>
                <h2 style={{ marginTop: 0, color: 'white' }}>Novo Polo</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12 }}>
                    <div style={{ marginBottom: 15 }}>
                        <BasicTextField caption='Descrição' valor={descricao} onchange={(e) => setDescricao(e.target.value)} fullwidth={true} />
                        <div style={{ display: 'flex', marginTop: 20, gap: 5 }}>
                            <div style={{ width: '50%' }}>
                                <Autocomplete
                                    options={distritos}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => <TextField {...params} label="Distrito" variant="outlined" />}
                                    value={distrito}
                                    onChange={handleDistritoChange}
                                    fullWidth={true}
                                />
                            </div>
                            <div style={{ width: '50%' }}>
                                <Autocomplete
                                    options={cidades}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => <TextField {...params} label="Cidade" variant="outlined" />}
                                    value={cidade}
                                    onChange={(event, newValue) => { setCidade(newValue); }}
                                    fullWidth={true}
                                />
                            </div>
                        </div>
                        <div style={{ marginTop: 20 }}>
                            <BasicTextField caption='Morada' valor={morada} onchange={(e) => setMorada(e.target.value)} fullwidth={true} />
                        </div>
                        <div style={{ display: 'flex', marginTop: 20, gap: 5 }}>
                            <div style={{ width: '34%' }}>
                                <BasicTextField caption='Email' valor={email} onchange={(e) => setEmail(e.target.value)} fullwidth={true} />
                            </div>
                            <div style={{ width: '25%' }}>
                                <BasicTextField caption='Telefone' valor={telefone} onchange={(e) => setTelefone(e.target.value)} fullwidth={true} />
                            </div>
                            <div style={{ width: '40%' }}>
                                <Autocomplete
                                    options={utilizadores}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => <TextField {...params} label="Responsável" variant="outlined" />}
                                    value={responsavel}
                                    onChange={(event, newValue) => { setResponsavel(newValue); }}
                                    fullWidth={true}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
                            <InputImage image={image} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        <CancelButton onclick={() => { onClose(); }} caption='Cancelar' />
                        <SubmitButton onclick={handleAddEvent} caption='Guardar' />
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default NovoPolo;
