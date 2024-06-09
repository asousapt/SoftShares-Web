// Comment.js
import React from 'react';
import { Avatar, Typography, Box, Paper } from '@mui/material';

export default function Comment({ comment }){
    return (
        <Box display="flex" mb={2}>
            <Avatar>{comment.author.charAt(0)}</Avatar>
            <Paper elevation={3} sx={{ marginLeft: 2, padding: 2, flexGrow: 1, backgroundColor: comment.reported ? 'red' : 'white'}}>
                <Typography variant="body1" style={{color: comment.reported ? 'white' : 'black'}}> {comment.author} </Typography>
                <Typography variant="body2" style={{color: comment.reported ? 'white' : 'black'}}> {comment.text} </Typography>
            </Paper>
        </Box>
    );
};




