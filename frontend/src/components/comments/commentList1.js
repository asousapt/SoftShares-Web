import React from 'react';

const CommentsList = ({ commentsData }) => {
    const renderReplies = (replies) => {
        return replies.map(reply => (
            <div key={reply.comentarioid} style={{ marginLeft: '20px', padding: '10px', border: '1px solid #ddd' }}>
                <p><strong>Reply:</strong> {reply.comentario}</p>
                {reply.respostas && reply.respostas.length > 0 && renderReplies(reply.respostas)}
            </div>
        ));
    };

    return (
        <div>
            {commentsData.map(comment => (
                <div key={comment.comentarioid} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd' }}>
                    <p><strong>Comment:</strong> {comment.comentario}</p>
                    {comment.respostas && comment.respostas.length > 0 && renderReplies(comment.respostas)}
                </div>
            ))}
        </div>
    );
};

export default CommentsList;
