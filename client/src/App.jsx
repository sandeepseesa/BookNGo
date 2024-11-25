import './App.css';
import { useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import NotFound from "./pages/NotFound.jsx";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRegister from "./pages/AdminRegister.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import { SnackbarProvider, useSnackbar } from 'notistack';
import axios from 'axios';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const checkAuthStatus = async (type = 'user') => {
    const token = axios.defaults.headers.common['Authorization'];
    if (!token) {
      setIsAuthenticated(false);
      setIsAdmin(false);
      return;
    }

    try {
      if (type === 'admin') {
        const response = await axios.get('https://bookngo-server.onrender.com/admin/login/verify');
        if (response.data.success) {
          setIsAuthenticated(true);
          setIsAdmin(true);
        }
      } else {
        const response = await axios.get('https://bookngo-server.onrender.com/user/login/verify');
        if (response.data.success) {
          setIsAuthenticated(true);
          setIsAdmin(false);
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        setIsAuthenticated(false);
        setIsAdmin(false);
        delete axios.defaults.headers.common['Authorization'];
      }
    }
  };

  const handleLoginSuccess = async (type = 'user') => {
    await checkAuthStatus(type);
  };

  const handleLogout = () => {
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setIsAdmin(false);
    enqueueSnackbar('Logged out successfully', { variant: 'success' });
  };

  useEffect(() => {
    const token = axios.defaults.headers.common['Authorization'];
    if (token) {
      checkAuthStatus();
    }
  }, []);

  return (
    <SnackbarProvider 
      maxSnack={3} 
      anchorOrigin={{ 
        vertical: 'top', 
        horizontal: 'right' 
      }}
      autoHideDuration={3000}
    >
      <div className="App">
        <Navbar
          isAuthenticated={isAuthenticated}
          isAdmin={isAdmin}
          onLogout={handleLogout}
        />
        <Routes>
          <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
          <Route path="/login" element={<Login onLoginSuccess={() => handleLoginSuccess('user')} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/login" element={<AdminLogin onLoginSuccess={() => handleLoginSuccess('admin')} />} />
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
