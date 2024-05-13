import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Perfil from '../../modals/perfil'; 
import Notificacoes from '../../modals/notificacoes';
import Badge from '@mui/material/Badge';

import './header.css'

const linhas=[
    {value:'teste'},
    {value:'teste'},
    {value:'teste'},
    {value:'teste'},
    {value:'teste'},
    {value:'teste'},
    {value:'teste'},
    {value:'teste'}
];

export default function Header({caption}){
    const [anchorPerfil, setAnchorPerfil] = useState(null);
    const openPerfil = Boolean(anchorPerfil);

    const [anchorNotificacoes, setAnchorNotificacoes] = useState(null);
    const openNotificacoes = Boolean(anchorNotificacoes);

    return(
    <div className="header">
        <h1 className="title">{caption}</h1>
        <div className="user-options">
            <IconButton onClick={(event) => setAnchorNotificacoes(event.currentTarget)} aria-controls={openNotificacoes ? 'account-menu' : undefined} aria-haspopup="true" aria-expanded={openNotificacoes ? 'true' : undefined} > 
                <Badge color="secondary" badgeContent={99}>
                    <NotificationsIcon /* onClick={handleNotificationsClick} */ fontSize="large" style={{color: 'white'}} size="small"/>
                </Badge>
            </IconButton>
            <IconButton onClick={(event) => setAnchorPerfil(event.currentTarget)} aria-controls={openPerfil ? 'account-menu' : undefined} aria-haspopup="true" aria-expanded={openPerfil ? 'true' : undefined}>
                <AccountCircleIcon /* onClick={handleAccountClick} */fontSize="large" style={{color: 'white'}} />
            </IconButton>
        </div>
        <Perfil anchorEl={anchorPerfil} open={openPerfil} handleClose={() => setAnchorPerfil(null)} />
        <Notificacoes anchorEl={anchorNotificacoes} open={openNotificacoes} handleClose={() => setAnchorNotificacoes(null)} rows={linhas || []} />
    </div>
    );
}