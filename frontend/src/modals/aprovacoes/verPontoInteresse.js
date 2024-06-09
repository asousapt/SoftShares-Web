import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import BasicTextField from '../../components/textFields/basic';
import ComboBox from '../../components/combobox/comboboxBasic';
import CancelButton from '../../components/buttons/cancelButton';

const VerPontoInteresse = ({ open, onClose, pontoInteresseId }) => {
    const [descricao, setDescricao] = useState('');
    const [polo, setPolo] = useState('');
    const [localizacao, setLocalizacao] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [error, setError] = useState(null);

    const fetchPontoInteresse = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get(`http://localhost:8000/pontoInteresse/${pontoInteresseId}`, {
                headers: {
                    Authorization: `${token}`
                }
            });
            const pontoInteresse = response.data.data;
            setDescricao(pontoInteresse.descricao);
            setPolo(pontoInteresse.poloID);
            setLocalizacao(pontoInteresse.localizacao);
            setLatitude(pontoInteresse.latitude);
            setLongitude(pontoInteresse.longitude);
        } catch (error) {
            setError(error);
        }
    };

    useEffect(() => {
        if (pontoInteresseId) {
            fetchPontoInteresse();
        }
    }, [pontoInteresseId]);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <Modal open={open} onClose={onClose}>
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px' }}>
                <h2 style={{ marginTop: 0, color: 'white' }}>Detalhes do Ponto de Interesse</h2>
                <div style={{ backgroundColor: 'white', padding: 20, borderRadius: 12 }}>
                    <div style={{ marginBottom: 15 }}>
                        <BasicTextField caption='Descrição' valor={descricao} fullwidth={true} disabled={true} />
                        <ComboBox caption='Polo' value={polo} handleChange={() => {}} options={[]} disabled={true} />
                        <BasicTextField caption='Localização' valor={localizacao} fullwidth={true} disabled={true} />
                        <BasicTextField caption='Latitude' valor={latitude} fullwidth={true} disabled={true} />
                        <BasicTextField caption='Longitude' valor={longitude} fullwidth={true} disabled={true} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        <CancelButton onClick={onClose} caption='Fechar' />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default VerPontoInteresse;
