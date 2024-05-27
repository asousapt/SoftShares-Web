import * as React from 'react';
import { TextField } from '@mui/material';

export default function DataHora({ caption, value, onChange, fullwidth = true }) {
    const handleChange = (event) => {
        console.log(`${caption} value:`, event.target.value);
    };

    return (
        <TextField
            type="datetime-local"
            value={value || ''}
            onChange={handleChange}
            variant="outlined"
            fullWidth={fullwidth}
            label={caption}
            InputLabelProps={{ shrink: true }}
        />
    );
}
