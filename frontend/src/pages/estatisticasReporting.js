import React, { useState, useEffect } from 'react';
import './page.css';
/* COMPONENTES */
import DataTable from '../components/tables/dataTable';
import EditButton from '../components/buttons/editButton';
import Header from '../components/header/header';
import AddButton from '../components/buttons/addButton';
import Search from '../components/textFields/search';
/* FIM COMPONENTES */
import NovoEvento from '../modals/eventos/novoEvento';

export default function StatsReporting() {

    return(
        <div className="page-container">
            <Header caption='Reporting' />
            <div className="data-container">
                <div style={{ height: '80vh', width: '99%', overflowY: 'auto', paddingBottom: '40px', border: 'none', boxShadow: 'none' }}>
                <div style={{marginBottom: 25}}></div>
                </div>
            </div>
        </div>
    )
}