import { useContext } from 'react';
import { UserContext } from './UserContext.jsx';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
    const { token } = useContext(UserContext);
    return token ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;