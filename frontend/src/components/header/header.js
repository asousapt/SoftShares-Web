import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Perfil from '../../modals/perfil'; 
import './header.css'

export default function Header({caption}){
    const [anchorPerfil, setAnchorPerfil] = useState(null);
    const openPerfil = Boolean(anchorPerfil);

    return(
    <div className="header">
        <h1 className="title">{caption}</h1>
        <div className="user-options">
            <IconButton onClick={(event) => setAnchorPerfil(event.currentTarget)} aria-controls={openPerfil ? 'account-menu' : undefined} aria-haspopup="true" aria-expanded={openPerfil ? 'true' : undefined}>
                <AccountCircleIcon /* onClick={handleAccountClick} */ fontSize="large" style={{color: 'white'}} />
            </IconButton>
        </div>
        <Perfil anchorEl={anchorPerfil} open={openPerfil} handleClose={() => setAnchorPerfil(null)} />
    </div>
    );
}