import './App.css';
import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
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
import BASE_URL from './config.js';
import UserBookings from './pages/UserBookings.jsx';
import ReLoginModal from './components/ReLoginModal.jsx';
import Home from './pages/Home.jsx';
import Package from './pages/Package.jsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const checkAuthStatus = async (type = 'user') => {
    const token = axios.defaults.headers.common['Authorization'];
    if (!token) {
      setIsAuthenticated(false);
      setIsAdmin(false);
      return;
    }

    try {
      const endpoint =
        type === 'admin'
          ? `${BASE_URL}/admin/login/verify`
          : `${BASE_URL}/user/login/verify`;
      const response = await axios.get(endpoint);
      if (response.data.success) {
        setIsAuthenticated(true);
        setIsAdmin(type === 'admin');
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout();
      }
    }
  };

  const handleLogout = () => {
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setIsAdmin(false);
    enqueueSnackbar('Logged out successfully', { variant: 'success' });
    navigate('/login');
  };

  useEffect(() => {
    const checkToken = async () => {
      const token = axios.defaults.headers.common['Authorization'];
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1])); // Decode token
          const isExpired = payload.exp * 1000 < Date.now();

          if (isExpired) {
            setShowModal(true);
            handleLogout();
          } else {
            await checkAuthStatus();
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          handleLogout();
        }
      }
    };

    checkToken();
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/login');
  };

  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      autoHideDuration={3000}
      classes={{
        containerRoot: 'custom-snackbar-container',
      }}
    >

      <div
      // style={{ position: 'relative', zIndex: 1, }}
      >
        <Navbar
          isAuthenticated={isAuthenticated}
          isAdmin={isAdmin}
          onLogout={handleLogout}
        />
      </div>

      <div >
        {showModal && <ReLoginModal onClose={handleCloseModal} />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/packages" element={<Package isAuthenticated={isAuthenticated} />} />
          <Route path="/login" element={<Login onLoginSuccess={() => checkAuthStatus('user')} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/login" element={<AdminLogin onLoginSuccess={() => checkAuthStatus('admin')} />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={isAdmin}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route path="/user/bookings" element={<UserBookings isAuthenticated={isAuthenticated} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>


      </div>
    </SnackbarProvider>
  );
}

export default App;
