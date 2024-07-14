import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Container, Form, FloatingLabel, Button } from 'react-bootstrap';

import { EditorState, ContentState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import TagSelector from '../components/TagSelector.jsx';

import axios from '../utils/api/axios.config.js';

import './EditPost.css';

const API_URL = '/post';

function EditPost() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [post, setPost] = useState({});
    const [selectedTags, setSelectedTags] = useState([]);
    const [title, setTitle] = useState('');
    const [postImgPath, setPostImgPath] = useState(null);
    const [newPostImg, setNewPostImg] = useState(null);
    const [content, setContent] = useState('');
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`${API_URL}/${id}`);
                const postData = response.data;

                setPost(postData);
                setTitle(postData.title);
                setPostImgPath(postData.postImgPath);
                setContent(postData.content);

                setSelectedTags(
                    postData.tags.map((tag) => ({
                        value: tag.id,
                        label: tag.tagName,
                    })),
                );

                console.log('THIISSIISISISISIS', postData.tags);

                transformToDraft(postData.content);
            } catch (error) {
                setSuccess(false);
                setError('Something went wrong when fetching post.');
            }
        };

        fetchPost();
    }, [id]);

    const navigateToHome = () => {
        navigate('/');
    };

    const onEditorStateChange = (newEditorState) => {
        setEditorState(newEditorState);
    };

    const transformToDraft = (html) => {
        const blocksFromHtml = htmlToDraft(html);
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(
            contentBlocks,
            entityMap,
        );
        const editorState = EditorState.createWithContent(contentState);
        setEditorState(editorState);
    };

    const onTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const onImgChange = (event) => {
        setNewPostImg(event.target.files[0]);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        handlePostEdit();
    };

    const handlePostEdit = async () => {
        try {
            var newPostImgPath = postImgPath;
            if (newPostImg) {
                const formData = new FormData();
                formData.append('file', newPostImg);

                const imgResponse = await axios.post(
                    `${API_URL}/img`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    },
                );

                newPostImgPath = imgResponse.data;
            }

            const newContent = draftToHtml(
                convertToRaw(editorState.getCurrentContent()),
            );

            console.log('SelectedTags:', selectedTags);

            const payload = {
                Title: title,
                Content: newContent,
                PostImgPath: newPostImgPath,
                Tags: selectedTags.map((tag) => ({
                    Id: tag.value,
                    tagName: tag.label,
                })),
            };

            console.log('Payload:', payload);

            const response = await axios.put(`${API_URL}/${id}`, payload);

            setSuccess(true);
            setError('');
        } catch (error) {
            setSuccess(false);
            setError('Something went wrong when submitting edit request.');
        }
    };

    return (
        <Container style={{ marginTop: '60px' }}>
            <div className="edit-post-container">
                <h3 className="my-3">Edit post</h3>
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
                            value={title}
                            onChange={onTitleChange}
                        />
                    </FloatingLabel>
                    <Form.Group
                        controlId="formFileSm"
                        className="mb-3 text-start"
                    >
                        <Form.Label>Post image</Form.Label>
                        <Form.Control
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
                    <p className="text-success">Post successfully edited.</p>
                )}
                {/* <textarea
                    disabled
                    value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
                /> */}
            </div>
        </Container>
    );
}

export default EditPost;
