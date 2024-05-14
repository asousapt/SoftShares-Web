import React, { useState, useEffect } from 'react';
import './page.css';
import Forms from '../components/forms/forms';

/* COMPONENTES */
import DataTable from '../components/tables/dataTable';
import EditButton from '../components/buttons/editButton';
import Header from '../components/header/header';
import AddButton from '../components/buttons/addButton';
import Search from '../components/textFields/search';
/* FIM COMPONENTES */
import NovoEvento from '../modals/eventos/novoEvento';

export default function StatsUtilizador() {

    return(
        <div className="page-container">
            <Header caption='Forms' />
            <div className="data-container">
                <div style={{ marginBottom: '40px'}}>
                </div>
                <div style={{ height: '65vh', width: '99%', overflowY: 'auto', paddingBottom: '40px', border: 'none', boxShadow: 'none' }}>
                <Forms></Forms>
                </div>
            </div>
        </div>
    )
}