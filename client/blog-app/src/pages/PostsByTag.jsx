import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import axios from '../utils/api/axios.config';

import Posts from '../components/Posts';
import SearchBox from '../components/SearchBox';
import LatestPosts from '../components/LatestPosts';

const API_URL = '/post/tag';

function PostsByTag({ match }) {
    const { tagName } = useParams();
    const [posts, setPosts] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPostsByTag = async () => {
            try {
                const response = await axios.get(`${API_URL}/${tagName}`);
                setPosts(response.data);
            } catch (error) {
                console.error(
                    'Unexpected error while fetching posts by tag:',
                    error,
                );
                setError('Error fetching posts by tag.');
            }
        };

        fetchPostsByTag();
    }, [tagName]);

    if (error) {
        return <p>{error}</p>;
    }

    if (!posts) {
        return <p>Loading...</p>;
    }

    return (
        <Container style={{ marginTop: '80px' }}>
            <Row>
                <Col md={8} className="posts-container">
                    <Posts
                        data={posts}
                        error={error}
                        setData={setPosts}
                        setError={setError}
                    />
                </Col>
                <Col className="side-container">
                    <SearchBox />
                    <LatestPosts />
                </Col>
            </Row>
        </Container>
    );
}

export default PostsByTag;
