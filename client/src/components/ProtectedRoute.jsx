import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, isAuthenticated, isAdmin }) {
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" />;
  }

  return children;
}

export default ProtectedRoute;
