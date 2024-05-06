import * as React from 'react';
import { TextField } from '@mui/material';

export default function BasicTextField({caption, valor, onchange}) {
    return (
        <TextField id="standard-basic" label={caption} value={valor} onChange={onchange} variant="standard" />
    );
}
