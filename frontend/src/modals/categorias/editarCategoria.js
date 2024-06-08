import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '@mui/material/Modal';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import BasicTextField from '../../components/textFields/basic';
import SubmitButton from '../../components/buttons/submitButton';
import CancelButton from '../../components/buttons/cancelButton';

const EditarCategoria = ({ open, onClose, categoriaId }) => {
    const [descricao, setDescricaoPT] = useState('');
    const [descricaoENG, setDescricaoEN] = useState('');
    const [descricaoSPA, setDescricaoES] = useState('');
    const [inactivo, setInactivo] = useState(false);

    useEffect(() => {
        if (categoriaId && open) {
            const fetchCategoria = async () => {
                try {
                    const token = 'tokenFixo';
                    const response = await axios.get(`http://localhost:8000/categoria/${categoriaId}`, {
                        headers: {
                            Authorization: `${token}`,
                        },
                    });
                    const categoria = response.data;

                    if (categoria) {
                        setDescricaoPT(categoria.valorpt || '');
                        setDescricaoEN(categoria.valoren || '');
                        setDescricaoES(categoria.valores || '');
                        setInactivo(categoria.inactivo || false);
                    }
                } catch (error) {
                    console.error('Erro ao buscar categoria:', error);
                }
            };

            if (categoriaId) {
                fetchCategoria();
            }
        }
    }, [categoriaId]);

    const handleUpdateEvent = async () => {
        if (!descricao.trim() || !descricaoENG.trim() || !descricaoSPA.trim()) {
            alert('Preencha todos os campos!');
            return;
        }

        try {
            const token = 'tokenFixo';
            await axios.put(`http://localhost:8000/categoria/update/${categoriaId}`, {
                descricaoPT: descricao,
                descricaoEN: descricaoENG,
                descricaoES: descricaoSPA,
                inactivo
            }, {
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                }
            });

            console.log('Categoria Atualizada');
            onClose();
        } catch (error) {
            console.error('Erro ao atualizar categoria:', error);
        }
    };

    const handleChangeAtivo = (event) => {
        setInactivo(event.target.checked);
    };

    return (
        <Modal open={open} onClose={onClose} >
            <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', maxWidth: '80%', maxHeight: '80%', backgroundColor: '#1D5AA1', padding: '20px' }}>
                <h2 style={{ marginTop: 0, color: 'white' }}>Editar Categoria</h2>
                <div style={{ backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, paddingBottom: 20, paddingTop: 20, borderRadius: 12 }}>
                    <div style={{ marginBottom: 25 }}>
                        <BasicTextField caption='Descrição Portugues' valor={descricao} onchange={(e) => setDescricaoPT(e.target.value)} fullwidth={true} />
                        <div style={{ marginBottom: 25 }}></div>
                        <BasicTextField caption='Descrição Inglês' valor={descricaoENG} onchange={(e) => setDescricaoEN(e.target.value)} fullwidth={true} />
                        <div style={{ marginBottom: 25 }}></div>
                        <BasicTextField caption='Descrição Espanhol' valor={descricaoSPA} onchange={(e) => setDescricaoES(e.target.value)} fullwidth={true} />
                        <div style={{ marginBottom: 25 }}></div>
                    </div>
                    <div style={{ marginBottom: 15 }}>
                        <FormControlLabel
                            control={<Switch checked={inactivo} onChange={handleChangeAtivo} />}
                            label="Inativo"
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        <CancelButton onclick={() => { onClose(); }} caption='Cancelar' />
                        <SubmitButton onclick={handleUpdateEvent} caption='Guardar' />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default EditarCategoria;
