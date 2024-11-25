import { Navigate, useLocation } from "react-router-dom";
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';

const ProtectedRoute = ({ children, isAuthenticated, isAdmin }) => {
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      enqueueSnackbar('Please login to access this page', { variant: 'warning' });
      return;
    }

    if (!isAdmin && location.pathname.includes('/admin')) {
      enqueueSnackbar('Admin access required', { variant: 'error' });
    }
  }, [isAuthenticated, isAdmin, location.pathname, enqueueSnackbar]);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!isAdmin && location.pathname.includes('/admin')) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
