import * as React from 'react';
import { TextField } from '@mui/material';

export default function BasicTextField({ valor, onchange, fullwidth}) {
    return (
        <TextField type='datetime-local' value={valor} onChange={onchange} variant="standard" fullWidth={fullwidth} style={{marginTop: 16}} />
    );
}
