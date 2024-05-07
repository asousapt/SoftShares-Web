import * as React from 'react';
import { TextField } from '@mui/material';

export default function BasicTextField({ onchange }) {
    return (
        <TextField id="outlined-search" label='Pesquisar' onChange={onchange} type="search" size="small" style={{ marginLeft: '10px', width: '50%'}}/>
    );
}
