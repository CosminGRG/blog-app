import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import PostCard from './PostCard';

function PostList({ data, onDelete, itemsPerPage, currentPage }) {
    if (!Array.isArray(data)) {
        return <p>Loading...</p>;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPosts = data.slice(startIndex, endIndex);

    return (
        <Container>
            <Row>
                {currentPosts.length > 0 ? (
                    currentPosts.map((post, index) => (
                        <Col key={index} md={12}>
                            <PostCard
                                key={post.id}
                                post={post}
                                onDelete={onDelete}
                                renderAdminControls={true}
                            ></PostCard>
                        </Col>
                    ))
                ) : (
                    <p>No blog posts found</p>
                )}
            </Row>
        </Container>
    );
}

export default PostList;
