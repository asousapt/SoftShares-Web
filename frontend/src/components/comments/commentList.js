import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Comment from './comment';

export default function CommentsList({ commentsData }){
    const renderReplies = (replies) => {
        return replies.map((reply, index) => (
            <Box ml={4} key={index}>
                <Comment comment={reply} />
            </Box>
        ));
    };

    return (
        <Container>
            {commentsData.map((comment, index) => (
                <Box key={index}>
                    <Comment comment={comment} />
                    {comment.replies && renderReplies(comment.replies)}
                </Box>
            ))}
        </Container>
    );
};
