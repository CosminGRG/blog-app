import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Col, Card } from 'react-bootstrap';

import axios from '../utils/api/axios.config.js';

import './LatestPosts.css';

const API_URL = '/post';

function LatestPosts() {
    const [data, setData] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBlogData = async () => {
            try {
                const response = await axios.get(API_URL);
                const sortedData = response.data.sort((a, b) =>
                    b.insDateTime.localeCompare(a.insDateTime),
                );
                setData(sortedData);
            } catch (error) {
                setError('Error fetching latest posts');
            }
        };

        fetchBlogData();
    }, []);

    const latestPosts = data.slice(0, 5);

    return (
        <Container className="latest-posts-bar-container shadow-lg">
            <Col>
                <h5 className="mb-4">Latest posts</h5>
                {latestPosts.map((post) => (
                    <Card key={post.id} className="custom-card">
                        <Link to={`/post/${post.id}`}>
                            {post.postImgPath ? (
                                <Card.Img
                                    className="card-img-left custom-card-img rounded"
                                    alt={`${post.title}`}
                                    variant="top"
                                    src={`http://localhost:5272${post.postImgPath}`}
                                />
                            ) : (
                                <Card.Img
                                    className="card-img-left custom-card-img rounded"
                                    alt={`${post.title}`}
                                    variant="top"
                                    src={`https://placehold.co/600x400`}
                                />
                            )}
                        </Link>
                        <Card.Body>
                            {error === '' ? (
                                <Card.Title
                                    as={Link}
                                    to={`/post/${post.id}`}
                                    className="custom-card-title"
                                >
                                    {post.title}
                                </Card.Title>
                            ) : (
                                <Card.Title className="custom-card-title">
                                    {error}
                                </Card.Title>
                            )}
                        </Card.Body>
                    </Card>
                ))}
            </Col>
        </Container>
    );
}

export default LatestPosts;
