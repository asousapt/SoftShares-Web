import * as React from 'react';
import { TextField, InputLabel } from '@mui/material';

export default function BasicTextField({caption, valor, onchange, fullwidth, multiline, type, style, disabled = false, error = false, helperText = '', allowOnlyLetters = false}) {
    const handleInputChange = (event) => {
        const inputValue = event.target.value;
        if (allowOnlyLetters) {
            const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]*$/;
            if (regex.test(inputValue) || inputValue === '') {
                onchange(event);
            }
        } else {
            onchange(event);
        }
    };

    return (
        <TextField id="standard-basic" label={caption} value={valor} type={type} onChange={handleInputChange} variant="outlined" fullWidth={fullwidth} disabled={disabled} multiline={multiline} rows={5} maxRows={10} 
        InputLabelProps={{ shrink: true }} InputProps={{startAdornment: (<InputLabel shrink>{caption}</InputLabel>), style: style}} style={style} error={error} helperText={helperText}/>
    );
}
