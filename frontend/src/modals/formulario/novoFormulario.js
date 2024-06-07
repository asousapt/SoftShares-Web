import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '@mui/material/Modal';
/* COMPONENTES */
import BasicTextField from '../../components/textFields/basic';
import ComboBox from '../../components/combobox/comboboxBasic';
import SubmitButton from '../../components/buttons/submitButton';
import CancelButton from '../../components/buttons/cancelButton';
import FormBuilder from '../../components/forms/FormBuilder';
/* FIM COMPONENTES */

const tiposFormulario =[
    { value:'subcat', label: 'Subcategoria (Pontos de Interesse)'},
    { value:'satisfacao', label: 'Satisfação de Eventos'}
];

const NovoFormulario = ({ open, onClose }) => {
    const [titulo, setTitulo] = useState('');
    const [tipo, setTipo] = useState('');

    return (
        <Modal open={open} onClose={onClose} >
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px' }}>
                <h2 style={{marginTop: 0, color: 'white'}}>Novo Formulario</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12 }}>
                    <div style={{ marginBottom: 15 }}>
                        <BasicTextField caption='Titulo' valor={titulo} onchange={(e) => setTitulo(e.target.value)} fullwidth={true} />
                        <div style={{ display: 'flex', marginTop: 20, gap: 10 }}>
                            <div style={{ width: '50%' }}>
                                <ComboBox
                                    caption='Tipo de Formulário'
                                    options={tiposFormulario}
                                    value={tipo}
                                    handleChange={(e) => setTipo(e.target.value)}
                                />
                            </div>
                            {tipo === 'subcat' && (
                                <div style={{ width: '25%' }}>
                                <ComboBox
                                    caption='Subcategoria'
                                    options={tiposFormulario}
                                    value={tipo}
                                    handleChange={(e) => setTipo(e.target.value)}
                                />
                                </div>
                            )}
                            {tipo === 'satisfacao' && (
                                <div style={{ width: '25%' }}>
                                <ComboBox
                                    caption='Evento'
                                    options={tiposFormulario}
                                    value={tipo}
                                    handleChange={(e) => setTipo(e.target.value)}
                                />
                                </div>
                            )}
                        </div>
                        <div style={{ overflowY: 'auto', maxHeight: '50vh', marginTop: 20 }}>
                            <FormBuilder />
                        </div>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center', gap: '20px'}}>
                        <CancelButton onclick={() => { onClose(); }} caption='Cancelar' />
                        <SubmitButton onclick={() => {}} caption='Guardar' />
                    </div>
                </div>
            </div>
        </Modal>
    );
}


export default NovoFormulario;