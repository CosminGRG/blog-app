import { Navigate, useLocation } from 'react-router-dom';
import { getAuthToken, getUserFromToken } from '../auth/auth';

const AdminProtectedRoute = ({ children, allowedRoles }) => {
    const authToken = getAuthToken();
    const { user, role } = getUserFromToken(authToken);

    if (!user) {
        return (
            <Navigate to="/login" state={{ from: location.pathname }} replace />
        );
    }

    if (!allowedRoles?.includes(role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminProtectedRoute;
