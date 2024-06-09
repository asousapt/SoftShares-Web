import React from 'react';
import { IconButton } from '@mui/material';
import { LuSwitchCamera } from "react-icons/lu";
import ImageListItemBar from '@mui/material/ImageListItemBar';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';

const InputImage = ({ image, onAddImage, onChange, onDelete }) => {
    return(
        <div style={{ width: '200px', height: '200px', border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 15 }}>
            {image ? (
                <>
                <img
                    src={image}
                    alt="Imagem"
                    style={{ position: 'absolute', width: '200px', height: '200px', objectFit: 'cover', borderRadius: 'inherit' }}
                    onClick={onAddImage}
                />
                <div style={{ position: 'absolute', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <IconButton onClick={onChange} style={{ padding: 0, color: 'rgba(255, 255, 255, 0.2)'}}>
                        <LuSwitchCamera size="2em" />
                    </IconButton>
                    {/* <ImageListItemBar style={{borderRadius: 15, backgroundColor: 'transparent'}}
                        actionIcon={
                            <IconButton
                                sx={{ 
                                    color: 'rgba(255, 255, 255, 0.8)' 
                                }}
                                onClick={() => {onDelete(image.id);}}
                            >
                                <DeleteIcon />
                            </IconButton>
                        }
                    /> */}
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