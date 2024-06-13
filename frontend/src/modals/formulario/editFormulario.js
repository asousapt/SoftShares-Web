import React, { useState, useEffect, useRef  } from 'react';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
/* COMPONENTES */
import BasicTextField from '../../components/textFields/basic';
import SubmitButton from '../../components/buttons/submitButton';
import CancelButton from '../../components/buttons/cancelButton';
import FormBuilder from '../../components/forms/FormBuilder';
/* FIM COMPONENTES */

const EditFormulario = ({ open, onClose, idForm }) => {
    const [desc, setDesc] = useState('');
    const [categoria, setCategoria] = useState('');
    const [subcategoria, setSubcategoria] = useState('');
    const [initialQuestions , setInitialQuestions] = useState(null);

    const componentRef = useRef();
    
    const executeFunction = () => {
        componentRef.current.generateJSON();
    };

    const handleFormSubmit = async (data) => {
        data = JSON.parse(data);

        if (data.length === 0) {
            alert('Adicione alguma pergunta!');
            return;
        }

        for (let question of data) {
            console.log('question',question);
            if (!question.text.trim()) {
                alert('Preencha o texto de todas as perguntas!');
                return;
            }
        }

        if(!desc.trim() || !subcategoria){
            alert('Preencha todos os campos!')
            return
        }
        
        try{
            const token = sessionStorage.getItem('token');
            const novoForm = {
                descForm: desc,
                perguntas: data
            };
            await axios.post(`http://localhost:8000/formulario/${idForm}/versao/add`, novoForm, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                }
            });
            onClose();
        }catch(e){
            console.error('Erro ao adicionar evento:', e);
        }
    };

    const fetchData = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get(`http://localhost:8000/formulario/${idForm}`, {
                headers: {
                    Authorization: `${token}`
                }
            });
            const forms = response.data;
            
            setDesc(forms.descricao);

            const subcatResponse = await axios.get(`http://localhost:8000/subcategoria/${forms.subcategoriaid}`, {
                headers: { Authorization: `${token}` }
            });
            const subcat = subcatResponse.data;

            const catResponse = await axios.get(`http://localhost:8000/categoria/${subcat.categoriaid}`, {
                headers: { Authorization: `${token}` }
            });
            const cat = catResponse.data;
            setCategoria(cat.valorpt);
            setSubcategoria(subcat.valorpt);

            setInitialQuestions(forms.formDetails.map(detail => ({
                id: detail.formulariodetalhesid,
                type: detail.tipodados,
                text: detail.pergunta,
                options: detail.respostaspossiveis ? detail.respostaspossiveis.split(', ') : [],
                required: detail.obrigatorio,
                order: detail.ordem,
                minValue: detail.minimo,
                maxValue: detail.maximo
            })));
            
        } catch (error) {
            console.error("Erro ao encontrar o formulário", error);
        }
    }

    useEffect(() => {
        fetchData();
    }, [idForm]);

    return (
        <Modal open={open} onClose={onClose} >
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px' }}>
                <h2 style={{marginTop: 0, color: 'white'}}>Editar Formulario</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12 }}>
                    <div style={{ marginBottom: 15 }}>
                        <BasicTextField caption='Descrição' valor={desc} onchange={(e) => setDesc(e.target.value)} fullwidth={true} />
                        <div style={{ display: 'flex', marginTop: 20, gap: 10 }}>
                            <div style={{ display: 'flex', gap: 10, width: '100%' }}>
                                <div style={{ width: '50%' }}>
                                    <BasicTextField caption='Categoria' valor={categoria} onchange={() => {}} fullwidth={true} disabled={true} />
                                </div>
                                <div style={{ width: '50%' }}>
                                    <BasicTextField caption='Subcategoria' valor={subcategoria} onchange={() => {}} fullwidth={true} disabled={true} />
                                </div>
                            </div>
                        </div>
                        <div style={{ overflowY: 'auto', maxHeight: '50vh', marginTop: 20 }}>
                            <FormBuilder ref={componentRef} onFormSubmit={handleFormSubmit} initialQuestions={initialQuestions}/>
                        </div>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center', gap: '20px'}}>
                        <CancelButton onclick={() => { onClose(); }} caption='Cancelar' />
                        <SubmitButton onclick={executeFunction} caption='Guardar' />
                    </div>
                </div>
            </div>
        </Modal>
    );
}


export default EditFormulario;