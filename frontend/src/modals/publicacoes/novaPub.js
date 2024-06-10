import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import BasicTextField from '../../components/textFields/basic';
import SubmitButton from '../../components/buttons/submitButton';
import CancelButton from '../../components/buttons/cancelButton';
import ImageTable from '../../components/tables/imageTable';

const AddPublicacao = ({ open, onClose }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [opcoesCat, setOpcoesCat] = useState([]);
    const [categoria, setCategoria] = useState(null);
    const [opcoesSubcat, setOpcoesSubcat] = useState([]);
    const [subcategoria, setSubcategoria] = useState(null);
    const [error, setError] = useState(null);

    const fetchCategorias = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get(`http://localhost:8000/categoria`, {
                headers: { Authorization: `${token}` }
            });
            const categorias = response.data;

            setOpcoesCat(categorias.map((cat) => ({
                value: cat.categoriaid,
                label: cat.valorpt
            })));
        } catch (error) {
            setError(error);
        }
    }

    const handleCategoriaChange = async (event, newValue) => {
        setCategoria(newValue);
        setSubcategoria(null);
        if (newValue) {
            try {
                const token = sessionStorage.getItem('token');
                const response = await axios.get(`http://localhost:8000/subcategoria/categoria/${newValue.value}`, {
                    headers: { Authorization: `${token}` }
                });
                const subcategorias = response.data;
                const subcategoriasOptions = subcategorias.map((subcat) => ({
                    value: subcat.subcategoriaid,
                    label: subcat.valorpt
                }));
                setOpcoesSubcat(subcategoriasOptions);
            } catch (error) {
                setError(error);
            }
        } else {
            setOpcoesSubcat([]);
            setSubcategoria(null);
        }
    };

    const handleAddEvent = async () => {
        try {
            if (!subcategoria || !title.trim() || !description.trim()) {
                alert('Preencha todos os campos!');
                return;
            }
            
            const userid = sessionStorage.getItem('userid');
            const token = sessionStorage.getItem('token');
            const novaPublicacao = {
                subcategoriaid: subcategoria.value,
                utilizadorid: userid,
                titulo: title,
                mensagem: description,
                idiomaid: 1
            };
            console.log(novaPublicacao);
            await axios.post('http://localhost:8000/thread/add', novaPublicacao, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                }
            });
            onClose();
        } catch (error) {
            console.error('Erro ao adicionar evento:', error);
        }
    };

    useEffect(() => {
        fetchCategorias();
    }, []);

    return (
        <Modal open={open} onClose={onClose} >
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '1000px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px' }}>
                <h2 style={{marginTop: 0, color: 'white'}}>Nova Publicação</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20 ,borderRadius: 12}}>
                    <div style={{marginBottom: 15}}>
                        <div style={{ display: 'flex', marginBottom: 10, gap: 10 }}>
                            <div style={{ width: '50%'}} >
                                <BasicTextField caption='Titulo' valor={title} onchange={(e) => setTitle(e.target.value)} fullwidth={true} />
                            </div>
                            <div style={{ width: '25%' }}>
                                <Autocomplete
                                    options={opcoesCat}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => <TextField {...params} label="Categoria" variant="outlined" />}
                                    value={categoria}
                                    onChange={handleCategoriaChange}
                                    fullWidth={true}
                                />
                            </div>
                            <div style={{ width: '25%' }}>
                                <Autocomplete
                                    options={opcoesSubcat}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => <TextField {...params} label="Subcategoria" variant="outlined" />}
                                    value={subcategoria}
                                    onChange={(event, newValue) => { setSubcategoria(newValue); }}
                                    fullWidth={true}
                                />
                            </div>
                        </div>
                        <div style={{marginBottom: 20}}>
                            <BasicTextField multiline={true} caption='Descrição' valor={description} onchange={(e) => setDescription(e.target.value)} fullwidth={true}/>
                        </div>
                        <div style={{marginBottom: 20}}>
                            <ImageTable images={[]}/>
                        </div>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center', gap: '20px'}}>
                        <CancelButton onclick={() => onClose()} caption='Cancelar' />
                        <SubmitButton onclick={handleAddEvent} caption='Guardar' />
                    </div>
                </div>
            </div>
        </Modal>
    );
}
export default AddPublicacao;
