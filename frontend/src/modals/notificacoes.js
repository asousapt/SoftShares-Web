import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

export default function Notificacoes({ anchorEl, open, handleClose, rows }) {
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
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                    },
                },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            <MenuItem onClick={handleClose} style={{display: 'flex', flexDirection: 'column'}}>
                <Typography variant="subtitle" component="div" style={{fontWeight: 'bold'}}>
                    As suas notificações
                </Typography>
                <List style={{ minWidth: '100%', maxHeight: 100, overflowX: 'auto', width: 'auto', border: '1px solid', borderColor: '#545F71', borderRadius: 4}}>
                    {rows.map((row) => (
                        <ListItem>
                            <ListItemText primary={row.value} />
                        </ListItem>
                    ))}
                </List>
            </MenuItem>
        </Menu>
    );
}