import React, { useState, useEffect } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Logout from '@mui/icons-material/Logout';
import ListItemIcon from '@mui/material/ListItemIcon';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '@mui/material';

export default function Perfil({ anchorEl, open, handleClose }) {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [userImage, setUserImage] = useState('');

    useEffect(() => {
        const name = sessionStorage.getItem('nome');
        if (name) {
            setUserName(name);
        }
        
        const image = sessionStorage.getItem('image');
        if (image && image !== '') {
            setUserImage(image);
        } else{
            setUserImage('');
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
                {userImage !== '' && (
                    <img 
                        src={userImage} 
                        style={{
                            width: 50,
                            height: 50,
                            objectFit: 'cover',
                            marginRight: 5,
                            borderRadius: 12
                        }} 
                        alt='user' />
                )} 
                {userImage === '' && (<Avatar>{userName.charAt(0)}</Avatar>)}
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