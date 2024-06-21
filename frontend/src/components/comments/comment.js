import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const Comment = ({ comment }) => {
    return (
        <Card style={{ marginBottom: '10px', backgroundColor: comment.reported ? '#FFCDD2' : '#FFFFFF' }}>
            <CardContent>
                <Typography variant="h6">{comment.author}</Typography>
                <Typography variant="body1">{comment.text}</Typography>
            </CardContent>
        </Card>
    );
};

export default Comment;
