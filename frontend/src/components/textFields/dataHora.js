import * as React from 'react';
import { TextField } from '@mui/material';

export default function DataHora({ caption, value, onChange, fullwidth = true, disabled = false }) {
    const handleChange = (event) => {
        onChange(event.target.value);
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
            disabled={disabled}
        />
    );
}
