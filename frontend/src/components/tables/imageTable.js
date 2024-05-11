import React from 'react';
import { IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const ImageTable = ({ images, header, onAddImage }) => {
    return (
        <div style={{paddingBottom: 10}}>
            <h3>{header}</h3>
            <div style={{ overflowX: 'auto', display: 'flex', whiteSpace: 'nowrap' }}>
                {images.map((image, index) => (
                    <img key={index} src={image.src} alt={image.alt} style={{ width: 'auto', height: '200px', marginRight: '10px' }} />
                ))}
                <div style={{ width: '200px', height: '200px', border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 15 }}>
                    <IconButton onClick={onAddImage} style={{ padding: 0, color: 'black'}}>
                        <AddCircleOutlineIcon fontSize="large" color='black'/>
                    </IconButton>
                </div>
            </div>
        </div>
    );
};

export default ImageTable;