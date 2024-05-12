import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputAdornment from '@mui/material/InputAdornment';
import { Source } from '@mui/icons-material';

export default function ComboBasic({caption, value, handleChange, options, fullwidth = false, mostraOpcaoVazia = false}) {
    return (
        <FormControl variant="outlined" fullWidth={fullwidth} sx={{marginTop: 0, width: '100%'}}>
            <InputLabel id="demo-simple-select-standard-label" shrink={true} >{caption}</InputLabel>
            <Select value={value} onChange={handleChange} label={caption} startAdornment={(<InputAdornment > </InputAdornment>)} >
                {mostraOpcaoVazia && (<MenuItem value=" "> </MenuItem> )} {options.map((option) => (<MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>))}
            </Select>
        </FormControl>
    )
}
