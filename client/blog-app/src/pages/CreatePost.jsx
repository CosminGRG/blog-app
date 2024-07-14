import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, FloatingLabel, Button } from 'react-bootstrap';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';

import TagSelector from '../components/TagSelector.jsx';

import axios from '../utils/api/axios.config.js';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './CreatePost.css';

const API_URL = '/post';

function CreatePost() {
    const [postTitle, setPostTitle] = useState('');
    const [postImg, setPostImg] = useState(null);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [selectedTags, setSelectedTags] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const onTitleChange = (event) => {
        setPostTitle(event.target.value);
    };

    const onImgChange = (event) => {
        setPostImg(event.target.files[0]);
    };

    const onEditorStateChange = (newEditorState) => {
        setEditorState(newEditorState);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        handlePostSubmission();
    };

    const navigateToHome = () => {
        navigate('/');
    };

    const handlePostSubmission = async () => {
        try {
            const formData = new FormData();
            formData.append('file', postImg);

            const imgResponse = await axios.post(`${API_URL}/img`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const postImgPath = imgResponse.data;
            const postContent = draftToHtml(
                convertToRaw(editorState.getCurrentContent()),
            );
            if (!postContent || postContent === '') {
                setError('Cannot submit empty post.');
                return;
            }

            const tagIds = selectedTags.map((tag) => tag.value);

            const response = await axios
                .post(`${API_URL}`, {
                    Title: postTitle,
                    Content: postContent,
                    PostImgPath: postImgPath,
                    TagIds: tagIds,
                })
                .then(() => {
                    setError('');
                    setSuccess(true);
                });
        } catch (error) {
            console.error('Error creating post:', error);
            setSuccess(false);
            setError(
                'Something bad happened when submitting the post. Try again later.',
            );
        }
    };

    return (
        <Container style={{ marginTop: '60px' }}>
            <div className="create-post-container">
                <h3 className="my-3">New post</h3>
                <Form onSubmit={handleSubmit}>
                    <FloatingLabel
                        controlId="floatingTitle"
                        label="Title"
                        className="mb-3"
                    >
                        <Form.Control
                            required
                            type="text"
                            placeholder="Title"
                            name="title"
                            value={postTitle}
                            onChange={onTitleChange}
                        />
                    </FloatingLabel>
                    <Form.Group
                        controlId="formFileSm"
                        className="mb-3 text-start"
                    >
                        <Form.Label>Post image</Form.Label>
                        <Form.Control
                            required
                            type="file"
                            size="sm"
                            onChange={onImgChange}
                        />
                    </Form.Group>
                    <Editor
                        editorState={editorState}
                        wrapperClassName="demo-wrapper"
                        editorClassName="demo-editor"
                        onEditorStateChange={onEditorStateChange}
                    />
                    <TagSelector
                        selectedTags={selectedTags}
                        onTagsChange={setSelectedTags}
                    />
                    <div style={{ display: 'flex', marginTop: '10px' }}>
                        <Button style={{ marginRight: '5px' }} type="submit">
                            Save
                        </Button>
                        <Button variant="danger" onClick={navigateToHome}>
                            Cancel
                        </Button>
                    </div>
                    <p className="mt-3">
                        <Link to={'/'}>Go back</Link>
                    </p>
                </Form>

                <p className="text-danger">{error}</p>
                {success && (
                    <p className="text-success">Post successfully submitted.</p>
                )}
                {/* <textarea
                    disabled
                    value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
                /> */}
            </div>
        </Container>
    );
}

export default CreatePost;
