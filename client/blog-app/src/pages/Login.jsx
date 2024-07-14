import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Container, Button, FloatingLabel } from 'react-bootstrap';

import { UserContext } from '../utils/UserContext';

import './Login.css';

import { login } from '../auth/auth';

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

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
        handleLogin();
    };

    const isEmpty = (data) => {
        if (data.length <= 0) return true;
    };

    const validateFormData = (data) => {
        if (isEmpty(data.email) || isEmpty(data.password)) {
            throw new Error('Email and password fields cannot be empty!');
        }
    };

    const handleLoginError = (error) => {
        setError(error);
    };

    const handleLoginSuccess = (token) => {
        setError('');

        updateUser();

        const from = location.state?.from || '/';
        navigate(from, { replace: true });
    };

    const attemptLogin = async (email, password) => {
        try {
            return await login(email, password);
        } catch (error) {
            throw new Error(
                'Failed to communicate with the server. Please try again later.',
            );
        }
    };

    const handleLogin = async () => {
        try {
            validateFormData(formData);

            const { token, error } = await attemptLogin(
                formData.email,
                formData.password,
            );

            if (error) {
                handleLoginError(error);
            }
            if (token) {
                handleLoginSuccess(token);
            }
        } catch (error) {
            console.error('Unexpected error logging in:', error);
            setError(error.message);
        }
    };

    return (
        <Container>
            <div className="login-box-container">
                <h3 className="my-3">Sign in</h3>
                <Form onSubmit={handleSubmit}>
                    <FloatingLabel
                        controlId="floatingInput"
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
                    <Button type="submit">Sign in</Button>
                </Form>
                <p className="mt-3">
                    Don't have an account?{' '}
                    <Link to={'/register'}>Sign up.</Link>
                </p>
                <p className="text-danger">{error}</p>
            </div>
        </Container>
    );
}

export default Login;
