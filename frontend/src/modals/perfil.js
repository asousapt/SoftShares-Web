import React, { useState, useEffect } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Logout from '@mui/icons-material/Logout';
import ListItemIcon from '@mui/material/ListItemIcon';
import { useNavigate } from 'react-router-dom';

export default function Perfil({ anchorEl, open, handleClose }) {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const name = sessionStorage.getItem('nome');
        if (name) {
            setUserName(name);
        }
    }, []);

    return(
        <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
                elevation: 0,
                sx: {
                    backgroundColor:'#545F71', 
                    color: 'white',
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                    },
                    '&::before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: '#545F71',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                    },
                },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            <MenuItem onClick={handleClose} >
                <img 
                    src='https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D' 
                    style={{
                        width: 50,
                        height: 50,
                        objectFit: 'cover',
                        marginRight: 5,
                        borderRadius: 12
                    }} 
                    alt='user' /> 
                    {userName}
            </MenuItem>
            <MenuItem onClick={() => {navigate('/'); sessionStorage.clear();}} style={{backgroundColor: '#1765E0'}}>
                <ListItemIcon>
                    <Logout fontSize="small" sx={{ color: 'white' }} />
                </ListItemIcon>
                Desconectar
            </MenuItem>
        </Menu>
    );
}