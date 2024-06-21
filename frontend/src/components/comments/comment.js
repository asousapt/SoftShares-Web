import React from 'react';
import { Box, Typography } from '@mui/material';

const Comment = ({ comment }) => {
    return (
        <Box mb={2} p={2} style={{ backgroundColor: comment.reported ? 'red' : 'white', borderRadius: '5px' }}>
            <Typography variant="body1" style={{ color: comment.reported ? 'white' : 'black' }}>
                {comment.author}
            </Typography>
            <Typography variant="body2" style={{ color: comment.reported ? 'white' : 'black' }}>
                {comment.text}
            </Typography>
        </Box>
    );
};

export default Comment;
