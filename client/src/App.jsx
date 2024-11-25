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
    
    const cookies = document.cookie;
    console.log('All cookies:', cookies); // Debug log

    // // Parse cookies into an object
    // const cookieObj = cookies.split(';').reduce((acc, cookie) => {
    //   const [key, value] = cookie.trim().split('=');
    //   acc[key] = value;
    //   return acc;
    // }, {});

    // console.log('Parsed cookies:', cookieObj); // Debug log
    console.log('Admin token present', adminToken); // Debug log
    const adminToken = document.cookie.includes('adminToken=');
    const userToken = document.cookie.includes('userToken=');

    console.log('Cookie check:', adminToken); // Debug log
    console.log('User token present', userToken);

      if (adminToken) {
        setIsAuthenticated(true);
        setIsAdmin(true);
      } else if (userToken) {
        setIsAuthenticated(true);
        setIsAdmin(false);
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }

      // console.log('Auth state set to:', { 
      //   isAuthenticated: adminToken || userToken, 
      //   isAdmin: adminToken 
      // });

    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
      setIsAdmin(false);
    } 
  };

  useEffect(() => {
    checkAuthStatus();

    // // Check auth status periodically
    // const interval = setInterval(checkAuthStatus, 1000);

    // return () => {
    //   clearInterval(interval);
    // };
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
