import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const QrCodeModal = ({ open, handleClose }) => {
    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Scan the QR Code
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ textAlign: 'center' }}>
                <img src="/qrcode.png" alt="QR Code" style={{ maxWidth: '100%', height: 'auto' }} />
            </DialogContent>
        </Dialog>
    );
};

export default QrCodeModal;
