import * as React from 'react';
import { TextField, InputLabel } from '@mui/material';

export default function BasicTextField({caption, valor, onchange, fullwidth, multiline, type, style, disabled = false}) {
    return (
        <TextField id="standard-basic" label={caption} value={valor} type={type} onChange={onchange} variant="outlined" fullWidth={fullwidth} disabled={disabled} multiline={multiline} rows={5} maxRows={10} 
        InputLabelProps={{ shrink: true }} InputProps={{startAdornment: (<InputLabel shrink>{caption}</InputLabel>), style: style}} style={style}/>
    );
}
