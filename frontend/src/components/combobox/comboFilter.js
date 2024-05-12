import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import { TextField } from '@mui/material';

export default function comboBasic({ value, handleChange, options}) {
    return (
        <TextField value={value} onChange={handleChange} size="small" style={{marginLeft: 10, backgroundColor: '#0465D9', color: 'white', borderRadius: '6px'}} select 
        sx={{
            ".MuiSelect-icon": {
                color: 'white', 
            },
            "MuiSelect-select":{
                color: 'white'
            }
        }}
        >
            {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
        </TextField>
    )
}
