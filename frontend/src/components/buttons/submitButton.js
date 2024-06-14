import * as React from 'react';
import Button from '@mui/material/Button';
import { IoSaveOutline } from "react-icons/io5";

export default function SubmitButton({caption, onclick, showIcon = true }) {
    return (
        <Button 
            variant="contained" 
            endIcon={showIcon && <IoSaveOutline color='white'/>}
            onClick={onclick} 
            style={{
                borderRadius: '24px', 
                backgroundColor: '#0465D9', 
                color: 'white',
                textTransform: 'none'
            }}
        > {caption} </Button>
    );
}