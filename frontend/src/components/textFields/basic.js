import * as React from 'react';
import { TextField, InputAdornment, IconButton, InputLabel } from '@mui/material';

export default function BasicTextField({caption, valor, onchange, fullwidth, multiline, type, style}) {
    return (
        <TextField id="standard-basic" label={caption} value={valor} type={type} onChange={onchange} variant="outlined" fullWidth={fullwidth} multiline={multiline} rows={5} maxRows={10} 
        InputLabelProps={{ shrink: true }} InputProps={{startAdornment: (<InputLabel shrink>{caption}</InputLabel>), style: style}} style={style}/>
    );
}
