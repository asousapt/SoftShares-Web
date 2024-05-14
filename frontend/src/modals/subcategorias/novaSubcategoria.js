import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import BasicTextField from '../../components/textFields/basic';
import ComboBox from '../../components/combobox/comboboxBasic';
import SubmitButton from '../../components/buttons/submitButton';
import CancelButton from '../../components/buttons/cancelButton';

const opcoes = [
    {value: '1', label: 'teste'},
    {value: '2', label: 'teste2'},
];

const NovaSubcategoria = ({ open, onClose }) => {
    const [descricao, setDescricao] = useState('');
    const [categoria, setCategoria] = useState('');
    const [descricaoENG, setDescricaoENG] = useState('');
    const [descricaoSPA, setDescricaoSPA] = useState('');

    const handleAddEvent = () => {
        console.log('Evento Adicionado');
        onClose(); 
    };
    
    return (
        <Modal open={open} onClose={onClose} >
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px' }}>
                <h2 style={{marginTop: 0, color: 'white'}}>Novo Subcategoria</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12 }}>
                    <div style={{ marginBottom: 15 }}>
                        <div style={{display:'flex', marginBottom: 20}}>
                            <div style={{width: '75%'}}>
                                <ComboBox caption='Categoria' options={opcoes} value={categoria} handleChange={(e) => setCategoria(e.target.value)} />
                            </div>
                        </div>
                        <BasicTextField caption='Descrição Porgugues' valor={descricao} onchange={(e) => setDescricao(e.target.value)} fullwidth={true} />
                        <div style={{ marginBottom: 25 }}></div>
                        <BasicTextField caption='Descrição Inglês' valor={descricaoENG} onchange={(e) => setDescricaoENG(e.target.value)} fullwidth={true} />
                        <div style={{ marginBottom: 25 }}></div>
                        <BasicTextField caption='Descrição Espanhol' valor={descricaoSPA} onchange={(e) => setDescricaoSPA(e.target.value)} fullwidth={true} />
                        <div style={{ marginBottom: 25 }}></div>
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

export default NovaSubcategoria;
