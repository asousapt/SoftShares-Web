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

const imgs = [
    { src: 'https://i1.sndcdn.com/artworks-000537542583-dr2w2s-t500x500.jpg', alt: 'testas' },
];

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

    useEffect(() => {
        const fetchCidades = async () => {
            try {
                const token = 'tokenFixo';
                const response = await axios.get('http://localhost:8000/cidades', {
                    headers: { Authorization: `${token}` }
                });
                const cidadesData = response.data.data;

                const cidadesOptions = cidadesData.map(cidade => ({
                    value: cidade.cidadeid,
                    label: cidade.nome
                }));

                setCidades(cidadesOptions);
                console.log(cidadesOptions);
            } catch (error) {
                console.error('Erro ao buscar cidades:', error);
            }
        };

        fetchCidades();
    }, []);

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
            };
            console.log(JSON.stringify(novoEvento));
            const jsonData = JSON.stringify(novoEvento);
            await axios.post('http://localhost:8000/eventos/add', jsonData, {
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
                        <BasicTextField caption='Titulo' valor={title} onchange={(e) => setTitle(e.target.value)} fullwidth={true} />
                        <div style={{ marginBottom: 20 }}></div>
                        <BasicTextField caption='Localização' valor={localizacao} onchange={(e) => setLocalizacao(e.target.value)} fullwidth={true} />
                        <div style={{ marginBottom: 20 }}></div>
                        <BasicTextField caption='Descrição' valor={description} onchange={(e) => setDescription(e.target.value)} fullwidth={true} />
                        <div style={{ marginBottom: 20 }}></div>
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                            <div style={{ width: '20%' }}>
                                <BasicTextField caption='Nº Participantes Máximo' type='number' valor={numParticipantes} onchange={(e) => setNumParticipantes(e.target.value)} />
                            </div>
                            <div style={{ width: '30%' }}>
                                <DataHora
                                    caption="Data e Hora Início"
                                    value={dataHoraInicio}
                                    onChange={(newValue) => {
                                        setDataHoraInicio(newValue);
                                        console.log('Data e Hora Início:', newValue);
                                    }}
                                />
                            </div>
                            <div style={{ width: '30%' }}>
                                <DataHora
                                    caption="Data e Hora Fim"
                                    value={dataHoraFim}
                                    onChange={(newValue) => {
                                        setDataHoraFim(newValue);
                                        console.log('Data e Hora Fim:', newValue);
                                    }}
                                />
                            </div>
                            <div style={{ width: '30%' }}>
                                <DataHora
                                    caption="Data Limite de Inscrição"
                                    value={dataLimInscricao}
                                    onChange={(newValue) => {
                                        setDataLimInscricao(newValue);
                                        console.log('Data Limite de Inscrição:', newValue);
                                    }}
                                />
                            </div>
                            <div style={{ width: '40%' }}>
                                <Autocomplete
                                    options={cidades}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => <TextField {...params} label="Cidade" variant="outlined" />}
                                    value={cidade}
                                    onChange={(event, newValue) => {
                                        setCidade(newValue);
                                    }}
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
