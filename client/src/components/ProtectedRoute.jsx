import { Navigate } from "react-router-dom";
import { useSnackbar } from 'notistack';

function ProtectedRoute({ children, isAuthenticated, isAdmin }) {
  const { enqueueSnackbar } = useSnackbar();

  console.log('Protected Route:', { isAuthenticated, isAdmin }); // Debug log

  if (!isAuthenticated) {
    enqueueSnackbar('Please login to access this page', { variant: 'warning' });
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    enqueueSnackbar('Admin access required', { variant: 'error' });
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
