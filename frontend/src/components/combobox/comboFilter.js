import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import { TextField } from '@mui/material';

export default function ComboBasic({ value, handleChange, options }) {
    return (
        <TextField
            value={value}
            size="small"
            onChange={handleChange}
            style={{ marginLeft: 10, backgroundColor: '#0465D9', borderRadius: '6px' }}
            select
            sx={{
                ".MuiSelect-icon": {
                    color: 'white',
                },
                ".MuiInputBase-root": {
                    color: 'white',
                }
            }}
        >
            {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            ))}
        </TextField>
    );
}
