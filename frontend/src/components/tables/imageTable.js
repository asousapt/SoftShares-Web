import React from 'react';
import { IconButton, ImageListItem, ImageListItemBar } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';

const ImageTable = ({ images, onAddImage, styleProp, onDelete }) => {
    return (
        <div style={styleProp}>
            <div style={{ overflowX: 'auto', display: 'flex', whiteSpace: 'nowrap' }}>
                {images.map((image, index) => (
                    <ImageListItem key={index} style={{marginRight: '10px'}}>
                        <img key={index} src={image.src} alt={image.alt} style={{ width: 'auto', height: '200px', marginRight: '10px' }} />
                        <ImageListItemBar style={{borderRadius: 15, backgroundColor: 'transparent'}}
                            actionIcon={
                                <IconButton sx={{  color: 'rgba(255, 255, 255, 1)' }} onClick={onDelete} >
                                    <DeleteIcon />
                                </IconButton>
                            }
                        />
                    </ImageListItem>
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