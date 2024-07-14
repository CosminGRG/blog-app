import { useState, useContext } from 'react';
import { Form, Container, Button, FloatingLabel } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

import { UserContext } from '../utils/UserContext';

import './Register.css';

import { register } from '../auth/auth';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        passwordCheck: '',
    });
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const { updateUser } = useContext(UserContext);

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        handleRegister();
    };

    const passwordCheck = (passowrd, passwordCheck) => {
        if (passowrd === passwordCheck) return true;
    };

    const validateUsername = (username) => {
        const usernameRegex = /^[a-zA-Z0-9]+$/;
        var validUsername = username.match(usernameRegex);
        if (validUsername) return true;
        else return false;
    };

    const handleRegister = async () => {
        try {
            if (!passwordCheck(formData.password, formData.passwordCheck)) {
                setError('The two passwords do not match.');
                return;
            }
            if (!validateUsername(formData.username)) {
                setError('The username can only contain letters and numbers.');
                return;
            }

            const { token, error } = await register(
                formData.username,
                formData.email,
                formData.password,
            );

            if (error) {
                setError(error);
            }
            if (token) {
                setError('');
                updateUser();
                navigate('/', { replace: true });
            }
        } catch {
            console.error('Error signing in:', error);
            throw error;
        }
    };

    return (
        <Container>
            <div className="register-box-container">
                <h3 className="my-3">Sign up</h3>
                <Form onSubmit={handleSubmit}>
                    <FloatingLabel
                        controlId="floatingUsername"
                        label="Username"
                        className="my-3 mx-3"
                    >
                        <Form.Control
                            required
                            type="text"
                            placeholder="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleFormChange}
                        />
                    </FloatingLabel>
                    <FloatingLabel
                        controlId="floatingEmail"
                        label="Email address"
                        className="my-3 mx-3"
                    >
                        <Form.Control
                            required
                            type="email"
                            placeholder="name@example.com"
                            name="email"
                            value={formData.email}
                            onChange={handleFormChange}
                        />
                    </FloatingLabel>
                    <FloatingLabel
                        controlId="floatingPassword"
                        label="Password"
                        className="mb-3 mx-3"
                    >
                        <Form.Control
                            required
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleFormChange}
                        />
                    </FloatingLabel>
                    <FloatingLabel
                        controlId="floatingPasswordCheck"
                        label="Repeat Password"
                        className="mb-3 mx-3"
                    >
                        <Form.Control
                            required
                            type="password"
                            placeholder="Repeat Password"
                            name="passwordCheck"
                            value={formData.passwordCheck}
                            onChange={handleFormChange}
                        />
                    </FloatingLabel>
                    <Button type="submit">Sign up</Button>
                </Form>
                <p className="mt-3">
                    Already have an account? <Link to={'/login'}>Sign in.</Link>
                </p>
                <p style={{ color: 'red' }}>{error}</p>
            </div>
        </Container>
    );
};

export default Register;
