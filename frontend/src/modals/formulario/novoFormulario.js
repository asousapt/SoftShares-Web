import React, { useState, useEffect, useRef  } from 'react';
import axios from 'axios';
import Modal from '@mui/material/Modal';
/* COMPONENTES */
import BasicTextField from '../../components/textFields/basic';
import ComboBox from '../../components/combobox/comboboxBasic';
import SubmitButton from '../../components/buttons/submitButton';
import CancelButton from '../../components/buttons/cancelButton';
import FormBuilder from '../../components/forms/FormBuilder';
/* FIM COMPONENTES */

const NovoFormulario = ({ open, onClose }) => {
    const [desc, setDesc] = useState('');
    const [categoria, setCategoria] = useState('');
    const [opcoesCat, setOpcoesCat] = useState([]);
    const [subcategoria, setSubcategoria] = useState('');
    const [opcoesSubcat, setOpcoesSubcat] = useState([]);
    const [formData, setFormData] = useState(null);

    const componentRef = useRef();
 // Exemplo JSON: [{"id":1,"type":"shortAnswer","text":"","options":[],"required":false},{"id":2,"type":"multipleChoice","text":"","options":["Opção 1","Opção 2"],"required":false}]
    
    const executeFunction = () => {
        componentRef.current.generateJSON();
    };
    
    const handleFormSubmit = async (data) => {
        setFormData(data);

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
                idRegisto: subcategoria,
                tipoConfig: 'SUBCAT',
                tipoForm: 'GENERICO',
                descForm: desc,
                perguntas: data
            };
            await axios.post('http://localhost:8000/formulario/add', novoForm, {
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

    const fetchCategorias = async () => {
        const token = sessionStorage.getItem('token');

        const response = await axios.get('http://localhost:8000/categoria', {
            headers: {
                Authorization: `${token}`
            }
        });
        const categorias = response.data;
        
        setOpcoesCat(
            categorias.map((cat) => ({
                value: cat.categoriaid,
                label: cat.valorpt
            }))
        );
    }

    const fetchSubcategorias = async (catID) => {
        const token = sessionStorage.getItem('token');

        const response = await axios.get('http://localhost:8000/subcategoria/categoria/'+catID, {
            headers: {
                Authorization: `${token}`
            }
        });
        const subcategorias = response.data;
        
        setOpcoesSubcat(
            subcategorias.map((subcat) => ({
                value: subcat.subcategoriaid,
                label: subcat.valorpt
            }))
        );
    }

    const handleCategoriaChange = (e) => {
        setCategoria(e.target.value);
        setSubcategoria(null);
        if (e.target.value) {
            fetchSubcategorias(e.target.value);
        } else {
            setSubcategoria([]);
        }
    };

    useEffect(() => {
        fetchCategorias();
    }, []);

    return (
        <Modal open={open} onClose={onClose} >
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px' }}>
                <h2 style={{marginTop: 0, color: 'white'}}>Novo Formulario</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12 }}>
                    <div style={{ marginBottom: 15 }}>
                        <BasicTextField caption='Descrição' valor={desc} onchange={(e) => setDesc(e.target.value)} fullwidth={true} />
                        <div style={{ display: 'flex', marginTop: 20, gap: 10 }}>
                            <div style={{ display: 'flex', gap: 10, width: '100%' }}>
                                <div style={{width: '50%'}}>
                                    <ComboBox caption='Categoria' options={opcoesCat} value={categoria} handleChange={handleCategoriaChange} />
                                </div>
                                <div style={{width: '50%'}}>
                                    <ComboBox caption='Subcategoria' options={opcoesSubcat} value={subcategoria} handleChange={(e) => setSubcategoria(e.target.value)} />
                                </div>
                            </div>
                        </div>
                        <div style={{ overflowY: 'auto', maxHeight: '50vh', marginTop: 20 }}>
                            <FormBuilder ref={componentRef} onFormSubmit={handleFormSubmit} />
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


export default NovoFormulario;