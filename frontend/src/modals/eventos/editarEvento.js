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

const EditEventModal = ({ open, onClose, eventData, setAlertOpen, setAlertProps  }) => {
    //VARS
    //FIELDS
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
    const [image, setImage] = useState('https://i0.wp.com/ctmirror-images.s3.amazonaws.com/wp-content/uploads/2021/01/dummy-man-570x570-1.png?fit=570%2C570&ssl=1');
    const [opcoesCat, setOpcoesCat] = useState([]);
    const [categoria, setCategoria] = useState(null);
    const [opcoesSubcat, setOpcoesSubcat] = useState([]);
    const [subcategoria, setSubcategoria] = useState(null);

    //ERRORS
    const [titleError, setTitleError] = useState(false);
    const [localizacaoError, setLocalizacaoError] = useState(false);
    const [descError, setDescError] = useState(false);
    const [distritoError, setDistritoError] = useState(false);
    const [cidadeError, setCidadeError] = useState(false);
    const [categoriaError, setCategoriaError] = useState(false);
    const [subcategoriaError, setSubcategoriaError] = useState(false);
    const [poloError, setPoloError] = useState(false);
    const [dataHoraInicioError, setDataHoraInicioError] = useState(false);
    const [dataHoraFimError, setDataHoraFimError] = useState(false);
    const [dataLimInscricaoError, setDataLimInscricaoError] = useState(false);
    const [numParticipantesError, setNumParticipantesError] = useState(false);

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
                const response = await axios.get(`http://localhost:8000/evento/${eventData}`, {
                    headers: { Authorization: `${token}` }
                });
                const userData = response.data.data;
                console.log(userData);

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
            } catch (error) {
                console.error('Erro ao buscar dados do evento:', error);
            }
    };

    useEffect(() => {
        fetchDistritos();
        fetchPolos();
        fetchCategorias();
        fetchEventData();
    }, [eventData]);

    const validateForm = () => {
        let errors = {};

        if (!titulo) {
            errors.titleError = true;
        }
        if (!localizacao) {
            errors.localizacaoError = true;
        }
        if (!descricao) {
            errors.descError = true;
        }
        if (!distrito) {
            errors.distritoError = true;
        }
        if (!cidadeID) {
            errors.cidadeError = true;
        }
        if (!categoria) {
            errors.categoriaError = true;
        }
        if (!subcategoria) {
            errors.subcategoriaError = true;
        }
        if (!polos) {
            errors.poloError = true;
        }
        if (!dataInicio) {
            errors.dataHoraInicioError = true;
        }
        if (!dataFim) {
            errors.dataHoraFimError = true;
        }
        if (!dataLimInscricao) {
            errors.dataLimInscricaoError = true;
        }
        if (!nmrMaxParticipantes) {
            errors.numParticipantesError = true;
        }

        return errors;
    };

    const handleEditEvent = async () => {
        const errors = validateForm();
        setTitleError(errors.titleError || false);
        setLocalizacaoError(errors.localizacaoError || false);
        setDescError(errors.descError || false);
        setDistritoError(errors.distritoError || false);
        setCidadeError(errors.cidadeError || false);
        setCategoriaError(errors.categoriaError || false);
        setSubcategoriaError(errors.subcategoriaError || false);
        setPoloError(errors.poloError || false);
        setDataHoraInicioError(errors.dataHoraInicioError || false);
        setDataHoraFimError(errors.dataHoraFimError || false);
        setDataLimInscricaoError(errors.dataLimInscricaoError || false);
        setNumParticipantesError(errors.numParticipantesError || false);

        if (Object.keys(errors).length > 0) {
            return;
        }

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
            console.log('edit:', eventoEditado);
            await axios.put(`http://localhost:8000/evento/update/${eventData}`, eventoEditado, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                }
            });
            onClose();
            setAlertProps({ title: 'Sucesso', label: `Evento editado com sucesso`, severity: 'success' });
            setAlertOpen(true);
        } catch (error) {
            console.error('Erro ao editar evento:', error);
            setAlertProps({ title: 'Erro', label: `Ocorreu um erro ao editar o evento.`, severity: 'error' });
            setAlertOpen(true);
        }
    };

    const dataFormatada = (dateTimeString) => {
        const date = new Date(dateTimeString);
        const pad = (num) => num.toString().padStart(2, '0');
        const formatted = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours()+ 1)}:${pad(date.getMinutes())}`;
        return formatted;
    };

    const handleCancel = () => {
        setTitleError(false);
        setLocalizacaoError(false);
        setDescError(false);
        setDistritoError(false);
        setCidadeError(false);
        setCategoriaError(false);
        setSubcategoriaError(false);
        setPoloError(false);
        setDataHoraInicioError(false);
        setDataHoraFimError(false);
        setDataLimInscricaoError(false);
        setNumParticipantesError(false);
        onClose();
    };

    return (
        <Modal open={open} onClose={handleCancel}>
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '1000px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px', overflow: 'auto' }}>
                <h2 style={{ marginTop: 0, color: 'white' }}>Editar Evento</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12 }}>
                    <div style={{ marginBottom: 15 }}>
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                            <div style={{ width: '40%' }}>
                                <BasicTextField caption='Titulo' valor={titulo} onchange={(e) => setTitle(e.target.value)} fullwidth={true} type="text" error={titleError}
                            helperText={titleError ? "Introduza um título válido" : ""} />
                            </div>
                            <div style={{ width: '33.9%' }}>
                                <BasicTextField caption='Localização' valor={localizacao} onchange={(e) => setLocalizacao(e.target.value)} fullwidth={true} type="text" error={localizacaoError}
                            helperText={localizacaoError ? "Introduza uma localização válida" : ""} />
                            </div>
                            <div style={{ width: '25%' }}>
                                <BasicTextField caption='Nº Participantes Máximo' type='number' valor={nmrMaxParticipantes} onchange={(e) => setNumParticipantes(e.target.value)} fullwidth={true} error={numParticipantesError}
                            helperText={numParticipantesError ? "Introduza um nº válido" : ""} />
                            </div>
                        </div>
                        <div style={{ marginBottom: 20 }}></div>
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                            <div style={{ width: '74.5%' }}>
                                <BasicTextField caption='Descrição' valor={descricao} onchange={(e) => setDescription(e.target.value)} fullwidth={true} type="text" error={descError}
                            helperText={descError ? "Introduza uma descrição válida" : ""} />
                            </div>
                            <div style={{ width: '24.9%' }}>
                                <ComboBox caption='Polo' options={polos} value={poloId} handleChange={(e) => { setPolo(e.target.value); setPoloError(false); }} error={poloError}
                                    helperText={poloError ? "Selecione um polo" : ""} />
                            </div>
                        </div>
                        <div style={{ marginBottom: 20 }}></div>
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                            <div style={{ width: '32.9%' }}>
                                <DataHora caption="Data e Hora Início" value={dataInicio} onChange={(newValue) => setDataHoraInicio(newValue)} fullwidth={true} error={dataHoraInicioError}
                            helperText={dataHoraInicioError ? "Introduza uma data e hora válida" : ""} />
                            </div>
                            <div style={{ width: '33%' }}>
                                <DataHora caption="Data e Hora Fim" value={dataFim} onChange={(newValue) => setDataHoraFim(newValue)} fullwidth={true} error={dataHoraFimError}
                            helperText={dataHoraFimError ? "Introduza uma data e hora válida" : ""} />
                            </div>
                            <div style={{ width: '33%' }}>
                                <DataHora caption="Data Limite de Inscrição" value={dataLimInscricao} onChange={(newValue) => setDataLimInscricao(newValue)} fullwidth={true} error={dataLimInscricaoError}
                            helperText={dataLimInscricaoError ? "Introduza uma data e hora válida" : ""} />
                            </div>
                        </div>
                        <div style={{ marginBottom: 20 }}></div>
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                            <div style={{ width: '25%' }}>
                                <Autocomplete options={distritos} getOptionLabel={(option) => option.label} renderInput={(params) => (
                                        <TextField {...params} label="Distrito" variant="outlined" type="text" error={distritoError} helperText={distritoError ? "Escolha um distrito" : ""} /> )}
                                    value={distrito}
                                    onChange={handleDistritoChange}
                                    fullWidth={true} />
                            </div>
                            <div style={{ width: '23.4%' }}>
                                <Autocomplete options={cidades} getOptionLabel={(option) => option.label} renderInput={(params) => (
                                    <TextField {...params} label="Cidade" variant="outlined" error={cidadeError} helperText={cidadeError ? "Escolha uma cidade" : ""} />)}
                                    value={cidadeID}
                                    onChange={(event, newValue) => { setCidade(newValue); setCidadeError(false); }}
                                    fullWidth={true} />
                            </div>
                            <div style={{ width: '25%' }}>
                                <Autocomplete options={opcoesCat} getOptionLabel={(option) => option.label} renderInput={(params) => (
                                        <TextField {...params} label="Categoria" variant="outlined" type="text" error={categoriaError} helperText={categoriaError ? "Escolha uma categoria" : ""} /> )}
                                    value={categoria}
                                    onChange={handleCategoriaChange}
                                    fullWidth={true} />
                            </div>
                            <div style={{ width: '25%' }}>
                                <Autocomplete options={opcoesSubcat} getOptionLabel={(option) => option.label} renderInput={(params) => (
                                    <TextField {...params} label="Subcategoria" variant="outlined" error={subcategoriaError} helperText={subcategoriaError ? "Escolha uma subcategoria" : ""} />)}
                                    value={subcategoria}
                                    onChange={(event, newValue) => { setSubcategoria(newValue); }}
                                    fullWidth={true} />
                            </div>
                        </div>
                        <div style={{ marginBottom: 20 }}></div>
                        <InputImage image={image} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        <CancelButton onclick={handleCancel} caption='Cancelar' />
                        <SubmitButton onclick={handleEditEvent} caption='Guardar' />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default EditEventModal;

