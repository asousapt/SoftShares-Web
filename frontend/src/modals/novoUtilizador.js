import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Switch from '@mui/material/Switch';
import Grid from '@mui/joy/Grid';
import FormControlLabel from '@mui/material/FormControlLabel';
import BasicTextField from '../components/textFields/basic';
import ComboBox from '../components/combobox/comboboxBasic';
import SubmitButton from '../components/buttons/submitButton';
import CancelButton from '../components/buttons/cancelButton';

const opcoes = [
    {value: '1', label: 'teste'},
    {value: '2', label: 'teste2'},
];

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
    const [subcategoria, setSubcategoria] = useState('');

    const handleAddUser = () => {
        console.log('Utilizador Adicionado');
        onClose();
    };

    const handleChange = () => {
        setAtivo(!ativo);
    };

    return (
        <Modal open={open} onClose={onClose} >
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '1200px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px', overflow: 'auto' }}>
                <h2 style={{ marginTop: 0, color: 'white' }}>Novo Utilizador</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12 }}>
                    <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                    <Grid xs={9}>
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
                        </div>
                        </Grid>
                        <Grid xs={3}>
                            <img src='https://thumbs.web.sapo.io/?W=800&H=0&delay_optim=1&epic=MjJmSx42sjOskSqEptGdRZzWGoI3DvRWBX8Nt9rkAp0/OE/Y5esqVJNMb67nnHoPTXc0Hsopf9+DbKiPZzoS8bkm6zWQzYEderQBtgIEGpjFIOM=' alt="teste" style={{ width: '60%', maxWidth: '200px', height: 'auto', display: 'block', margin: '0 auto' }} />
                            <div style={{ marginBottom: 10 }}></div>
                            <FormControlLabel labelPlacement="start" control={<Switch checked={ativo} onChange={handleChange} sx={{ marginLeft: '150px' }} />} label={ativo ? "Ativo" : "Inativo"} />
                            <div style={{ marginBottom: 5 }}></div>
                            <FormControlLabel labelPlacement="start" control={<Switch defaultChecked  sx={{ marginLeft: '100px' }} />} label="Adminstrador" />
                            <div style={{ marginBottom: 15 }}></div>
                            <div style={{width: '90%'}}>
                                <ComboBox caption='Polos' options={opcoes} value={subcategoria} handleChange={(e) => setSubcategoria(e.target.value)} />
                            </div>  
                        </Grid>
                        <Grid xs={12}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                            <CancelButton onclick={() => { onClose(); }} caption='Cancelar' />
                            <SubmitButton onclick={handleAddUser} caption='Guardar' />
                        </div>
                        </Grid>
                    </Grid>
                </div>

            </div>
        </Modal>
    );
}

export default AddUserModal;