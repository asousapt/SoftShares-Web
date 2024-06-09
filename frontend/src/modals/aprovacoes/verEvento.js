import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import BasicTextField from '../../components/textFields/basic';
import DataHora from '../../components/textFields/dataHora';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CancelButton from '../../components/buttons/cancelButton';

const VerEvento = ({ open, onClose, eventoId }) => {
    console.log('id ver evento', eventoId);
    const [title, setTitle] = useState('');
    const [localizacao, setLocalizacao] = useState('');
    const [description, setDescription] = useState('');
    const [numParticipantes, setNumParticipantes] = useState('');
    const [dataHoraInicio, setDataHoraInicio] = useState('');
    const [dataHoraFim, setDataHoraFim] = useState('');
    const [dataLimInscricao, setDataLimInscricao] = useState('');
    const [cidade, setCidade] = useState('');
    const [distrito, setDistrito] = useState('');
    const [polo, setPolo] = useState('');
    const [categoria, setCategoria] = useState('');
    const [subcategoria, setSubcategoria] = useState('');
    const [error, setError] = useState(null);

    const fetchEvento = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get(`http://localhost:8000/evento/${eventoId}`, {
                headers: {
                    Authorization: `${token}`
                }
            });
            const evento = response.data.data;
            setTitle(evento.titulo);
            setDescription(evento.descricao);
            setLocalizacao(evento.localizacao);
            setNumParticipantes(evento.nmrmaxparticipantes);
            setDataHoraInicio(evento.datainicio);
            setDataHoraFim(evento.datafim);
            setDataLimInscricao(evento.dataliminscricao);
            setCidade(evento.cidadeID);
            setDistrito(evento.distritoID);
            setPolo(evento.poloID);
            setCategoria(evento.categoriaID);
            setSubcategoria(evento.subcategoriaID);
        } catch (error) {
            setError(error);
        }
    };

    useEffect(() => {
        if (eventoId) {
            fetchEvento();
        }
    }, [eventoId]);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <Modal open={open} onClose={onClose}>
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '1000px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px', overflow: 'auto' }}>
                <h2 style={{ marginTop: 0, color: 'white' }}>Detalhes do Evento</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12 }}>
                    <div style={{ marginBottom: 15 }}>
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                            <div style={{ width: '40%' }}>
                                <BasicTextField caption='Titulo' valor={title} fullwidth={true} disabled={true} />
                            </div>
                            <div style={{ width: '33.9%' }}>
                                <BasicTextField caption='Localização' valor={localizacao} fullwidth={true} disabled={true} />
                            </div>
                            <div style={{ width: '25%' }}>
                                <BasicTextField caption='Nº Participantes Máximo' type='number' valor={numParticipantes} fullwidth={true} disabled={true} />
                            </div>
                        </div>
                        <div style={{ marginBottom: 20 }}></div>
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                            <div style={{ width: '74.5%' }}>
                                <BasicTextField caption='Descrição' valor={description} fullwidth={true} disabled={true} />
                            </div>
                            <div style={{ width: '24.9%' }}>
                                <Autocomplete
                                    options={[{ label: 'Polo 1', value: 1 }, { label: 'Polo 2', value: 2 }]}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => <TextField {...params} label="Polo" variant="outlined" />}
                                    value={polo}
                                    disabled={true}
                                    fullWidth={true}
                                />
                            </div>
                        </div>
                        <div style={{ marginBottom: 20 }}></div>
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                            <div style={{ width: '32.9%' }}>
                                <DataHora caption="Data e Hora Início" value={dataHoraInicio} fullwidth={true} disabled={true} />
                            </div>
                            <div style={{ width: '33%' }}>
                                <DataHora caption="Data e Hora Fim" value={dataHoraFim} fullwidth={true} disabled={true} />
                            </div>
                            <div style={{ width: '33%' }}>
                                <DataHora caption="Data Limite de Inscrição" value={dataLimInscricao} fullwidth={true} disabled={true} />
                            </div>
                        </div>
                        <div style={{ marginBottom: 20 }}></div>
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                            <div style={{ width: '25%' }}>
                                <Autocomplete
                                    options={[{ label: 'Distrito 1', value: 1 }, { label: 'Distrito 2', value: 2 }]}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => <TextField {...params} label="Distrito" variant="outlined" />}
                                    value={distrito}
                                    disabled={true}
                                    fullWidth={true}
                                />
                            </div>
                            <div style={{ width: '23.4%' }}>
                                <Autocomplete
                                    options={[{ label: 'Cidade 1', value: 1 }, { label: 'Cidade 2', value: 2 }]}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => <TextField {...params} label="Cidade" variant="outlined" />}
                                    value={cidade}
                                    disabled={true}
                                    fullWidth={true}
                                />
                            </div>
                            <div style={{ width: '25%' }}>
                                <Autocomplete
                                    options={[{ label: 'Categoria 1', value: 1 }, { label: 'Categoria 2', value: 2 }]}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => <TextField {...params} label="Categoria" variant="outlined" />}
                                    value={categoria}
                                    disabled={true}
                                    fullWidth={true}
                                />
                            </div>
                            <div style={{ width: '25%' }}>
                                <Autocomplete
                                    options={[{ label: 'Subcategoria 1', value: 1 }, { label: 'Subcategoria 2', value: 2 }]}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => <TextField {...params} label="Subcategoria" variant="outlined" />}
                                    value={subcategoria}
                                    disabled={true}
                                    fullWidth={true}
                                />
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        <CancelButton onClick={onClose} caption='Fechar' />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default VerEvento;
