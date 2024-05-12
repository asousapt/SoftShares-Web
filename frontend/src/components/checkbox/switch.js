import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

export default function SwitchLabels({caption, value, onchange}) {
    return (
        <FormControlLabel labelPlacement="start" control={<Switch checked={value} onChange={onchange} />} label={caption} />
    );
}