import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import BasicTextField from '../../components/textFields/basic';
import ComboBox from '../../components/combobox/comboboxBasic';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import SubmitButton from '../../components/buttons/submitButton';
import CancelButton from '../../components/buttons/cancelButton';

const EditarAlerta = ({ open, onClose, alertaid }) => {
    const [descricao, setDescricao] = useState('');
    const [polo, setPolo] = useState('');
    const [inactivo, setInactivo] = useState(false);
    const [opcoesPolo, setOpcoesPolo] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPolos = async () => {
            try {
                const token = 'tokenFixo';
                const response = await axios.get('http://localhost:8000/polo', {
                    headers: {
                        Authorization: `${token}`
                    }
                });
                const polos = response.data.data;
                setOpcoesPolo(polos.map((polo) => ({
                    value: polo.poloid,
                    label: polo.descricao,
                })));
            } catch (error) {
                setError(error);
                console.error('Erro ao encontrar os polos:', error);
            }
        };

        const fetchAlertData = async () => {
            try {
                const token = 'tokenFixo';
                const response = await axios.get(`http://localhost:8000/alerta/${alertaid}`, {
                    headers: {
                        Authorization: `${token}`
                    }
                });
                const alerta = response.data.data;

                if (alerta) {
                    setDescricao(alerta.texto || '');
                    setPolo(alerta.poloid || '');
                    setInactivo(alerta.inactivo || false);
                }
            } catch (error) {
                setError(error);
                console.error('Erro ao encontrar o alerta:', error);
            }
        };
        
        if (alertaid) {
            fetchAlertData();
            fetchPolos();
        }
    }, [alertaid]);

    const handleEditEvent = async () => {
        try {
            const token = 'tokenFixo';
            await axios.put(`http://localhost:8000/alerta/update/${alertaid}`, {
                texto: descricao,
                poloID: polo,
                inactivo
            }, {
                headers: {
                    Authorization: `${token}`,
                }
            });
            onClose();
        } catch (error) {
            console.error('Erro ao editar alerta:', error);
        }
    };

    const handleChangeAtivo = (event) => {
        setInactivo(event.target.checked);
    };

    return (
        <Modal open={open} onClose={onClose}>
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px' }}>
                <h2 style={{ marginTop: 0, color: 'white' }}>Editar Alerta</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12 }}>
                    <div style={{ marginBottom: 15 }}>
                        <div style={{ display: 'flex', marginBottom: 20 }}>
                            <div style={{ width: '75%' }}>
                                <ComboBox caption='Polo' options={opcoesPolo} value={polo} handleChange={(e) => setPolo(e.target.value)} position="start" />
                            </div>
                            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                                <FormControlLabel
                                    control={<Switch checked={inactivo} onChange={handleChangeAtivo} />}
                                    label="Inativo"
                                />
                            </div>
                        </div>
                        <BasicTextField caption='Descrição' valor={descricao} onchange={(e) => setDescricao(e.target.value)} fullwidth={true} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        <CancelButton onclick={() => { onClose(); }} caption='Cancelar' />
                        <SubmitButton onclick={handleEditEvent} caption='Guardar' />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default EditarAlerta;
