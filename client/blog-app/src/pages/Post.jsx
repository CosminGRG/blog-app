import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faComment } from '@fortawesome/free-regular-svg-icons';

import axios from '../utils/api/axios.config';
import SearchBox from '../components/SearchBox';
import LatestPosts from '../components/LatestPosts';
import TagList from '../components/TagList';
import CommentList from '../components/CommentList';

import '../pages/Post.css';

const API_URL = '/post';

function Post() {
    const { id } = useParams();
    const [error, setError] = useState('');
    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`${API_URL}/${id}`);
                setPost(response.data);
            } catch (error) {
                setError('Something went wrong when fetching post.');
            }
        };

        fetchPost();
    }, [id]);

    if (!post) {
        return <p>Loading...</p>;
    }

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

    return (
        <Container style={{ marginTop: '80px' }}>
            <Row>
                <Col md={8}>
                    {/*  <Link to={'/'} className="p-2">
                        Go back
                    </Link> */}
                    <Container className="post-content-container shadow-lg">
                        <div
                            className="post-title-container"
                            dangerouslySetInnerHTML={{ __html: post.title }}
                        ></div>
                        <p className="d-inline text-muted post-meta">
                            {dateString}
                        </p>
                        <p className="d-inline p-2 post-meta">
                            <FontAwesomeIcon
                                icon={faUser}
                                style={{ marginRight: '4px' }}
                            />
                            {post.user.username}
                        </p>
                        <p className="d-inline post-meta">
                            <FontAwesomeIcon
                                icon={faComment}
                                style={{ marginRight: '4px' }}
                            />
                            {numberOfComments}
                        </p>
                        <div className="d-flex" style={{ height: '30px' }}>
                            <div className="vr" />
                        </div>
                        <div
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        ></div>
                        {post.postImgPath && (
                            <Card.Img
                                className="mb-2"
                                style={{ maxWidth: '15%', height: 'auto' }}
                                alt={`${post.title}`}
                                src={`http://localhost:5272${post.postImgPath}`}
                            />
                        )}
                        <TagList tags={post.tags} context="post" />
                        <hr></hr>
                        <CommentList postId={post.id} />
                    </Container>

                    <hr></hr>
                </Col>
                <Col>
                    <SearchBox />
                    <LatestPosts />
                </Col>
            </Row>
        </Container>
    );
}

export default Post;
