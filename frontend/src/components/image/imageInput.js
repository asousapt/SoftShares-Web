import React from 'react';
import { IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { LuSwitchCamera } from "react-icons/lu";

const InputImage = ({ image, onAddImage }) => {
    return(
        <div style={{ width: '200px', height: '200px', border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 15 }}>
            {image ? (
                <>
                <img
                    src={image}
                    alt="Imagem"
                    style={{ position: 'absolute', width: '200px', height: '200px', objectFit: 'cover', borderRadius: 'inherit' }}
                    onClick={onAddImage} // Handle image click
                />
                <div style={{ position: 'absolute', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <LuSwitchCamera size="3em" style={{ color: 'rgba(255, 255, 255, 0.3)' }} />
                </div>
            </>
            ) : (
                <IconButton onClick={onAddImage} style={{ padding: 0, color: 'black'}}>
                    <AddCircleOutlineIcon fontSize="large" color='black'/>
                </IconButton>
            )}
        </div>
    );
}

export default InputImage;