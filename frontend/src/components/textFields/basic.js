import * as React from 'react';
import { TextField, InputLabel } from '@mui/material';

export default function BasicTextField({caption, valor, onchange, fullwidth, multiline, type}) {
    return (
        <TextField id="standard-basic" label={caption} value={valor} type={type} onChange={onchange} variant="outlined" fullWidth={fullwidth} multiline={multiline} rows={9} maxRows={10} 
        InputLabelProps={{ shrink: true }} InputProps={{startAdornment: (<InputLabel shrink>{caption}</InputLabel>)}}/>
    );
}
