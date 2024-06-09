import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import BasicTextField from '../../components/textFields/basic';
import ComboBox from '../../components/combobox/comboboxBasic';
import SubmitButton from '../../components/buttons/submitButton';
import CancelButton from '../../components/buttons/cancelButton';
import axios from 'axios';

const NovaSubcategoria = ({ open, onClose, subcategoriaId, onEdit }) => {
    const [descricaoPT, setDescricaoPT] = useState('');
    const [categoria, setCategoria] = useState('');
    const [descricaoEN, setDescricaoEN] = useState('');
    const [descricaoES, setDescricaoES] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const response = await axios.get('http://localhost:8000/categoria', {
                    headers: {
                        Authorization: `${token}`
                    }
                });
                const categorias = response.data;
                setCategories(categorias.map(cat => ({ value: cat.categoriaid, label: cat.valorpt })));
            } catch (error) {
                console.error("Erro ao encontrar a categoria", error);
            }
        };

        fetchCategorias();
    }, []);

    const handleAddEvent = async () => {
        if (!descricaoPT.trim() || !descricaoEN.trim() || !descricaoES.trim() || !categoria) {
            alert('Preencha todos os campos!');
            return;
        }
    
        try {
            const token = sessionStorage.getItem('token');
            await axios.post(`http://localhost:8000/subcategoria/add`, {
                categoriaID: categoria,
                descricaoPT: descricaoPT,
                descricaoEN: descricaoEN,
                descricaoES: descricaoES,
            }, {
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                }
            });
            onClose();
        } catch (error) {
            console.error("Erro ao adicionar a subcategoria", error);
        }
    };
    

    return (
        <Modal open={open} onClose={onClose}>
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px' }}>
                <h2 style={{ marginTop: 0, color: 'white' }}>Nova Subcategoria</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12 }}>
                    <div style={{ marginBottom: 15 }}>
                        <div style={{ display: 'flex', marginBottom: 20 }}>
                            <div style={{ width: '75%' }}>
                                <ComboBox caption='Categoria' options={categories} value={categoria} handleChange={(e) => setCategoria(e.target.value)} />
                            </div>
                        </div>
                        <BasicTextField caption='Descrição Português' valor={descricaoPT} onchange={(e) => setDescricaoPT(e.target.value)} fullwidth={true} />
                        <div style={{ marginBottom: 25 }}></div>
                        <BasicTextField caption='Descrição Inglês' valor={descricaoEN} onchange={(e) => setDescricaoEN(e.target.value)} fullwidth={true} />
                        <div style={{ marginBottom: 25 }}></div>
                        <BasicTextField caption='Descrição Espanhol' valor={descricaoES} onchange={(e) => setDescricaoES(e.target.value)} fullwidth={true} />
                        <div style={{ marginBottom: 25 }}></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        <CancelButton onclick={() => { onClose(); }} caption='Cancelar' />
                        <SubmitButton onclick={handleAddEvent} caption='Guardar' />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default NovaSubcategoria;