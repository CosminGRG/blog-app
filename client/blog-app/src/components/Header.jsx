import { useContext } from 'react';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

import { UserContext } from '../utils/UserContext';

import './Header.css';

function Header() {
    const { user, updateUser, clearUser, checkLoggedIn, checkAdmin } =
        useContext(UserContext);

    const navigate = useNavigate();
    const location = useLocation();

    const showLoginButton = location.pathname !== '/login';
    const showCreatePostButton = location.pathname !== '/create-post';

    const handleLogout = () => {
        clearUser();
        updateUser();
        navigate('/', { replace: true });
    };

    const navigateToCreatePost = () => {
        navigate('/create-post');
    };

    return (
        <Navbar expand="lg" className="bg-body-tertiary fixed-header shadow">
            <Container fluid>
                <Navbar.Brand href="/">BlogApp</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to={'/'}>
                            Home
                        </Nav.Link>
                    </Nav>
                    <Nav>
                        {checkLoggedIn() && user ? (
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <span className="ms-2">
                                    Hello, {user.username}
                                </span>
                                {checkAdmin() && showCreatePostButton && (
                                    <Button
                                        className="ms-2"
                                        size="sm"
                                        onClick={navigateToCreatePost}
                                    >
                                        <FontAwesomeIcon icon={faPlus} />
                                    </Button>
                                )}
                                <Button
                                    className="ms-2"
                                    size="sm"
                                    variant="danger"
                                    onClick={handleLogout}
                                >
                                    <FontAwesomeIcon
                                        icon={faRightFromBracket}
                                    />
                                </Button>
                            </div>
                        ) : (
                            showLoginButton && (
                                <Nav.Link eventKey={2} as={Link} to={'/login'}>
                                    Sign in
                                </Nav.Link>
                            )
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;
