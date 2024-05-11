import * as React from 'react';
import { TextField, InputAdornment, IconButton, InputLabel } from '@mui/material';

export default function BasicTextField({caption, valor, onchange, fullwidth, multiline}) {
    return (
        <TextField id="standard-basic" label={caption} value={valor} onChange={onchange} variant="outlined" fullWidth={fullwidth} multiline={multiline} rows={9} maxRows={10} 
        InputLabelProps={{ shrink: true }} InputProps={{startAdornment: (<InputLabel shrink>{caption}</InputLabel>)}}/>
    );
}
