import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles, requireApproval = false }) => {
    const { currentUser, userProfile } = useAuth();
    const location = useLocation();

    if (!currentUser) {
        // Not logged in, redirect to login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Wait for user profile to load if it's being fetched (optional: add loading state in AuthContext)
    // For now, assuming if currentUser is set, we eventually get userProfile. 
    // If strict sync is needed, we should handle a 'loading' state from context.
    
    if (userProfile) {
        // Check role
        if (allowedRoles && !allowedRoles.includes(userProfile.role)) {
            // User does not have permission
            return <Navigate to="/" replace />; // Or unauthorized page
        }

        // Check approval status (mainly for sellers)
        if (requireApproval && userProfile.role === 'seller' && userProfile.status !== 'approved') {
            // Redirect to verification/pending page
            if (location.pathname !== '/seller/verification') {
                 return <Navigate to="/seller/verification" replace />;
            }
        }
    }

    return children;
};

export default ProtectedRoute;
