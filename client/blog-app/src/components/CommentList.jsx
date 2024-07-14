import { useState, useEffect, useCallback, useContext } from 'react';

import Comment from '../components/Comment';
import CommentForm from '../components/CommentForm';

import { UserContext } from '../utils/UserContext';

import axios from '../utils/api/axios.config.js';

import './CommentList.css';

const API_URL = '/comment/post';

function CommentList({ postId }) {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const { checkLoggedIn } = useContext(UserContext);

    const fetchComments = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/${postId}`, {
                params: { pageNumber, pageSize: 5 },
            });

            setComments((prevComments) => [...response.data, ...prevComments]);
            setHasMore(response.data.length > 0);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [pageNumber, postId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop !==
                document.documentElement.offsetHeight ||
            loading ||
            !hasMore
        ) {
            return;
        }

        setPageNumber((prevPageNumber) => prevPageNumber + 1);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading]);

    const handleCommentSubmit = (newComment) => {
        setComments([newComment, ...comments]);
    };

    return (
        <div className="comments-section">
            <CommentForm
                postId={postId}
                onCommentSubmit={handleCommentSubmit}
            ></CommentForm>
            {comments.length === 0 || comments.length > 1 ? (
                <h6>{comments.length} comments</h6>
            ) : (
                <h6>{comments.length} comment</h6>
            )}

            <hr />
            <ul className="comments-list">
                {comments.length === 0 ? (
                    checkLoggedIn() ? (
                        <p>No comments yet. Be the first to comment.</p>
                    ) : (
                        <p>No comments yet. Sign in to add a comment.</p>
                    )
                ) : (
                    comments.map((comment) => (
                        <Comment key={comment.id} comment={comment}></Comment>
                    ))
                )}
            </ul>
            {loading && <p>Loading more comments...</p>}
            {error && (
                <p className="text-error">Error loading comments: {error}</p>
            )}
            {!hasMore && comments.length !== 0 && (
                <p>No more comments to load.</p>
            )}
        </div>
    );
}

export default CommentList;
