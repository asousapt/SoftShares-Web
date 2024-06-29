import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

const CommentsList = ({ commentsData }) => {
    return (
        <div>
            {commentsData.map(comment => (
                <Comment key={comment.comentarioid} comment={comment} />
            ))}
        </div>
    );
};

const Comment = ({ comment }) => {
    return (
        <Box mb={2}>
            <Card style={{ backgroundColor: comment.reported ? '#FFCDD2' : '#FFFFFF' }}>
                <CardContent>
                    <Typography variant="h6">{comment.author}</Typography>
                    <Typography variant="body1">{comment.text}</Typography>
                </CardContent>
            </Card>
            {comment.replies && comment.replies.length > 0 && (
                <Box ml={4} mt={2}>
                    {comment.replies.map((reply) => (
                        <Comment key={reply.comentarioid} comment={reply} />
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default CommentsList;
