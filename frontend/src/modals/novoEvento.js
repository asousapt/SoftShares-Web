import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import BasicTextField from '../components/textFields/basic';
import ComboBox from '../components/combobox/comboboxBasic';
import DataHora from '../components/textFields/dataHora';
import SubmitButton from '../components/buttons/submitButton';
import CancelButton from '../components/buttons/cancelButton';

const opcoes = [
    {value: '1', label: 'teste'},
    {value: '2', label: 'teste2'},
];

const AddEventModal = ({ open, onClose }) => {
    const [title, setTitle] = useState('');
    const [localizacao, setLocalizacao] = useState('');
    const [description, setDescription] = useState('');
    const [numParticipantes, setNumParticipantes] = useState('');
    const [subcategoria, setSubcategoria] = useState('');

    const handleAddEvent = () => {
        console.log('Evento Adicionado');
        onClose(); 
    };
    
    return (
        <Modal open={open} onClose={onClose} >
            <div style={{ position: 'absolute', top: '25%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', backgroundColor: '#1D5AA1', padding: '20px' }}>
                <h2 style={{marginTop: 0, color: 'white'}}>Novo Evento</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 10, borderRadius: 12 }}>
                    <div style={{ marginBottom: 15 }}>
                        <BasicTextField caption='Titulo' valor={title} onchange={(e) => setTitle(e.target.value)} fullwidth={true} />
                        <BasicTextField caption='Localização' valor={localizacao} onchange={(e) => setLocalizacao(e.target.value)} fullwidth={true} />
                        <BasicTextField caption='Descrição' valor={description} onchange={(e) => setDescription(e.target.value)} fullwidth={true} />
                        <div style={{display: 'flex', gap: '10px'}}>
                            <BasicTextField caption='Nº Participantes Máximo' valor={numParticipantes} onchange={(e) => setNumParticipantes(e.target.value)} />
                            <BasicTextField caption='Nº Convidados Máximo' valor={numParticipantes} onchange={(e) => setNumParticipantes(e.target.value)} />
                            <DataHora />
                            <div style={{width: '25%'}}>
                                <ComboBox caption='Subcategoria' options={opcoes} value={subcategoria} handleChange={(e) => setSubcategoria(e.target.value)} />
                            </div>
                        </div>
                        {/* imagelist */}
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

export default AddEventModal;
