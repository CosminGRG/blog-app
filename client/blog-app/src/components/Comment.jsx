import './Comment.css';

import avatarPlaceholder from './../assets/avatar_placeholder.jpg';

function Comment({ comment }) {
    return (
        <li key={comment.id} className="comment">
            <div className="comment-header">
                <div className="comment-avatar">
                    <img
                        src={avatarPlaceholder}
                        alt={`${comment.user.username}'s avatar`}
                    />
                </div>
                <div className="comment-info">
                    <span className="comment-username">
                        {comment.user.username}
                    </span>
                    <span className="comment-timestamp">
                        <small>
                            {new Date(comment.dateTime).toLocaleString()}
                        </small>
                    </span>
                </div>
            </div>
            <div className="comment-content">{comment.content}</div>
        </li>
    );
}

export default Comment;
