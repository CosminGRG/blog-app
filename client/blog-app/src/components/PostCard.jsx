import { useState, useEffect } from 'react';
import { Modal, Button, Card, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
//import { EditorState, ContentState, convertToRaw } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import { isLoggedIn, isAdmin } from '../auth/auth';

import './PostCard.css';

function PostCard({ post, onDelete, renderAdminControls }) {
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [truncatedText, setTruncatedText] = useState('');

    useEffect(() => {
        truncateText();
    }, [post]);

    const formattedDate = new Date(post.updDateTime);
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        /* second: '2-digit',
        hour12: true,
        timeZoneName: 'short' */
    };
    const dateString = formattedDate.toLocaleString(undefined, options);

    const numberOfComments = post.comments ? post.comments.length : 0;

    const maxBodyTextLength = 220;
    const truncateText = () => {
        const blocksFromHtml = htmlToDraft(post.content);
        const { contentBlocks, entityMap } = blocksFromHtml;
        //const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        //const editorState = EditorState.createWithContent(contentState);
        //const blocks = convertToRaw(editorState.getCurrentContent()).blocks;
        const value = contentBlocks
            .map((block) => (!block.text.trim() && '\n') || block.text)
            .join('\n');
        const truncatedText =
            value && value.length > maxBodyTextLength
                ? value.substring(0, maxBodyTextLength) + '...'
                : value;
        setTruncatedText(truncatedText);
    };

    const handleModalShow = (id) => {
        setDeleteId(id);
        setShowDeleteConfirmation(true);
    };

    const handleModalClose = () => {
        setDeleteId(null);
        setShowDeleteConfirmation(false);
    };

    const handleConfirmDelete = () => {
        handleModalClose();
        onDelete(deleteId);
    };

    return (
        <>
            <Modal show={showDeleteConfirmation} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete the post? This action cannot
                    be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
            <Card className="card-styling shadow-lg">
                <Row>
                    <Col md={4}>
                        <Link to={`/post/${post.id}`}>
                            {post.postImgPath ? (
                                <Card.Img
                                    className="card-img-left"
                                    alt={`${post.title}`}
                                    variant="top"
                                    src={`http://localhost:5272${post.postImgPath}`}
                                />
                            ) : (
                                <Card.Img
                                    className="card-img-left"
                                    alt={`${post.title}`}
                                    variant="top"
                                    src={`https://placehold.co/600x400`}
                                />
                            )}
                        </Link>
                    </Col>
                    <Col
                        md={8}
                        className="d-flex flex-column justify-content-betwee"
                    >
                        <Card.Body className="d-flex flex-column justify-content-between px-0 pb-0">
                            <div className="post-container">
                                <Card.Title
                                    className="post-title"
                                    as={Link}
                                    to={`/post/${post.id}`}
                                >
                                    {post.title}
                                </Card.Title>
                                <p className="text-muted post-meta">
                                    {dateString}
                                </p>
                                <Card.Body
                                    className="post-body px-1 py-1"
                                    dangerouslySetInnerHTML={{
                                        __html: truncatedText,
                                    }}
                                ></Card.Body>
                            </div>
                        </Card.Body>
                        <div className="post-extra">
                            <Link to={`/post/${post.id}`}>
                                <p
                                    className="mb-0 p-0 text-primary"
                                    as={Link}
                                    to={`/post/${post.id}`}
                                >
                                    {numberOfComments} comments
                                </p>
                            </Link>
                            <div>
                                {renderAdminControls &&
                                isLoggedIn() &&
                                isAdmin() ? (
                                    <div>
                                        <Button
                                            className="mx-2"
                                            variant="warning"
                                            size="sm"
                                            as={Link}
                                            to={`/edit/${post.id}`}
                                        >
                                            <span>&#9998;</span>
                                        </Button>
                                        <Button
                                            className=""
                                            variant="danger"
                                            size="sm"
                                            onClick={() =>
                                                handleModalShow(post.id)
                                            }
                                        >
                                            <span>&#215;</span>
                                        </Button>
                                    </div>
                                ) : (
                                    <></>
                                )}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Card>
        </>
    );
}

export default PostCard;
