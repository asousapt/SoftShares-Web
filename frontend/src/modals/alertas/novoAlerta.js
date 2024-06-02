import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import BasicTextField from '../../components/textFields/basic';
import ComboBox from '../../components/combobox/comboboxBasic';
import SubmitButton from '../../components/buttons/submitButton';
import CancelButton from '../../components/buttons/cancelButton';

const NovoAlerta = ({ open, onClose }) => {
    const [descricao, setDescricao] = useState('');
    const [polo, setPolo] = useState('');
    const [opcoesPolo, setOpcoes] = useState([]);
    const [error, setError] = useState(null);

    const fetchPolos = async () => {
        try {
            const token = 'tokenFixo';

            const response = await axios.get('http://localhost:8000/polo', {
                headers: {
                    Authorization: `${token}`
                }
            });
            const polos = response.data.data;
            
            setOpcoes(polos.map((polo) => ({
                value: polo.poloid,
                label: polo.descricao,
            })));
        } catch (error) {
            setError(error);
        }
    }

    useEffect(() => {
        fetchPolos();
    }, []);

    const handleAddEvent = async () => {
        try {
            const token = 'tokenFixo';
            await axios.post('http://localhost:8000/alerta/add', {
                utilizadorID: 1,
                texto: descricao,
                poloID: polo
            }, {
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                }
            });

            console.log('Alerta Adicionado');
            onClose();
        } catch (error) {
            console.error('Erro ao adicionar alerta:', error);
        }
    };

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <Modal open={open} onClose={onClose} >
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px' }}>
                <h2 style={{marginTop: 0, color: 'white'}}>Novo Alerta</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12 }}>
                    <div style={{ marginBottom: 15 }}>
                        <div style={{display:'flex', marginBottom: 20}}>
                            <div style={{width: '75%'}}>
                                <ComboBox caption='Polo' options={opcoesPolo} value={polo} handleChange={(e) => setPolo(e.target.value)} />
                            </div>
                        </div>
                        <BasicTextField caption='Descrição' valor={descricao} onchange={(e) => setDescricao(e.target.value)} fullwidth={true} />
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center', gap: '20px'}}>
                        <CancelButton onclick={() => { onClose(); }} caption='Cancelar' />
                        <SubmitButton onclick={handleAddEvent} caption='Guardar' />
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default NovoAlerta;
