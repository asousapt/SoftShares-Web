import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function comboBasic({caption, value, handleChange, options, fullwidth = false, mostraOpcaoVazia = false}) {
    return (
        <FormControl variant="standard" fullWidth={fullwidth} sx={{marginTop: 0, width: '100%'}}>
            <InputLabel id="demo-simple-select-standard-label">{caption}</InputLabel>
            <Select value={value} onChange={handleChange} label={caption}>
                {mostraOpcaoVazia && (
                    <MenuItem value=""> </MenuItem>
                )}
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}