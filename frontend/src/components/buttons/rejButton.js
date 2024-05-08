import * as React from 'react';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';

export default function RejButton({caption, onclick}) {
    return (
        <Button 
            variant="contained" 
            startIcon={<CloseIcon />} 
            onClick={onclick} 
            style={{
                borderRadius: '24px', 
                backgroundColor: '#1765E0'
            }}
        > {caption} </Button>
    );
}
