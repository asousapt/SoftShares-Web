import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Perfil from '../../modals/perfil'; 
import AlterarPassword from '../../modals/utilizadores/alterarPassword'; 
import Alert from '../../components/alerts/alert';
import './header.css'

export default function Header({caption}){
    const [anchorPerfil, setAnchorPerfil] = useState(null);
    const openPerfil = Boolean(anchorPerfil);
    const [idUser, setIdUser] = useState(sessionStorage.getItem('userid'));
    const [isPassModalOpen, setIsPassModalOpen] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertProps, setAlertProps] = useState({ title: '', label: '', severity: '' });

    useEffect(() => {
        const open = sessionStorage.getItem('primeirologin');
        if (open === "true"){
            setIsPassModalOpen(true);
        }else{
            setIsPassModalOpen(false);
        }
    }, []);

    return(
    <div className="header">
        <h1 className="title">{caption}</h1>
        <div className="user-options">
            <IconButton onClick={(event) => setAnchorPerfil(event.currentTarget)} aria-controls={openPerfil ? 'account-menu' : undefined} aria-haspopup="true" aria-expanded={openPerfil ? 'true' : undefined}>
                <AccountCircleIcon /* onClick={handleAccountClick} */ fontSize="large" style={{color: 'white'}} />
            </IconButton>
        </div>
        <Perfil anchorEl={anchorPerfil} open={openPerfil} handleClose={() => setAnchorPerfil(null)} />
        <AlterarPassword open={isPassModalOpen} onClose={() => {setIsPassModalOpen(false); sessionStorage.setItem('primeirologin', false);}} userId={idUser} setAlertOpen={setAlertOpen} setAlertProps={setAlertProps} />
        <Alert open={alertOpen} setOpen={setAlertOpen} title={alertProps.title} label={alertProps.label} severity={alertProps.severity} />
    </div>
    );
}