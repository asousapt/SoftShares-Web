import React from 'react';
import { IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';

const InputImage = ({ image, onAddImage, onDelete }) => {
    return (
        <div style={{ width: '200px', height: '200px', border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 15, position: 'relative' }}>
            {image ? (
                <>
                    <img
                        src={image}
                        alt="Imagem"
                        style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: 'inherit' }}
                    />
                    <div style={{ position: 'absolute', bottom: 5, right: 5 }}>
                        <IconButton onClick={onDelete} style={{ padding: 0, color: 'rgba(255, 255, 255, 1)' }}>
                            <DeleteIcon />
                        </IconButton>
                    </div>
                </>
            ) : (
                <IconButton onClick={onAddImage} style={{ padding: 0, color: 'black' }}>
                    <AddCircleOutlineIcon fontSize="large" />
                </IconButton>
            )}
        </div>
    );
};

export default InputImage;