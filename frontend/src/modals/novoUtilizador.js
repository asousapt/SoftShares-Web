import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import BasicTextField from '../components/textFields/basic';
import ComboBox from '../components/combobox/comboboxBasic';
import SubmitButton from '../components/buttons/submitButton';
import CancelButton from '../components/buttons/cancelButton';


const AddUserModal = ({ open, onClose }) => {
    const [title, setTitle] = useState('');
    const [morada, setMorada] = useState('');
    const [idade, setIdade] = useState('');
    const [departamento, setDepartamento] = useState('');
    const [contacto, setContacto] = useState('');
    const [funcao, setFuncao] = useState('');
    const [email, setEmail] = useState('');
    const [estadoCivil, setEstadoCiv] = useState('');
    const [ativo, setAtivo] = useState(true);
    
    const handleAddUser = () => {
        console.log('Utilizador Adicionado');
        onClose();
    };

    const handleChange = () => {
        setAtivo(!ativo);
    };

    return (
        <Modal open={open} onClose={onClose} >
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '1000px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px', overflow: 'auto' }}>
                <h2 style={{ marginTop: 0, color: 'white' }}>Novo Utilizador</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12 }}>
                    <div style={{ marginBottom: 15 }}>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <BasicTextField caption='Nome' valor={title} onchange={(e) => setTitle(e.target.value)} style={{ width: "400px" }} />
                            <div style={{ marginBottom: 20 }}></div>
                            <BasicTextField caption='Morada' valor={morada} onchange={(e) => setMorada(e.target.value)} style={{ width: "400px" }} />
                        </div>
                        <div style={{ marginBottom: 20 }}></div>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <BasicTextField caption='Idade' valor={idade} onchange={(e) => setIdade(e.target.value)} style={{ width: "400px" }} />
                            <div style={{ marginBottom: 20 }}></div>
                            <BasicTextField caption='Departamento' valor={departamento} onchange={(e) => setDepartamento(e.target.value)} style={{ width: "400px" }} />
                        </div>
                        <div style={{ marginBottom: 20 }}></div>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <BasicTextField caption='Contacto' valor={contacto} onchange={(e) => setContacto(e.target.value)} style={{ width: "400px" }} />
                            <div style={{ marginBottom: 20 }}></div>
                            <BasicTextField caption='Função' valor={funcao} onchange={(e) => setFuncao(e.target.value)} style={{ width: "400px" }} />
                        </div>
                        <div style={{ marginBottom: 20 }}></div>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <BasicTextField caption='Email' valor={email} onchange={(e) => setEmail(e.target.value)} style={{ width: "400px" }} />
                            <div style={{ marginBottom: 20 }}></div>
                            <BasicTextField caption='Estado Civil' valor={estadoCivil} onchange={(e) => setEstadoCiv(e.target.value)} style={{ width: "400px" }} />
                        </div>
                        <FormControlLabel labelPlacement="start" control={<Switch checked={ativo} onChange={handleChange} />} label={ativo ? "Ativo" : "Inativo"} />
                        <FormControlLabel labelPlacement="start" control={<Switch defaultChecked />} label="Adminstrador" />
                    </div>
                    <div style={{ marginBottom: 20 }}></div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        <CancelButton onclick={() => { onClose(); }} caption='Cancelar' />
                        <SubmitButton onclick={handleAddUser} caption='Guardar' />
                    </div>
                </div>
            </div>
        </Modal>
    );

}

export default AddUserModal;