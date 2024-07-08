import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import BasicTextField from '../../components/textFields/basic';
import DataHora from '../../components/textFields/dataHora';
import SubmitButton from '../../components/buttons/submitButton';
import ComboBox from '../../components/combobox/comboboxBasic';
import CancelButton from '../../components/buttons/cancelButton';
import ImageTable from '../../components/tables/imageTable';
import FormBuilder from '../../components/forms/FormBuilder';
import Map from '../../modals/maps/maps';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import IconButton from '@mui/material/IconButton';

const EditEventModal = ({ open, onClose, eventData, setAlertOpen, setAlertProps  }) => {
    //VARS
    //FIELDS
    const [isNewModalOpen1, setNewModalOpen1] = useState(false);
    const [titulo, setTitle] = useState('');
    const [localizacao, setLocalizacao] = useState('');
    const [descricao, setDescription] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [loadingCidades, setLoadingCidades] = useState(false);
    const [nmrMaxParticipantes, setNumParticipantes] = useState('');
    const [dataInicio, setDataHoraInicio] = useState('');
    const [dataFim, setDataHoraFim] = useState('');
    const [dataLimInscricao, setDataLimInscricao] = useState('');
    const [cidadeID, setCidade] = useState(null);
    const [cidades, setCidades] = useState([]);
    const [cidadeData, setCidadeData] = useState(null);
    const [distrito, setDistrito] = useState(null);
    const [distritos, setDistritos] = useState([]);
    const [poloId, setPolo] = useState('');
    const [polos, setPolos] = useState([]);
    const [error, setError] = useState(null);
    const [opcoesCat, setOpcoesCat] = useState([]);
    const [categoria, setCategoria] = useState(null);
    const [opcoesSubcat, setOpcoesSubcat] = useState([]);
    const [subcategoria, setSubcategoria] = useState(null);
    const [images, setImages] = useState([]);
    const [cancelado, setCancelado] = useState(null);
    const [initialQuestionsI , setInitialQuestionsI] = useState(null);
    const [initialQuestionsQ , setInitialQuestionsQ] = useState(null);

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

    const refFormInscricao = useRef();
    const refFormQualidade = useRef();

    const updateLatLng = (lat, lng) => {
        setLat(lat);
        setLng(lng);
    };

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
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/categoria`, {
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
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/subcategoria/categoria/${idcat}`, {
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
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/subcategoria/categoria/${newValue.value}`, {
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

    const fetchDistritoByCidadeId = async (cidadeId) => {
        const token = sessionStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/cidades/${cidadeId}/distrito`, {
            headers: { Authorization: `${token}` }
        });
        const distritoData = response.data.data;
        return { value: distritoData.distritoid, label: distritoData.nome };
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

    const handleDistritoChange = (event, newValue) => {
        setDistrito(newValue);
        setCidade(null);
        if (newValue) {
            fetchCidades(newValue.value);
        } else {
            setCidades([]);
        }
    };

    useEffect(() => {
        if (lat && lng) fetchCidadeAPI(lat, lng);
    }, [lat, lng]);

    useEffect(() => {
        if (!loadingCidades && cidades.length > 0 && cidadeData) {
            const cidade = cidades.find(c => c.label.toLowerCase() === cidadeData.cidade.toLowerCase());
            if (cidade) setCidade(cidade);
        }
    }, [loadingCidades, cidades, cidadeData]);

    const fetchCidadeAPI = async (lat, long) => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/cidades/cidade/${lat}/${long}`, {
                headers: { Authorization: `${token}` }
            });
            const cidadeData = response.data;

            const distrito = distritos.find(d => d.label === cidadeData.distrito);
            if (distrito) {
                setDistrito(distrito);
                setLoadingCidades(true);
                await fetchCidades(distrito.value);
                setLoadingCidades(false);
                setCidadeData(cidadeData);
            }

            return cidadeData;
        } catch (error) {
            console.error('Erro ao buscar cidade:', error);
        }
    };
    
    const fetchEventData = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/evento/${eventData}`, {
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
            setCancelado(userData.cancelado)
            setLat(userData.latitude);
            setLng(userData.longitude);

            fetchCidadeAPI(userData.latitude, userData.longitude);
            
            const catResponse = await axios.get(`${process.env.REACT_APP_API_URL}/categoria/${userData.subcategoria.categoriaid}`, {
                headers: { Authorization: `${token}` }
            });
            const cat = catResponse.data;
            setCategoria({value: userData.subcategoria.categoriaid, label: cat.valorpt});
            fetchSubcategoria(userData.subcategoria.categoriaid);

            const subcatResponse = await axios.get(`${process.env.REACT_APP_API_URL}/subcategoria/${userData.subcategoriaid}`, {
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

            setInitialQuestionsI(userData.formInscricao.map(detail => ({
                id: detail.formulariodetalhesid,
                type: detail.tipodados,
                text: detail.pergunta,
                options: detail.respostaspossiveis ? detail.respostaspossiveis.split(', ') : [],
                required: detail.obrigatorio,
                order: detail.ordem,
                minValue: detail.minimo,
                maxValue: detail.maximo
            })));

            setInitialQuestionsQ(userData.formQualidade.map(detail => ({
                id: detail.formulariodetalhesid,
                type: detail.tipodados,
                text: detail.pergunta,
                options: detail.respostaspossiveis ? detail.respostaspossiveis.split(', ') : [],
                required: detail.obrigatorio,
                order: detail.ordem,
                minValue: detail.minimo,
                maxValue: detail.maximo
            })));
        } catch (error) {
            console.error('Erro ao buscar dados do evento:', error);
        }
    };

    useEffect(() => {
        fetchDistritos();
        fetchPolos();
        fetchCategorias();
        fetchEventData();
    }, [open, eventData]);

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
        } else if (!cancelado) {
            const startDate = new Date(dataInicio);
            const currentDate = new Date();
            if (startDate <= currentDate) {
                errors.dataHoraInicioError = true; 
            } 
        }
        if (!dataFim) {
            errors.dataHoraFimError = true;
        } else if (!cancelado){
            const endDate = new Date(dataFim);
            const currentDate = new Date();
            const startDate = new Date(dataInicio);
            if (endDate <= currentDate) {
                errors.dataHoraFimError = true;
            }else if (endDate < startDate) {
                errors.dataHoraFimError = true;
            }
        } 
        if (!dataLimInscricao) {
            errors.dataLimInscricaoError = true;
        } else if (!cancelado){
            const deadlineDate = new Date(dataLimInscricao);
            const currentDate = new Date();
            const startDate = new Date(dataInicio);
            if (deadlineDate <= currentDate) {
                errors.dataLimInscricaoError = true; 
            }else if (deadlineDate > startDate) {
                errors.dataHoraFimError = true;
            }
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
        const formInsc = JSON.parse(refFormInscricao.current.generateJSON());
        const formQdd = JSON.parse(refFormQualidade.current.generateJSON());

        for (let question of formInsc) {
            if (!question.text.trim()) {
                alert('Preencha o texto de todas as perguntas do formulario de inscrição!');
                return;
            }
        }

        for (let question of formQdd) {
            if (!question.text.trim()) {
                alert('Preencha o texto de todas as perguntas do questionário de qualidade!');
                return;
            }
        }

        try {
            const imagesRtn = images.map(image => ({
                nome: image.alt,
                base64: image.src,
                tamanho: image.size
            }));

            const userid = sessionStorage.getItem('userid');
            const token = sessionStorage.getItem('token');
            const eventoEditado = {
                titulo,
                descricao,
                dataInicio,
                dataFim,
                dataLimInscricao,
                nmrMaxParticipantes,
                localizacao,
                latitude: lat,
                longitude: lng,
                cidadeID: cidadeID.value,
                subcategoriaId: subcategoria.value,
                poloId,
                utilizadorid: userid,
                imagens: imagesRtn,
                cancelado: cancelado,
                formInsc: formInsc,
                formQualidade: formQdd
            };
            
            await axios.put(`${process.env.REACT_APP_API_URL}/evento/update/${eventData}`, eventoEditado, {
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
        setImages([]);
        onClose();
    };

    const handleImage = async () => {
        try {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*'; 
    
            fileInput.addEventListener('change', async (event) => {
                const file = event.target.files[0];
                if (!file) return; 
                const fileName = file.name;
                const fileSize = file.size;
                
                const reader = new FileReader();
                reader.readAsDataURL(file);
        
                reader.onload = async () => {
                    const imageData = reader.result;
                    const fileData = imageData;
                    const image = {
                        src: fileData,
                        alt: fileName,
                        size: fileSize
                    }
                    setImages(prevImages => [...prevImages, image]);
                };
            });
            fileInput.click();
        } catch (error) {
            console.error('Error uploading image:', error.message);
        }
    };

    const resetImage = async (index) => {
        setImages(prevImages => {
            const newImages = [...prevImages];
            newImages.splice(index, 1);
            return newImages;
        });
    }

    const handleAddClick = () => {
        setNewModalOpen1(true);
    };

    const handleClose1 = () => {
        setNewModalOpen1(false);
    };

    return (
        <Modal open={open} onClose={handleCancel}>
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '1000px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px', overflow: 'auto' }}>
                <h2 style={{ marginTop: 0, color: 'white' }}>Editar Evento</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12 }}>
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel1-header">
                            Detalhes Principais
                        </AccordionSummary>
                        <AccordionDetails>
                            <div style={{ marginBottom: 15 }}>
                                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                                    <div style={{ width: '40%' }}>
                                        <BasicTextField caption='Titulo' valor={titulo} onchange={(e) => setTitle(e.target.value)} fullwidth={true} type="text" error={titleError}
                                    helperText={titleError ? "Introduza um título válido" : ""} allowOnlyLetters={true}/>
                                    </div>
                                    <div style={{ width: '25%' }}>
                                        <BasicTextField caption='Nº Participantes Máximo' type='number' valor={nmrMaxParticipantes} onchange={(e) => setNumParticipantes(e.target.value)} fullwidth={true} error={numParticipantesError}
                                    helperText={numParticipantesError ? "Introduza um nº válido" : ""} />
                                    </div>
                                    <div style={{ width: '28.4%' }}>
                                        <BasicTextField caption='Localização' valor={localizacao} onchange={(e) => setLocalizacao(e.target.value)} fullwidth={true} type="text" error={localizacaoError}
                                    helperText={localizacaoError ? "Introduza uma localização válida" : ""} />
                                    </div>
                                    <div style={{ width: '5%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <IconButton aria-label="Example" onClick={handleAddClick}>
                                            <AddLocationAltIcon fontSize="large" sx={{ color: '#1D5AA1' }} />
                                        </IconButton>
                                        <Map open={isNewModalOpen1} onClose={handleClose1} onSave={(coords) => updateLatLng(coords.lat, coords.lng)} lat={lat} lng={lng} title={titulo}/>
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
                                            disabled={false} helperText={poloError ? "Selecione um polo" : ""} />
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
                                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center' }}>
                                    <div style={{ width: '25%' }}>
                                        <DataHora caption="Data e Hora Início" value={dataInicio} onChange={(newValue) => setDataHoraInicio(newValue)} fullwidth={true} error={dataHoraInicioError}
                                    helperText={dataHoraInicioError ? "Introduza uma data e hora válida" : ""} />
                                    </div>
                                    <div style={{ width: '23.5%' }}>
                                        <DataHora caption="Data e Hora Fim" value={dataFim} onChange={(newValue) => setDataHoraFim(newValue)} fullwidth={true} error={dataHoraFimError}
                                    helperText={dataHoraFimError ? "Introduza uma data e hora válida" : ""} />
                                    </div>
                                    <div style={{ width: '25%' }}>
                                        <DataHora caption="Data Limite de Inscrição" value={dataLimInscricao} onChange={(newValue) => setDataLimInscricao(newValue)} fullwidth={true} error={dataLimInscricaoError}
                                    helperText={dataLimInscricaoError ? "Introduza uma data e hora válida" : ""} />
                                    </div>
                                    <div style={{ width: '15%' }}>
                                        <FormControlLabel
                                            control={<Switch checked={cancelado} onChange={(e) => setCancelado(e.target.checked)} />}
                                            label="Cancelado"
                                        />
                                    </div>
                                </div>
                                <div style={{marginTop: 20}}>
                                    <ImageTable images={images} onAddImage={handleImage} onDelete={resetImage}/>
                                </div>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel2-header">
                            Formulário de Inscrição
                        </AccordionSummary>
                        <AccordionDetails>
                            <FormBuilder ref={refFormInscricao} initialQuestions={initialQuestionsI}/>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel3-header">
                            Questionário de Qualidade
                        </AccordionSummary>
                        <AccordionDetails>
                            <FormBuilder ref={refFormQualidade} initialQuestions={initialQuestionsQ}/>
                        </AccordionDetails>
                    </Accordion>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: 10 }}>
                        <CancelButton onclick={handleCancel} caption='Cancelar' />
                        <SubmitButton onclick={handleEditEvent} caption='Guardar' />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default EditEventModal;

