import React, { useState, useEffect } from 'react';
import './page.css';
/* COMPONENTES */
import Header from '../components/header/header';
/* FIM COMPONENTES */

export default function StatsUtilizador() {

    return(
        <div className="page-container">
            <Header caption='Painel de Controlo' />
            <div className="data-container">
                <div style={{ marginBottom: '40px'}}>
                <h2 style={{ marginBottom: '20px', textAlign: 'center'}} >Estatísticas Utilizadores</h2>
                </div>
                <div style={{ height: '65vh', width: '99%', overflowY: 'auto', paddingBottom: '40px', border: 'none', boxShadow: 'none' }}>
        
                </div>
            </div>
        </div>
    )
}