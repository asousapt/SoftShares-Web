import * as React from 'react';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/EditOutlined';

export default function IconLabelButtons({caption, onclick}) {
    return (
        <Button variant="contained" startIcon={<EditIcon />} onClick={onclick} style={{borderRadius: '24px', backgroundColor: '#1765E0'}}> {caption} </Button>
    );
}
