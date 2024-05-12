import * as React from 'react';
import { TextField, InputAdornment, IconButton, InputLabel } from '@mui/material';

export default function BasicTextField({ valor, onchange, fullwidth, caption}) {
    return (
        <TextField type='datetime-local' value={valor} onChange={onchange} variant="outlined" fullWidth={fullwidth} label={caption} 
        InputLabelProps={{ shrink: true }} InputProps={{startAdornment: (<InputLabel shrink>{caption}</InputLabel>)}}/>
    );
}
