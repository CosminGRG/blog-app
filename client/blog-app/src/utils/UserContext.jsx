import { createContext, useState, useEffect } from 'react';
import {
    getUserFromToken,
    getAuthToken,
    isLoggedIn,
    isAdmin,
    logout,
} from '../auth/auth';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const authToken = getAuthToken();

            if (isLoggedIn()) {
                const userData = getUserFromToken(authToken);
                setUser(userData.user);
            } else {
                setUser(null);
            }

            setLoading(false);
        };

        fetchUser();
    }, []);

    const updateUser = () => {
        const authToken = getAuthToken();
        if (isLoggedIn()) {
            const userData = getUserFromToken(authToken);
            setUser(userData.user);
        } else {
            setUser(null);
        }
    };

    const clearUser = () => {
        setUser(null);
        logout();
    };

    const checkLoggedIn = () => {
        return isLoggedIn();
    };

    const checkAdmin = () => {
        return isAdmin();
    };

    return (
        <UserContext.Provider
            value={{
                user,
                loading,
                updateUser,
                clearUser,
                checkLoggedIn,
                checkAdmin,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
