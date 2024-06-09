import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import BasicTextField from '../../components/textFields/basic';
import DataHora from '../../components/textFields/dataHora';
import SubmitButton from '../../components/buttons/submitButton';
import ComboBox from '../../components/combobox/comboboxBasic';
import CancelButton from '../../components/buttons/cancelButton';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import InputImage from '../../components/image/imageInput';
import axios from 'axios';

const EditEventModal = ({ open, onClose, eventData }) => {
    const [titulo, setTitle] = useState('');
    const [localizacao, setLocalizacao] = useState('');
    const [descricao, setDescription] = useState('');
    const [numParticipantes, setNumParticipantes] = useState('');
    const [dataInicio, setDataHoraInicio] = useState('');
    const [dataFim, setDataHoraFim] = useState('');
    const [dataLimInscricao, setDataLimInscricao] = useState('');
    const [cidade, setCidade] = useState(null);
    const [cidades, setCidades] = useState([]);
    const [distrito, setDistrito] = useState(null);
    const [distritos, setDistritos] = useState([]);
    const [poloid, setPolo] = useState('');
    const [polos, setPolos] = useState([]);
    const [categoria, setCategoria] = useState(null);
    const [opcoesFiltroCat, setOpcoesCat] = useState([]);
    const [subcategoria, setSubcategoria] = useState(null);
    const [opcoesFiltroSubcat, setOpcoesSubcat] = useState([]);
    const [error, setError] = useState(null);
    const [image, setImage] = useState('https://i0.wp.com/ctmirror-images.s3.amazonaws.com/wp-content/uploads/2021/01/dummy-man-570x570-1.png?fit=570%2C570&ssl=1');

    const fetchSubcategorias = async (idcat) => {
        if (idcat){
            try {
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
            } catch (error) {
                setError(error);
            }
        }
    }

    const fetchCategorias = async () => {
        try {
            const token = sessionStorage.getItem('token');
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

    const fetchEventData = async () => {
        if (open) {
            try {
                const token = sessionStorage.getItem('token');
                const response = await axios.get(`http://localhost:8000/evento/${eventData}`, {
                    headers: { Authorization: `${token}` }
                });
                const userData = response.data.data;
                
                setTitle(userData.titulo);
                setLocalizacao(userData.localizacao);
                setDescription(userData.descricao);
                setNumParticipantes(userData.nmrmaxparticipantes);
                setDataHoraInicio(userData.datainicio);
                setDataHoraFim(userData.datafim);
                setDataLimInscricao(userData.dataliminscricao);
                setPolo(userData.poloid);

                const distrito = await fetchDistritoByCidadeId(userData.cidadeid);
                setDistrito(distrito);
                fetchCidades(distrito.value, userData.cidadeid);
                
                setCategoria(opcoesFiltroCat.find(cat => cat.value === userData.subcategoria.categoriaid));//{ value: categoria.categoriaid, label: categoria.valorpt });
                fetchSubcategorias(userData.subcategoria.categoriaid);
                setSubcategoria(opcoesFiltroSubcat.find(subcat => subcat.value === userData.subcategoria.subcategoriaid));//{ value: userData.subcategoriaid, label: userData.subcategoria.valorpt });
            } catch (error) {
                console.error('Erro ao buscar dados do evento:', error);
            }
        }
    };

    useEffect(() => {
        fetchPolos();
        fetchCategorias();
        fetchEventData();
        console.log('categoria',categoria);
    }, [eventData, open]);

        const fetchDistritoByCidadeId = async (cidadeId) => {
            const token = sessionStorage.getItem('token');
            const response = await axios.get(`http://localhost:8000/cidades/${cidadeId}/distrito`, {
                headers: { Authorization: `${token}` }
            });
            const distritoData = response.data.data;
            return { value: distritoData.distritoid, label: distritoData.nome };
        };

    const fetchCidades = async (distritoId, cidadeId) => {
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

    const handleCategoriaChange = async (event, newValue) => {
        setCategoria(newValue);
        setSubcategoria(null);
        if (newValue) {
            fetchSubcategorias(newValue.value);
            // try {
            //     const token = sessionStorage.getItem('token');
            //     const response = await axios.get(`http://localhost:8000/subcategoria/categoria/${newValue.value}`, {
            //         headers: { Authorization: `${token}` }
            //     });
            //     const subcategorias = response.data;
            //     const subcategoriasOptions = subcategorias.map((subcat) => ({
            //         value: subcat.subcategoriaid,
            //         label: subcat.valorpt
            //     }));
            //     setOpcoesSubcat(subcategoriasOptions);
            // } catch (error) {
            //     setError(error);
            // }
        } else {
            setOpcoesSubcat([]);
            setSubcategoria(null);
        }
    };

    const handleEditEvent = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const eventoEditado = {
                titulo,
                descricao,
                dataInicio,
                dataFim,
                dataLimInscricao,
                numParticipantes,
                localizacao,
                latitude: 0,
                longitude: 0,
                cidade,
                subcategoria,
                poloid,
            };
            await axios.put(`http://localhost:8000/evento/${eventData.id}`, eventoEditado, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                }
            });
            onClose();
        } catch (error) {
            console.error('Erro ao editar evento:', error);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '1000px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px', overflow: 'auto' }}>
                <h2 style={{ marginTop: 0, color: 'white' }}>Editar Evento</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12 }}>
                    <div style={{ marginBottom: 15 }}>
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                            <div style={{ width: '40%' }}>
                                <BasicTextField caption='Titulo' valor={titulo} onchange={(e) => setTitle(e.target.value)} fullwidth={true} />
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
                                <BasicTextField caption='Descrição' valor={descricao} onchange={(e) => setDescription(e.target.value)} fullwidth={true} />
                            </div>
                            <div style={{ width: '24.9%' }}>
                                <ComboBox caption='Polo' options={polos} value={poloid} handleChange={(e) => setPolo(e.target.value)} />
                            </div>
                        </div>
                        <div style={{ marginBottom: 20 }}></div>
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                            <div style={{ width: '32.9%' }}>
                                <DataHora caption="Data e Hora Início" value={dataInicio} onChange={(newValue) => setDataHoraInicio(newValue)} fullwidth={true} />
                            </div>
                            <div style={{ width: '33%' }}>
                                <DataHora caption="Data e Hora Fim" value={dataFim} onChange={(newValue) => setDataHoraFim(newValue)} fullwidth={true} />
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
                        <div style={{ marginBottom: 20 }}></div>
                        <InputImage image={image} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        <SubmitButton onClick={handleEditEvent} caption='Guardar' />
                        <CancelButton onClick={onClose} caption='Cancelar' />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default EditEventModal;
