import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import BasicTextField from '../components/textFields/basic';
import ComboBox from '../components/combobox/comboboxBasic';
import InputImage from '../components/image/imageInput';
import SubmitButton from '../components/buttons/submitButton';
import CancelButton from '../components/buttons/cancelButton';

const opcoes = [
    {value: '1', label: 'teste'},
    {value: '2', label: 'teste2'},
];

const NovoPolo = ({ open, onClose }) => {
    const [descricao, setDescricao] = useState('');
    const [distrito, setDistrito] = useState('');
    const [cidade, setCidade] = useState('');
    const [morada, setMorada] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [responsavel, setResponsavel] = useState('');
    const [image, setImage] = useState('https://i1.sndcdn.com/artworks-000537542583-dr2w2s-t500x500.jpg');

    const handleAddEvent = () => {
        console.log('Evento Adicionado');
        onClose(); 
    };
    
    return (
        <Modal open={open} onClose={onClose} >
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px' }}>
                <h2 style={{marginTop: 0, color: 'white'}}>Novo Polo</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12 }}>
                    <div style={{ marginBottom: 15 }}>
                        <BasicTextField caption='Descrição' valor={descricao} onchange={(e) => setDescricao(e.target.value)} fullwidth={true} />
                        <div style={{display:'flex', marginTop: 20, gap: 5}}>
                            <div style={{width: '50%'}}>
                                <ComboBox caption='Distrito' options={opcoes} value={distrito} handleChange={(e) => setDistrito(e.target.value)} />
                            </div>
                            <div style={{width: '50%'}}>
                                <ComboBox caption='Cidade' options={opcoes} value={cidade} handleChange={(e) => setCidade(e.target.value)} />
                            </div>
                        </div>
                        <div style={{marginTop: 20}}>
                            <BasicTextField caption='Morada' valor={morada} onchange={(e) => setMorada(e.target.value)} fullwidth={true} />
                        </div>
                        <div style={{display:'flex', marginTop: 20, gap: 5}}>
                            <div style={{width: '34%'}}>
                            <BasicTextField caption='Email' valor={email} onchange={(e) => setEmail(e.target.value)} fullwidth={true} />
                            </div>
                            <div style={{width: '33%'}}>
                                <BasicTextField caption='Telefone' valor={telefone} onchange={(e) => setTelefone(e.target.value)} fullwidth={true} />
                            </div>
                            <div style={{width: '33%'}}>
                                <ComboBox caption='Responsável' options={opcoes} value={responsavel} handleChange={(e) => setResponsavel(e.target.value)} />
                            </div>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'center', marginTop: 10}}>
                            <InputImage image={image} />
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

export default NovoPolo;
