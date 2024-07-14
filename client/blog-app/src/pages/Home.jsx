import { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import axios from '../utils/api/axios.config.js';

import Posts from '../components/Posts';
import SearchBox from '../components/SearchBox';
import LatestPosts from '../components/LatestPosts';

import './Home.css';

const API_URL = '/post';

const Home = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogData = async () => {
            try {
                const response = await axios.get(API_URL);
                const sortedData = response.data.sort((a, b) =>
                    b.insDateTime.localeCompare(a.insDateTime),
                );
                setData(sortedData);
            } catch (error) {
                console.log(error);
                setError(error);
            }
        };

        fetchBlogData();
    }, []);

    return (
        <Container style={{ marginTop: '80px' }}>
            <Row>
                <Col md={8} className="posts-container">
                    <Posts
                        data={data}
                        error={error}
                        setData={setData}
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
};

export default Home;
