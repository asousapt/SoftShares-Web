import * as React from 'react';
import IconButton  from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function DetailButton({ onclick }) {
    const [isHovered, setIsHovered] = React.useState(false);

    const handleMouseOver = () => {
        setIsHovered(true);
    };

    const handleMouseOut = () => {
        setIsHovered(false);
    };

    return (
        <IconButton
            aria-label="Ver"
            onClick={onclick} 
            style={{
                borderRadius: '24px', 
                backgroundColor: '#EEF1F4',
                width: '60px',
                justifyContent: 'center',
                color: isHovered ? '#1765E0' : 'black'
            }}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
        >
            <VisibilityIcon /> 
        </IconButton>
    );
}

