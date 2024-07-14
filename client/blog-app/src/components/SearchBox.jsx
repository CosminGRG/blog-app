import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import { InputGroup, Form, Container, Button, Row, Col } from 'react-bootstrap';

import axios from '../utils/api/axios.config.js';
import TagList from './TagList.jsx';

import './SearchBox.css';

const API_URL = '/tag';

function SearchBox() {
    const [searchTerm, setSearchTerm] = useState('');
    const [tags, setTags] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await axios.get(`${API_URL}/used`);
                setTags(response.data);
            } catch (error) {
                console.error('Unexpected error while fetching tags:', error);
                setError('Error fetching tags.');
            }
        };

        fetchTags();
    }, []);

    return (
        <Container className="search-bar-container shadow-lg">
            <Col>
                <Row className="d-flex align-items-center mb-3">
                    <Col>
                        <InputGroup>
                            <Form.Control
                                placeholder="Search..."
                                aria-label="Searth"
                            />
                        </InputGroup>
                    </Col>
                    <Col xs="auto">
                        <Button>
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <TagList tags={tags} context="default" />
                </Row>
            </Col>
        </Container>
    );
}

export default SearchBox;
