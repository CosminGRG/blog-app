import axios from '../utils/api/axios.config.js';
import { jwtDecode } from 'jwt-decode';

const AUTH_COOKIE_NAME = 'authToken';
const AUTH_COOKIE_OPTIONS = {
    path: '/',
    expires: new Date(Date.now() + 604800000), // 604800000 - 7 days from now | 86400000 - 24h from now
    secure: true,
    sameSite: 'strict',
};

export function setAxiosAuthToken(token) {
    if (token && token !== '') {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
}

export function getAuthToken() {
    return getCookie(AUTH_COOKIE_NAME);
}

function setAuthToken(token) {
    setCookie(AUTH_COOKIE_NAME, token, AUTH_COOKIE_OPTIONS);
}

function removeAuthToken() {
    deleteCookie(AUTH_COOKIE_NAME);
}

function isTokenExpired(token) {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    return decoded.exp < Date.now() / 1000;
}

async function refreshToken() {
    const authToken = getAuthToken();

    if (isTokenExpired(authToken)) {
        return await axios
            .get('/auth/refresh-token', {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            })
            .then((response) => {
                const token = response.data;
                setAuthToken(token);
                setAxiosAuthToken(token);
                return token;
            })
            .catch((error) => {
                console.error('Error refreshing auth token:', error);
                throw error;
            });
    } else {
        return Promise.resolve(authToken);
    }
}

function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(`${name}=`)) {
            return cookie.substring(name.length + 1);
        }
    }

    return null;
}

/* function setCookie(name, value, options) {
    let cookie = `${name}=${value}`;

    if (options && typeof options === 'object') {
        for (const [key, val] of Object.entries(options)) {
            cookie += `; ${key}=${val}`;
        }
    }

    document.cookie = cookie;
}
 */
function setCookie(name, value, options = {}) {
    let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    for (const [key, val] of Object.entries(options)) {
        if (val === true) {
            cookie += `; ${key}`;
        } else {
            cookie += `; ${key}=${val}`;
        }
    }

    document.cookie = cookie;
}

function deleteCookie(name) {
    setCookie(name, '', { 'Max-Age': -99999999 });
}

export async function login(email, password) {
    return await axios
        .post('/auth/login', { email, password })
        .then((response) => {
            const token = response.data;
            setAuthToken(token);
            setAxiosAuthToken(token);
            return { token: token, error: null };
        })
        .catch((error) => {
            return { token: null, error: error.response.data };
        });
}

export async function register(username, email, password) {
    return await axios
        .post('/auth/register', { username, email, password })
        .then((response) => {
            const token = response.data;
            setAuthToken(token);
            setAxiosAuthToken(token);
            return { token: token, error: null };
        })
        .catch((error) => {
            return { token: null, error: error.response.data };
        });
}

export function getUserFromToken(token) {
    try {
        const decoded = jwtDecode(token);
        return {
            user: {
                id: decoded.sub,
                username:
                    decoded[
                        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
                    ],
                email: decoded[
                    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
                ],
            },
            role: decoded[
                'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
            ],
        };
    } catch (error) {
        return {
            user: null,
            role: 'guest',
        };
    }
}

export function isLoggedIn() {
    const token = getAuthToken();
    if (token === '') {
        return false;
    }
    return token && !isTokenExpired(token);
}

export function isAdmin() {
    const { role } = getUserFromToken(getAuthToken());
    if (role === 'Admin') {
        return true;
    }
    return false;
}

export function logout() {
    removeAuthToken();
    setAxiosAuthToken(null);
}
