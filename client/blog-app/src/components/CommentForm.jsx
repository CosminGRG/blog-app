import { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';

import { UserContext } from '../utils/UserContext';

import axios from '../utils/api/axios.config';

const API_URL = '/comment';

function ContactForm({ postId, onCommentSubmit }) {
    const { user, updateUser, clearUser, checkLoggedIn } =
        useContext(UserContext);
    const [commentContent, setCommentContent] = useState('');
    const [error, setError] = useState(null);

    const handleInputChange = (event) => {
        setCommentContent(event.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!commentContent.trim()) {
            alert('Please enter a comment');
            return;
        }

        try {
            const response = await axios.post(`${API_URL}`, {
                content: commentContent.trim(),
                postId: postId,
                userId: user.id,
            });

            onCommentSubmit(response.data);
            setCommentContent('');
        } catch (error) {
            console.error('Error submitting comment', error);
            setError(error.message);
        }
    };

    if (!checkLoggedIn())
        return <p className="text-info my-3">Sign in to leave a comment.</p>;

    return (
        <div className="comment-form">
            <h5>Comments</h5>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="commentForm">
                    <Form.Label></Form.Label>
                    <Form.Control
                        required
                        type="text"
                        placeholder="Add a comment..."
                        as="textarea"
                        rows={3}
                        value={commentContent}
                        onChange={handleInputChange}
                    />
                </Form.Group>
                <Button type="submit" className="btn btn-primary mb-4">
                    <FontAwesomeIcon icon={faPaperPlane} />
                </Button>
            </Form>
            {error && (
                <p className="text-danger">Error sending comment: {error}</p>
            )}
        </div>
    );
}

export default ContactForm;
