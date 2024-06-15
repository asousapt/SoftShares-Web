import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';

const Alerta = ({ open, setOpen, label, severity }) => {
    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => setOpen(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [open, setOpen]);

    return (
        <Box sx={{ width: '20%', position: 'fixed', top: 15, left: 260}}>
            <Collapse in={open}>
                <Alert
                    severity={severity}
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => setOpen(false)}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    sx={{ mb: 2}}
                >
                    {label}
                </Alert>
            </Collapse>
        </Box>
    );
};

export default Alerta;
