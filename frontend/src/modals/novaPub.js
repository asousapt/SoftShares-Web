import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import BasicTextField from '../components/textFields/basic';
import SubmitButton from '../components/buttons/submitButton';
import CancelButton from '../components/buttons/cancelButton';
import ImageTable from '../components/tables/imageTable';
import ComboBox from '../components/combobox/comboboxBasic';

const AddPubModal = ({ open, onClose }) => {
    const [title, setTitle] = useState('');
    const [localizacao, setLocalizacao] = useState('');
    const [description, setDescription] = useState('');
    const [subcategoria, setSubcategoria] = useState('');

    const handleAddEvent = () => {
        console.log('Publicação Adicionada');
        onClose(); 
    };

    const imgs = [
        {src: 'https://i1.sndcdn.com/artworks-000537542583-dr2w2s-t500x500.jpg', alt: 'testas'},
        {src: 'https://i1.sndcdn.com/artworks-000537542583-dr2w2s-t500x500.jpg', alt: 'testas'},
        {src: 'https://i1.sndcdn.com/artworks-000537542583-dr2w2s-t500x500.jpg', alt: 'testas'},
    ];

    const opcoes = [
        {value: '1', label: 'teste'},
        {value: '2', label: 'teste2'},
    ];

    return (
        <Modal open={open} onClose={onClose} >
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '1000px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px' }}>
                <h2 style={{marginTop: 0, color: 'white'}}>Nova Publicação</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20 ,borderRadius: 12}}>
                    <div style={{marginBottom: 15}}>
                    <div style={{ display: 'flex', marginBottom: 10 }}>
                            <div style={{ marginRight: 15}}>
                                <BasicTextField caption='Titulo' valor={title} onchange={(e) => setTitle(e.target.value)} style={{ width:"500px"}}/>
                            </div>
                            <div style={{ width:"55%"}} >
                            <ComboBox caption='Subcategoria' options={opcoes} value={subcategoria} handleChange={(e) => setSubcategoria(e.target.value)}/>
                            </div>
                        </div>
                        <div style={{marginBottom: 20}}></div>
                        <BasicTextField caption='Sub-Título' valor={localizacao} onchange={(e) => setLocalizacao(e.target.value)} fullwidth={true} />
                        {/* <BasicTextField caption='Sub-Título' valor={localizacao} onchange={(e) => setLocalizacao(e.target.value)} fullwidth={true} /> */}
                        <div style={{marginBottom: 20}}></div>
                        <BasicTextField multiline={true} caption='Descrição' valor={description} onchange={(e) => setDescription(e.target.value)} fullwidth={true}/>
                        <div style={{marginBottom: 20}}></div>
                        <ImageTable images={imgs}/>
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
export default AddPubModal;
