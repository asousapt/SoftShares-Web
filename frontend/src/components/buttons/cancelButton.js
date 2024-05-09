import * as React from 'react';
import Button from '@mui/material/Button';
import { IoReturnUpBackOutline } from "react-icons/io5";

export default function SubmitButton({caption, onclick}) {
    return (
        <Button 
            variant="outlined" 
            startIcon={<IoReturnUpBackOutline color='#4D9CFA'/>} 
            onClick={onclick} 
            style={{
                borderRadius: '24px', 
                color: '#0465D9', 
                borderColor: 'black',
                textTransform: 'none'
            }}
        > {caption} </Button>
    );
}