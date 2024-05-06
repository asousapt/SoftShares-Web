import * as React from 'react';
import Button from '@mui/material/Button';
import { IoAddOutline } from "react-icons/io5";

export default function SubmitButton({caption, onclick}) {
    return (
        <Button 
            variant="contained" 
            startIcon={<IoAddOutline color='white'/>} 
            onClick={onclick} 
            style={{
                borderRadius: '24px', 
                backgroundColor: '#0465D9', 
                color: 'white'
            }}
        > {caption} </Button>
    );
}