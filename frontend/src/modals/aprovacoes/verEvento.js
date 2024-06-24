import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import BasicTextField from '../../components/textFields/basic';
import DataHora from '../../components/textFields/dataHora';
import ComboBox from '../../components/combobox/comboboxBasic';
import CancelButton from '../../components/buttons/cancelButton';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import ImageTable from '../../components/tables/imageTable';
import axios from 'axios';

const VerEventModal = ({ open, onClose, eventoId}) => {
    const [titulo, setTitle] = useState('');
    const [localizacao, setLocalizacao] = useState('');
    const [descricao, setDescription] = useState('');
    const [nmrMaxParticipantes, setNumParticipantes] = useState('');
    const [dataInicio, setDataHoraInicio] = useState('');
    const [dataFim, setDataHoraFim] = useState('');
    const [dataLimInscricao, setDataLimInscricao] = useState('');
    const [cidadeID, setCidade] = useState(null);
    const [cidades, setCidades] = useState([]);
    const [distrito, setDistrito] = useState(null);
    const [distritos, setDistritos] = useState([]);
    const [poloId, setPolo] = useState('');
    const [polos, setPolos] = useState([]);
    const [error, setError] = useState(null);
    const [images, setImages] = useState([]);
    const [opcoesCat, setOpcoesCat] = useState([]);
    const [categoria, setCategoria] = useState(null);
    const [opcoesSubcat, setOpcoesSubcat] = useState([]);
    const [subcategoria, setSubcategoria] = useState(null);

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

    const fetchCategorias = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get(`http://localhost:8000/categoria`, {
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

    const fetchSubcategoria = async (idcat) => {
        try {
            if (idcat){
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
            }
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

    const handleDistritoChange = (event, newValue) => {
        setDistrito(newValue);
        setCidade(null);
        if (newValue) {
            fetchCidades(newValue.value);
        } else {
            setCidades([]);
        }
    };

    const fetchEventData = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get(`http://localhost:8000/evento/${eventoId}`, {
                headers: { Authorization: `${token}` }
            });
            const userData = response.data.data;

            setTitle(userData.titulo);
            setLocalizacao(userData.localizacao);
            setDescription(userData.descricao);
            setNumParticipantes(userData.nmrmaxparticipantes);
            setDataHoraInicio(dataFormatada(userData.datainicio));
            setDataHoraFim(dataFormatada(userData.datafim));
            setDataLimInscricao(dataFormatada(userData.dataliminscricao));
            setPolo(userData.poloid);

            const distrito = await fetchDistritoByCidadeId(userData.cidadeid);
            setDistrito(distrito);
            fetchCidades(distrito.value, userData.cidadeid);
            
            const catResponse = await axios.get(`http://localhost:8000/categoria/${userData.subcategoria.categoriaid}`, {
                headers: { Authorization: `${token}` }
            });
            const cat = catResponse.data;
            setCategoria({value: userData.subcategoria.categoriaid, label: cat.valorpt});
            fetchSubcategoria(userData.subcategoria.categoriaid);

            const subcatResponse = await axios.get(`http://localhost:8000/subcategoria/${userData.subcategoriaid}`, {
                headers: { Authorization: `${token}` }
            });
            const subcat = subcatResponse.data;
            setSubcategoria({value: userData.subcategoriaid, label: subcat.valorpt});
            
            const transformedImages = await Promise.all(
                userData.imagens.map(async (imagem) => {
                    const base64String = await getBase64FromUrl(imagem.url);
                    return {
                        src: base64String,
                        alt: imagem.name,
                        size: imagem.size,
                    };
                })
            );
            setImages(transformedImages);
        } catch (error) {
            console.error('Erro ao buscar dados do evento:', error);
        }
    };

    useEffect(() => {
        fetchDistritos();
        fetchPolos();
        fetchCategorias();
        fetchEventData();
    }, [eventoId]);

    const handleEditEvent = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const eventoEditado = {
                titulo,
                descricao,
                dataInicio,
                dataFim,
                dataLimInscricao,
                nmrMaxParticipantes,
                localizacao,
                latitude: 0,
                longitude: 0,
                cidadeID: cidadeID.value,
                subcategoriaId: subcategoria.value,
                poloId,
            };
            await axios.put(`http://localhost:8000/evento/update/${eventoId}`, eventoEditado, {
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

    const dataFormatada = (dateTimeString) => {
        const date = new Date(dateTimeString);
        const pad = (num) => num.toString().padStart(2, '0');
        const formatted = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours()+ 1)}:${pad(date.getMinutes())}`;
        return formatted;
    };

    return (
        <Modal open={open} onClose={onClose}>
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '1000px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px', overflow: 'auto' }}>
                <h2 style={{ marginTop: 0, color: 'white' }}>Ver Evento</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12 }}>
                    <div style={{ marginBottom: 15 }}>
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                            <div style={{ width: '40%' }}>
                                <BasicTextField caption='Titulo' valor={titulo} onchange={(e) => setTitle(e.target.value)} fullwidth={true} disabled={true} />
                            </div>
                            <div style={{ width: '33.9%' }}>
                                <BasicTextField caption='Localização' valor={localizacao} onchange={(e) => setLocalizacao(e.target.value)} fullwidth={true} disabled={true} />
                            </div>
                            <div style={{ width: '25%' }}>
                                <BasicTextField caption='Nº Participantes Máximo' type='number' valor={nmrMaxParticipantes} onchange={(e) => setNumParticipantes(e.target.value)} fullwidth={true} disabled={true} />
                            </div>
                        </div>
                        <div style={{ marginBottom: 20 }}></div>
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                            <div style={{ width: '74.5%' }}>
                                <BasicTextField caption='Descrição' valor={descricao} onchange={(e) => setDescription(e.target.value)} fullwidth={true} disabled={true} />
                            </div>
                            <div style={{ width: '24.9%' }}>
                                <ComboBox caption='Polo' options={polos} value={poloId} handleChange={(e) => setPolo(e.target.value)} disabled={true} />
                            </div>
                        </div>
                        <div style={{ marginBottom: 20 }}></div>
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                            <div style={{ width: '32.9%' }}>
                                <DataHora caption="Data e Hora Início" value={dataInicio} onChange={(newValue) => setDataHoraInicio(newValue)} fullwidth={true} disabled={true} />
                            </div>
                            <div style={{ width: '33%' }}>
                                <DataHora caption="Data e Hora Fim" value={dataFim} onChange={(newValue) => setDataHoraFim(newValue)} fullwidth={true} disabled={true} />
                            </div>
                            <div style={{ width: '33%' }}>
                                <DataHora caption="Data Limite de Inscrição" value={dataLimInscricao} onChange={(newValue) => setDataLimInscricao(newValue)} fullwidth={true} disabled={true} />
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
                                    disabled={true}
                                />
                            </div>
                            <div style={{ width: '23.4%' }}>
                                <Autocomplete
                                    options={cidades}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => <TextField {...params} label="Cidade" variant="outlined" />}
                                    value={cidadeID}
                                    onChange={(event, newValue) => { setCidade(newValue); }}
                                    fullWidth={true}
                                    disabled={true}
                                />
                            </div>
                            <div style={{ width: '25%' }}>
                                <Autocomplete
                                    options={opcoesCat}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => <TextField {...params} label="Categoria" variant="outlined" />}
                                    value={categoria}
                                    onChange={handleCategoriaChange}
                                    fullWidth={true}
                                    disabled={true}
                                />
                            </div>
                            <div style={{ width: '25%' }}>
                                <Autocomplete
                                    options={opcoesSubcat}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => <TextField {...params} label="Subcategoria" variant="outlined" />}
                                    value={subcategoria}
                                    onChange={(event, newValue) => { setSubcategoria(newValue); }}
                                    fullWidth={true}
                                    disabled={true}
                                />
                            </div>
                        </div>
                        <div style={{ marginBottom: 20 }}></div>
                        <ImageTable images={images} onAddImage={() => {}} onDelete={() => {}} canModify={false} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        <CancelButton onclick={() => { onClose(); }} caption='Voltar' />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default VerEventModal;
