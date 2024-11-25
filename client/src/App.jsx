import './App.css';
import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import NotFound from "./pages/NotFound.jsx";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRegister from "./pages/AdminRegister.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import { SnackbarProvider } from 'notistack';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const checkAuthStatus = () => {
    try {
      // Check for admin authentication
      const adminLoggedIn = document.cookie.includes('isAdminAuthenticated=true');
      // Check for user authentication
      const userLoggedIn = document.cookie.includes('userLoggedIn=true');

      // Set authentication states based on cookies
      if (adminLoggedIn) {
        setIsAuthenticated(true);
        setIsAdmin(true);
      } else if (userLoggedIn) {
        setIsAuthenticated(true);
        setIsAdmin(false);
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
      autoHideDuration={3000} >

      <div className="App">
        <Navbar
          isAuthenticated={isAuthenticated}
          isAdmin={isAdmin}
          onAuthChange={checkAuthStatus}
        />
        <Routes>
          <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
          <Route path="/login" element={<Login onLoginSuccess={checkAuthStatus} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/login" element={<AdminLogin onLoginSuccess={checkAuthStatus} />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={isAdmin}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </SnackbarProvider>
  );
}

export default App;
