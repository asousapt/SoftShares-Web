import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './page.css';
/* COMPONENTES */
import DataTable from '../components/tables/dataTable';
import EditButton from '../components/buttons/editButton';
import Header from '../components/header/header';
import AddButton from '../components/buttons/addButton';
import Search from '../components/textFields/search';
import ComboFilter from '../components/combobox/comboFilter';
/* FIM COMPONENTES */
import NovoForm from '../modals/formulario/novoFormulario';

export default function ConfigForms() {
    const [isNewModalOpen, setNewModalOpen] = useState(false);
    const [filtroText, setFiltroText] = useState('');
    const [opcoesFiltroCat, setOpcoesCat] = useState([]);
    const [filtroCategoria, setFiltroCategoria] = useState(0);
    const [tableRows, setTableRows] = useState([]);
    const [error, setError] = useState('');

    const tableColumns = [
        { field: 'id', headerName: 'ID', width: 100, headerAlign: 'left' },
        { field: 'titulo', headerName: 'Título', flex: 1, headerAlign: 'left' },
        { field: 'subcategoria', headerName: 'Subcategoria', flex: 1, headerAlign: 'left' },
        { field: 'versao', headerName: 'Versão', flex: 0.5, headerAlign: 'left' },
        { field: 'edit', headerName: ' ', width: 100, headerAlign: 'left', sortable: false , renderCell: (row) => ( <EditButton caption=' ' /*onclick={} id={row.id}*/ />)},
    ];

    const fetchCategorias = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/categoria', {
                    headers: {
                        Authorization: `${token}`
                    }
                });
                const categorias = response.data;
                
                setOpcoesCat([
                    { value: 0, label: 'Sem Filtro' }, 
                    ...categorias.map((cat) => ({
                        value: cat.categoriaid,
                        label: cat.valorpt
                    }))
                ]);
        } catch (error) {
            setError(error);
        }
    };

    const fetchData = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/formulario/generico/filtro', {
                headers: {
                    Authorization: `${token}`
                },
                params: {
                    categoria: filtroCategoria,
                    descricao: filtroText
                }
            });
            const forms = response.data;

            setTableRows(forms.map((form) => ({
                key: form.formularioid,
                id: form.formularioid,
                titulo: form.descricao,
                subcategoria: form.valorpt,
                versao: form.versao,
            })));
        } catch (error) {
            setError(error);
        }
    };

    useEffect(() => {
        fetchCategorias();
    }, []);

    useEffect(() => {
        fetchData();
    }, [filtroCategoria, filtroText]);

    return(
        <div className="page-container">
            <Header caption='Formulários' />
            <div className="data-container">
                <div style={{marginBottom:'20px', paddingTop: '20px'}}>
                    <AddButton caption='Adicionar' onclick={() => setNewModalOpen(true)} />
                    <Search onchange={(e) => setFiltroText(e.target.value)} />
                    <ComboFilter options={opcoesFiltroCat} value={filtroCategoria} handleChange={(event) => setFiltroCategoria(event.target.value)} />
                </div>
                <div style={{ height: '65vh', width: '99%', overflowY: 'auto', paddingBottom: '40px',border: 'none', boxShadow: 'none'}}>
                    <DataTable rows={tableRows || []} columns={tableColumns}/>
                </div>
            </div>
            <NovoForm open={isNewModalOpen} onClose={() => setNewModalOpen(false)}/>
        </div>
    )
}