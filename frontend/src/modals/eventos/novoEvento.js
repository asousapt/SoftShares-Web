import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BasicTextField from '../../components/textFields/basic';
import DataHora from '../../components/textFields/dataHora';
import SubmitButton from '../../components/buttons/submitButton';
import CancelButton from '../../components/buttons/cancelButton';
import ImageTable from '../../components/tables/imageTable';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import FormBuilder from '../../components/forms/FormBuilder';

const AddEventModal = ({ open, onClose, setAlertOpen, setAlertProps  }) => {
    //VARS
    //FIELDS
    const [title, setTitle] = useState('');
    const [localizacao, setLocalizacao] = useState('');
    const [description, setDescription] = useState('');
    const [numParticipantes, setNumParticipantes] = useState('');
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
    const [images, setImages] = useState([]);
    const [isPoloDisabled, setIsPoloDisabled] = useState(false);

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

    useEffect(() => {
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

        fetchPolos();
        fetchDistritos();
        fetchCategorias();
        const perfil = sessionStorage.getItem('perfil');
        if (perfil === 'Admin'){
            setIsPoloDisabled(true);

            const poloid = sessionStorage.getItem('poloid');
            const descpolo = sessionStorage.getItem('descpolo');
            setPolo({value: poloid, label: descpolo});
        } else {
            setIsPoloDisabled(false);
        }
    }, []);

    const fetchCidades = async (distritoId) => {
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

    const validateForm = () => {
        let errors = {};

        if (!title) {
            errors.titleError = true;
        }
        if (!localizacao) {
            errors.localizacaoError = true;
        }
        if (!description) {
            errors.descError = true;
        }
        if (!distrito) {
            errors.distritoError = true;
        }
        if (!cidade) {
            errors.cidadeError = true;
        }
        if (!categoria) {
            errors.categoriaError = true;
        }
        if (!subcategoria) {
            errors.subcategoriaError = true;
        }
        if (!polo) {
            errors.poloError = true;
        }
        if (!dataHoraInicio) {
            errors.dataHoraInicioError = true;
        } else {
            const startDate = new Date(dataHoraInicio);
            const currentDate = new Date();
            if (startDate <= currentDate) {
                errors.dataHoraInicioError = true; 
            }
        }
        if (!dataHoraFim) {
            errors.dataHoraFimError = true;
        } else {
            const endDate = new Date(dataHoraFim);
            const currentDate = new Date();
            const startDate = new Date(dataHoraInicio);
            if (endDate <= currentDate) {
                errors.dataHoraFimError = true;
            }else if (endDate < startDate) {
                errors.dataHoraFimError = true;
            }
        }
        if (!dataLimInscricao) {
            errors.dataLimInscricaoError = true;
        } else {
            const deadlineDate = new Date(dataLimInscricao);
            const currentDate = new Date();
            const startDate = new Date(dataHoraInicio);
            if (deadlineDate <= currentDate) {
                errors.dataLimInscricaoError = true; 
            }else if (deadlineDate > startDate) {
                errors.dataHoraFimError = true;
            }
        }
        if (!numParticipantes) {
            errors.numParticipantesError = true;
        }

        return errors;
    };

    const handleAddEvent = async () => {
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
                utilizadorCriou: userid,
                subcategoriaId: subcategoria ? subcategoria.value : '',
                poloId: polo ? polo.value : '',
                imagens: imagesRtn,
                formInsc: formInsc,
                formQualidade: formQdd
            };
            console.log(novoEvento);
            await axios.post('http://localhost:8000/evento/add', novoEvento, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                }
            });
            onClose();
            setAlertProps({ title: 'Sucesso', label: `Evento criado com sucesso.`, severity: 'success' });
            setAlertOpen(true);
            resetForm();
        } catch (error) {
            console.error('Erro ao adicionar evento:', error);
            setAlertProps({ title: 'Erro', label: `Ocorreu um erro ao criar o evento.`, severity: 'error' });
            setAlertOpen(true);
        }
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
                    console.log('reader',reader);
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

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setDataHoraInicio('');
        setDataHoraFim('');
        setDataLimInscricao('');
        setNumParticipantes('');
        setLocalizacao('');
        setDistrito(null);
        setCidade(null);
        setCategoria(null);
        setSubcategoria(null);
        setPolo(null);
        setImages([]);
    };

    const handleCancel = () => {
        resetForm();
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
                <h2 style={{ marginTop: 0, color: 'white' }}>Novo Evento</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12 }}>
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel1-header">
                            Detalhes Principais
                        </AccordionSummary>
                        <AccordionDetails>
                            <div style={{ marginBottom: 15 }}>
                                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                                    <div style={{ width: '40%' }}>
                                        <BasicTextField caption='Titulo' valor={title} onchange={(e) => setTitle(e.target.value)} fullwidth={true} type="text" error={titleError}
                                    helperText={titleError ? "Introduza um título válido" : ""} allowOnlyLetters={true} />
                                    </div>
                                    <div style={{ width: '33.9%' }}>
                                        <BasicTextField caption='Localização' valor={localizacao} onchange={(e) => setLocalizacao(e.target.value)} fullwidth={true} type="text" error={localizacaoError}
                                    helperText={localizacaoError ? "Introduza uma localização válida" : ""} />
                                    </div>
                                    <div style={{ width: '25%' }}>
                                        <BasicTextField caption='Nº Participantes Máximo' type='number' valor={numParticipantes} onchange={(e) => setNumParticipantes(e.target.value)} fullwidth={true} error={numParticipantesError}
                                    helperText={numParticipantesError ? "Introduza um nº válido" : ""} />
                                    </div>
                                </div>
                                <div style={{ marginBottom: 20 }}></div>
                                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                                    <div style={{ width: '74.5%' }}>
                                        <BasicTextField caption='Descrição' valor={description} onchange={(e) => setDescription(e.target.value)} fullwidth={true} type="text" error={descError}
                                    helperText={descError ? "Introduza uma descrição válida" : ""} />
                                    </div>
                                    <div style={{ width: '24.9%' }}>
                                        <Autocomplete options={polos} getOptionLabel={(option) => option.label} renderInput={(params) => (
                                                <TextField {...params} label="Polo" variant="outlined" type="text" error={poloError} helperText={poloError ? "Escolha um Polo" : ""} /> 
                                            )}
                                            value={polo}
                                            onChange={(event, newValue) => { setPolo(newValue); }}
                                            fullWidth={true} 
                                            disabled={isPoloDisabled}
                                        />
                                    </div>
                                </div>
                                <div style={{ marginBottom: 20 }}></div>
                                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                                    <div style={{ width: '32.9%' }}>
                                        <DataHora caption="Data e Hora Início" value={dataHoraInicio} onChange={(newValue) => setDataHoraInicio(newValue)} fullwidth={true} error={dataHoraInicioError}
                                    helperText={dataHoraInicioError ? "Introduza uma data e hora válida" : ""} />
                                    </div>
                                    <div style={{ width: '33%' }}>
                                        <DataHora caption="Data e Hora Fim" value={dataHoraFim} onChange={(newValue) => setDataHoraFim(newValue)} fullwidth={true} error={dataHoraFimError}
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
                                            value={cidade}
                                            onChange={(event, newValue) => { setCidade(newValue); setCidadeError(false); }}
                                            fullWidth={true} />
                                    </div>
                                    <div style={{ width: '25%' }}>
                                        <Autocomplete options={opcoesFiltroCat} getOptionLabel={(option) => option.label} renderInput={(params) => (
                                                <TextField {...params} label="Categoria" variant="outlined" type="text" error={categoriaError} helperText={categoriaError ? "Escolha uma categoria" : ""} /> )}
                                            value={categoria}
                                            onChange={handleCategoriaChange}
                                            fullWidth={true} />
                                    </div>
                                    <div style={{ width: '25%' }}>
                                        <Autocomplete options={opcoesFiltroSubcat} getOptionLabel={(option) => option.label} renderInput={(params) => (
                                            <TextField {...params} label="Subcategoria" variant="outlined" error={subcategoriaError} helperText={subcategoriaError ? "Escolha uma subcategoria" : ""} />)}
                                            value={subcategoria}
                                            onChange={(event, newValue) => { setSubcategoria(newValue); }}
                                            fullWidth={true} />
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
                            <FormBuilder ref={refFormInscricao} />
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel3-header">
                            Questionário de Qualidade
                        </AccordionSummary>
                        <AccordionDetails>
                            <FormBuilder ref={refFormQualidade} />
                        </AccordionDetails>
                    </Accordion>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: 10 }}>
                        <CancelButton onclick={handleCancel} caption='Cancelar' />
                        <SubmitButton onclick={handleAddEvent} caption='Guardar' />
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default AddEventModal;
