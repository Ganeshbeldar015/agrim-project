import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles, requireApproval = false }) => {
    const { currentUser, userProfile } = useAuth();
    const location = useLocation();

    if (!currentUser) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (userProfile) {
        // 1. Check Role Permission
        if (allowedRoles && !allowedRoles.includes(userProfile.role)) {
            return <Navigate to="/" replace />;
        }

        // 2. Special Logic for Sellers
        if (userProfile.role === 'seller') {
            const status = userProfile.status;
            const hasDocs = userProfile.documents?.identity && userProfile.documents?.license;

            // If approval is required for this route (e.g., /seller/dashboard)
            if (requireApproval && status !== 'approved') {
                // Check if they've submitted documents but status is still 'pending'
                if (hasDocs || status === 'pending_verification' || status === 'rejected') {
                    return <Navigate to="/seller/waiting" replace />;
                } else {
                    // Truly a new seller who hasn't submitted yet
                    return <Navigate to="/seller/verification" replace />;
                }
            }
        }
    }

    return children;
};

export default ProtectedRoute;
