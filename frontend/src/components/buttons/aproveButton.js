import * as React from 'react';
import IconButton  from '@mui/material/IconButton';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';

export default function AprovButton({ onclick }) {
    const [isHovered, setIsHovered] = React.useState(false);

    const handleMouseOver = () => {
        setIsHovered(true);
    };

    const handleMouseOut = () => {
        setIsHovered(false);
    };

    return (
        <IconButton
            aria-label="Aprovar"
            onClick={onclick} 
            style={{
                borderRadius: '24px', 
                backgroundColor: '#EEF1F4',
                width: '60px',
                justifyContent: 'center',
                color: isHovered ? '#198754' : 'black'
            }}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
        >
            <ThumbUpAltIcon /> 
        </IconButton>
    );
}

