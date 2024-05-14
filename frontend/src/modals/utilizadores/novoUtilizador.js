import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import BasicTextField from '../../components/textFields/basic';
import ComboBox from '../../components/combobox/comboboxBasic';
import SubmitButton from '../../components/buttons/submitButton';
import CancelButton from '../../components/buttons/cancelButton';
import InputImage from '../../components/image/imageInput';

const opcoes = [
    { value: '1', label: 'teste' },
    { value: '2', label: 'teste2' },
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
    const [image, setImage] = useState('https://i0.wp.com/ctmirror-images.s3.amazonaws.com/wp-content/uploads/2021/01/dummy-man-570x570-1.png?fit=570%2C570&ssl=1');

    const handleAddUser = () => {
        console.log('Utilizador Adicionado');
        onClose();
    };

    const handleChange = () => {
        setAtivo(!ativo);
    };

    return (
        <Modal open={open} onClose={onClose}>
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '1000px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px', overflow: 'auto' }}>
                <h2 style={{ marginTop: 0, color: 'white' }}>Novo Utilizador</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ flex: '65%', paddingRight: 15 }}>
                            <div style={{ marginBottom: 15 }}>
                                <div style={{ display: 'flex', marginTop: 20, gap: 10 }}>
                                    <div style={{ width: "60%" }} >
                                        <BasicTextField caption='Nome' valor={title} onchange={(e) => setTitle(e.target.value)} fullwidth={true}/>
                                    </div>
                                    <div style={{ width: "40%" }} >
                                        <BasicTextField caption='Data Nascimento' valor={idade} onchange={(e) => setIdade(e.target.value)} fullwidth={true} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', marginTop: 20, gap: 10 }}>
                                    <BasicTextField caption='Morada' valor={morada} onchange={(e) => setMorada(e.target.value)} fullwidth={true} />
                                </div>
                                <div style={{ display: 'flex', marginTop: 20, gap: 10 }}>
                                    <div style={{ width: "80%" }} >
                                        <BasicTextField caption='Contacto' valor={contacto} onchange={(e) => setContacto(e.target.value)} fullwidth={true} />
                                    </div>
                                    <div style={{ width: "65%" }} >
                                        <ComboBox caption='Função' options={opcoes} value={subcategoria} handleChange={(e) => setSubcategoria(e.target.value)} />
                                    </div>
                                    <div style={{ width: "65%" }} >
                                        <ComboBox caption='Departamento' options={opcoes} value={subcategoria} handleChange={(e) => setSubcategoria(e.target.value)} />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', marginTop: 20, gap: 10 }}>
                                    <div style={{ width: "95%" }} >
                                        <BasicTextField caption='Email' valor={email} onchange={(e) => setEmail(e.target.value)} fullwidth={true} />
                                    </div>
                                    <div style={{ width: "42%" }} >
                                        <ComboBox caption='Polo' options={opcoes} value={subcategoria} handleChange={(e) => setSubcategoria(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex'}}>
                            <div style={{ padding: '20px' }}>
                                <div style={{ paddingLeft: '5%' }}>
                                    <InputImage image={image} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <FormControlLabel labelPlacement="start" control={<Switch defaultChecked />} label="Inativo" sx={{ marginTop: '10px' }} />
                                <FormControlLabel labelPlacement="start" control={<Switch defaultChecked />} label="Adminstrador" sx={{ marginTop: '10px'}} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
                        <CancelButton onclick={() => { onClose(); }} caption='Cancelar' />
                        <SubmitButton onclick={handleAddUser} caption='Guardar' />
                    </div>
                </div>
            </div>
        </Modal>
    );

}

export default AddUserModal;