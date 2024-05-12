import React from 'react';
import { IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const ImageTable = ({ images, onAddImage, styleProp }) => {
    return (
        <div style={styleProp}>
            <div style={{ overflowX: 'auto', display: 'flex', whiteSpace: 'nowrap' }}>
                {images.map((image, index) => (
                    <img key={index} src={image.src} alt={image.alt} style={{ width: 'auto', height: '200px', marginRight: '10px' }} />
                ))}
                <div style={{ flex: '0 0 200px', height: '200px', border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 15 }}>
                    <IconButton onClick={onAddImage} style={{ padding: 0, color: 'black'}}>
                        <AddCircleOutlineIcon fontSize="large" color='black'/>
                    </IconButton>
                </div>
            </div>
        </div>
    );
};

export default ImageTable;