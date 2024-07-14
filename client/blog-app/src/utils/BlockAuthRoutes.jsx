import { Navigate } from 'react-router-dom';

import { isLoggedIn } from '../auth/auth';

const BlockAuthRoutes = ({ children }) => {
    if (isLoggedIn()) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default BlockAuthRoutes;
