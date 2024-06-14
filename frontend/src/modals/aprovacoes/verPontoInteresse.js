import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import BasicTextField from '../../components/textFields/basic';
import SubmitButton from '../../components/buttons/submitButton';
import CancelButton from '../../components/buttons/cancelButton';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import InputImage from '../../components/image/imageInput';
import axios from 'axios';

const EditPontoIntModal = ({ open, onClose, registoId}) => {
    const [titulo, setTitle] = useState('');
    const [localizacao, setLocalizacao] = useState('');
    const [descricao, setDescription] = useState('');
    const [cidadeID, setCidade] = useState(null);
    const [cidades, setCidades] = useState([]);
    const [distrito, setDistrito] = useState(null);
    const [distritos, setDistritos] = useState([]);
    const [error, setError] = useState(null);
    const [image, setImage] = useState('https://i0.wp.com/ctmirror-images.s3.amazonaws.com/wp-content/uploads/2021/01/dummy-man-570x570-1.png?fit=570%2C570&ssl=1');
    const [opcoesCat, setOpcoesCat] = useState([]);
    const [categoria, setCategoria] = useState(null);
    const [opcoesSubcat, setOpcoesSubcat] = useState([]);
    const [subcategoria, setSubcategoria] = useState(null);

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
                const response = await axios.get(`http://localhost:8000/pontoInteresse/${registoId}`, {
                    headers: { Authorization: `${token}` }
                });
                const userData = response.data.data;
                
                setTitle(userData.titulo);
                setLocalizacao(userData.localizacao);
                setDescription(userData.descricao);

                const distrito = await fetchDistritoByCidadeId(userData.cidadeid);
                setDistrito(distrito);
                fetchCidades(distrito.value, userData.cidadeid);

                const subcatResponse = await axios.get(`http://localhost:8000/subcategoria/${userData.subcategoriaid}`, {
                    headers: { Authorization: `${token}` }
                });
                const subcat = subcatResponse.data;

                const catResponse = await axios.get(`http://localhost:8000/categoria/${subcat.categoriaid}`, {
                    headers: { Authorization: `${token}` }
                });
                const cat = catResponse.data;
                
                setCategoria({value: subcat.categoriaid, label: cat.valorpt});
                fetchSubcategoria(subcat.categoriaid);
    
                setSubcategoria({value: userData.subcategoriaid, label: subcat.valorpt});
            } catch (error) {
                console.error('Erro ao receber dados do Ponto de Interesse:', error);
            }
    };

    useEffect(() => {
        fetchDistritos();
        fetchCategorias();
        fetchEventData();
    }, [registoId]);

    const handleEditPontoInt = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const eventoEditado = {
                titulo: titulo,
                descricao: descricao,
                localizacao: localizacao,
                latitude: 0,
                longitude: 0,
                cidadeid: cidadeID.value,
                subcategoriaid: subcategoria.value,
            };

            await axios.put(`http://localhost:8000/pontoInteresse/update/${registoId}`, eventoEditado, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                }
            });
            onClose();
        } catch (error) {
            console.error('Erro ao editar Ponto de Interesse:', error);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '1000px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px', overflow: 'auto' }}>
                <h2 style={{ marginTop: 0, color: 'white' }}>Ver Ponto Interesse</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12 }}>
                    <div style={{ marginBottom: 15 }}>
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                            <div style={{ width: '50%' }}>
                                <BasicTextField caption='Titulo' valor={titulo} onchange={(e) => setTitle(e.target.value)} fullwidth={true} disabled={true}/>
                            </div>
                            <div style={{ width: '49.4%' }}>
                                <BasicTextField caption='Localização' valor={localizacao} onchange={(e) => setLocalizacao(e.target.value)} fullwidth={true} disabled={true}/>
                            </div>
                        </div>
                        <div style={{ marginBottom: 20 }}></div>
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                        <div style={{ width: '100%' }}>
                                <BasicTextField caption='Descrição' valor={descricao} onchange={(e) => setDescription(e.target.value)} fullwidth={true} disabled={true}/>
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
                        <InputImage image={image} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        <CancelButton onclick={() => { onClose(); }} caption='Voltar' />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default EditPontoIntModal;