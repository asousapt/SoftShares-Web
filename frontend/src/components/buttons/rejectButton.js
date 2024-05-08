import * as React from 'react';
import IconButton  from '@mui/material/IconButton';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';

export default function RejectButton({ onclick }) {
    const [isHovered, setIsHovered] = React.useState(false);

    const handleMouseOver = () => {
        setIsHovered(true);
    };

    const handleMouseOut = () => {
        setIsHovered(false);
    };

    return (
        <IconButton
            aria-label="Rejeitar"
            onClick={onclick} 
            style={{
                borderRadius: '24px', 
                backgroundColor: '#EEF1F4',
                width: '60px',
                justifyContent: 'center',
                color: isHovered ? '#DC3545' : 'black'
            }}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
        >
            <ThumbDownAltIcon /> 
        </IconButton>
    );
}

