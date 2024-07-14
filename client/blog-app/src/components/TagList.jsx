import { useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import PropTypes from 'prop-types';

import './TagList.css';

function TagList({ tags, context }) {
    const navigate = useNavigate();
    const tagListClassName =
        context === 'post' ? 'tag-list-post' : 'tag-list-default';
    const tagClassName = context === 'post' ? 'tag-post' : 'tag-default';

    const handleTagClick = (tagName) => {
        navigate(`/posts/tag/${tagName}`);
    };

    return (
        <Container className={tagListClassName}>
            {tags.map((tag) => (
                <div
                    key={tag.tagName}
                    className={tagClassName}
                    onClick={() => handleTagClick(tag.tagName)}
                >
                    {tag.tagName}
                </div>
            ))}
        </Container>
    );
}

TagList.propTypes = {
    tags: PropTypes.arrayOf(PropTypes.object),
};

export default TagList;
