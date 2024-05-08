import * as React from 'react';
import Button from '@mui/material/Button';
import CheckIcon from '@mui/icons-material/Check';

export default function AprovButton({caption, onclick}) {
    return (
        <Button 
            variant="contained" 
            startIcon={<CheckIcon />} 
            onClick={onclick} 
            style={{
                borderRadius: '24px', 
                backgroundColor: '#1765E0'
            }}
        > {caption} </Button>
    );
}

