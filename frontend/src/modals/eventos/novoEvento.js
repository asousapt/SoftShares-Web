import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import BasicTextField from '../../components/textFields/basic';
import DataHora from '../../components/textFields/dataHora';
import SubmitButton from '../../components/buttons/submitButton';
import CancelButton from '../../components/buttons/cancelButton';
import ImageTable from '../../components/tables/imageTable';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import axios from 'axios';

const imgs = [];

const AddEventModal = ({ open, onClose }) => {
    const [title, setTitle] = useState('');
    const [localizacao, setLocalizacao] = useState('');
    const [description, setDescription] = useState('');
    const [numParticipantes, setNumParticipantes] = useState('');
    const [numConvidados, setNumConvidados] = useState('');
    const [dataHoraInicio, setDataHoraInicio] = useState('');
    const [dataHoraFim, setDataHoraFim] = useState('');
    const [dataLimInscricao, setDataLimInscricao] = useState('');
    const [cidade, setCidade] = useState(null);
    const [cidades, setCidades] = useState([]);
    const [distrito, setDistrito] = useState(null);
    const [distritos, setDistritos] = useState([]);
    const [polo, setPolo] = useState(null);
    const [polos, setPolos] = useState([]);
    const [categoria, setCategoria] = useState(null);
    const [opcoesFiltroCat, setOpcoesCat] = useState([]);
    const [subcategoria, setSubcategoria] = useState(null);
    const [opcoesFiltroSubcat, setOpcoesSubcat] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
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

        const fetchCategorias = async () => {
            try {
                const token = 'tokenFixo';
                const response = await axios.get('http://localhost:8000/categoria', {
                    headers: { Authorization: `${token}` }
                });
                const categorias = response.data;
                const categoriasOptions = categorias.map((cat) => ({
                    value: cat.categoriaid,
                    label: cat.valorpt
                }));
                setOpcoesCat(categoriasOptions);
            } catch (error) {
                setError(error);
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
            } catch (error) {
                console.error('Erro ao buscar polos:', error);
            }
        };

        fetchPolos();
        fetchDistritos();
        fetchCategorias();
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

    const handleCategoriaChange = async (event, newValue) => {
        setCategoria(newValue);
        setSubcategoria(null);
        if (newValue) {
            try {
                const token = 'tokenFixo';
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

    const handleAddEvent = async () => {
        try {
            const token = 'tokenFixo';
            const novoEvento = {
                titulo: title,
                descricao: description,
                dataInicio: dataHoraInicio,
                dataFim: dataHoraFim,
                dataLimInscricao: dataLimInscricao,
                nmrMaxParticipantes: numParticipantes,
                localizacao: localizacao,
                latitude: 0,
                longitude: 0,
                cidadeID: cidade ? cidade.value : '',
                utilizadorCriou: 14,
                subcategoriaId: subcategoria ? subcategoria.value : '',
                poloId: polo ? polo.value : '',
            };
            await axios.post('http://localhost:8000/evento/add', novoEvento, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                }
            });
            onClose();
        } catch (error) {
            console.error('Erro ao adicionar evento:', error);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '1000px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px', overflow: 'auto' }}>
                <h2 style={{ marginTop: 0, color: 'white' }}>Novo Evento</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12 }}>
                    <div style={{ marginBottom: 15 }}>
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                            <div style={{ width: '40%' }}>
                                <BasicTextField caption='Titulo' valor={title} onchange={(e) => setTitle(e.target.value)} fullwidth={true} />
                            </div>
                            <div style={{ width: '33.9%' }}>
                                <BasicTextField caption='Localização' valor={localizacao} onchange={(e) => setLocalizacao(e.target.value)} fullwidth={true} />
                            </div>
                            <div style={{ width: '25%' }}>
                                <BasicTextField caption='Nº Participantes Máximo' type='number' valor={numParticipantes} onchange={(e) => setNumParticipantes(e.target.value)} fullwidth={true} />
                            </div>
                        </div>
                        <div style={{ marginBottom: 20 }}></div>
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                            <div style={{ width: '74.5%' }}>
                                <BasicTextField caption='Descrição' valor={description} onchange={(e) => setDescription(e.target.value)} fullwidth={true} />
                            </div>
                            <div style={{ width: '24.9%' }}>
                                <Autocomplete
                                    options={polos}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => <TextField {...params} label="Polo" variant="outlined" />}
                                    value={polo}
                                    onChange={(event, newValue) => { setPolo(newValue); }}
                                    fullWidth={true}
                                />
                            </div>
                        </div>
                        <div style={{ marginBottom: 20 }}></div>
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                            <div style={{ width: '32.9%' }}>
                                <DataHora caption="Data e Hora Início" value={dataHoraInicio} onChange={(newValue) => setDataHoraInicio(newValue)} fullwidth={true} />
                            </div>
                            <div style={{ width: '33%' }}>
                                <DataHora caption="Data e Hora Fim" value={dataHoraFim} onChange={(newValue) => setDataHoraFim(newValue)} fullwidth={true} />
                            </div>
                            <div style={{ width: '33%' }}>
                                <DataHora caption="Data Limite de Inscrição" value={dataLimInscricao} onChange={(newValue) => setDataLimInscricao(newValue)} fullwidth={true} />
                            </div>
                        </div>
                        <div style={{ marginBottom: 20 }}></div>
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                            <div style={{ width: '25%' }}>
                                <Autocomplete
                                    options={distritos}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => <TextField {...params} label="Distrito" variant="outlined" />}
                                    value={distrito}
                                    onChange={handleDistritoChange}
                                    fullWidth={true}
                                />
                            </div>
                            <div style={{ width: '23.4%' }}>
                                <Autocomplete
                                    options={cidades}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => <TextField {...params} label="Cidade" variant="outlined" />}
                                    value={cidade}
                                    onChange={(event, newValue) => { setCidade(newValue); }}
                                    fullWidth={true}
                                />
                            </div>
                            <div style={{ width: '25%' }}>
                                <Autocomplete
                                    options={opcoesFiltroCat}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => <TextField {...params} label="Categoria" variant="outlined" />}
                                    value={categoria}
                                    onChange={handleCategoriaChange}
                                    fullWidth={true}
                                />
                            </div>
                            <div style={{ width: '25%' }}>
                                <Autocomplete
                                    options={opcoesFiltroSubcat}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => <TextField {...params} label="Subcategoria" variant="outlined" />}
                                    value={subcategoria}
                                    onChange={(event, newValue) => { setSubcategoria(newValue); }}
                                    fullWidth={true}
                                />
                            </div>
                        </div>
                        <ImageTable images={imgs} styleProp={{ paddingTop: 10 }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        <CancelButton onclick={onClose} caption='Cancelar' />
                        <SubmitButton onclick={handleAddEvent} caption='Guardar' />
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default AddEventModal;
