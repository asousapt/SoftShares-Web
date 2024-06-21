import React from 'react';
import Comment from './comment';

const CommentsList = ({ commentsData }) => {
    return (
        <div>
            {commentsData.map((comment) => (
                <Comment key={comment.comentarioid} comment={comment} />
            ))}
        </div>
    );
};

export default CommentsList;
