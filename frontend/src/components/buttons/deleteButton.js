import * as React from 'react';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';

export default function SubmitButton({caption, onclick}) {
    return (
        <Button 
            variant="outlined" 
            startIcon={<DeleteIcon color='#4D9CFA'/>} 
            onClick={onclick} 
            style={{
                borderRadius: '24px', 
                color: 'white',
                backgroundColor: 'red', 
                borderColor: 'transparent',
                textTransform: 'none'
            }}
        > {caption} </Button>
    );
}