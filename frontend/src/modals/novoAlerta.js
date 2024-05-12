import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import BasicTextField from '../components/textFields/basic';
import ComboBox from '../components/combobox/comboboxBasic';
import SubmitButton from '../components/buttons/submitButton';
import CancelButton from '../components/buttons/cancelButton';

const opcoes = [
    {value: '1', label: 'teste'},
    {value: '2', label: 'teste2'},
];

const NovoAlerta = ({ open, onClose }) => {
    const [descricao, setDescricao] = useState('');
    const [polo, setPolo] = useState('');

    const handleAddEvent = () => {
        console.log('Evento Adicionado');
        onClose(); 
    };
    
    return (
        <Modal open={open} onClose={onClose} >
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px' }}>
                <h2 style={{marginTop: 0, color: 'white'}}>Novo Alerta</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12 }}>
                    <div style={{ marginBottom: 15 }}>
                        <BasicTextField caption='Descrição' valor={descricao} onchange={(e) => setDescricao(e.target.value)} fullwidth={true} />
                        <div style={{marginTop: 20, width: '50%'}}>
                        <ComboBox caption='Subcategoria' options={opcoes} value={polo} handleChange={(e) => setPolo(e.target.value)} />
                        </div>
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
