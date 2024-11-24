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
import { SnackbarProvider } from 'notistack';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAuthStatus = () => {
    const cookieObj = document.cookie.split('; ').reduce((prev, current) => {
      const [name, value] = current.split('=');
      prev[name] = value;
      return prev;
    }, {});


    const isUserLoggedIn = Boolean(cookieObj.token);
    const isAdminLoggedIn = cookieObj.isAdminAuthenticated === 'true';

    setIsAuthenticated(isUserLoggedIn || isAdminLoggedIn);
    setIsAdmin(isAdminLoggedIn);
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right',}}
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