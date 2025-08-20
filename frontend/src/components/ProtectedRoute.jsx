import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Box, CircularProgress, Typography } from '@mui/material';

const ProtectedRoute = ({ children, requiredDepartment = null }) => {
  const { isAuthenticated, user, isLoading, canAccessDepartment } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center" 
        height="100vh"
        gap={2}
      >
        <CircularProgress size={40} />
        <Typography color="textSecondary">Loading...</Typography>
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check department access if required
  if (requiredDepartment && !canAccessDepartment(requiredDepartment)) {
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center" 
        height="100vh"
        gap={2}
        sx={{ p: 3, textAlign: 'center' }}
      >
        <Typography variant="h5" color="error">
          Access Denied
        </Typography>
        <Typography color="textSecondary">
          You don't have permission to access this department.
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Contact your administrator if you believe this is an error.
        </Typography>
      </Box>
    );
  }

  return children;
};

export default ProtectedRoute;
