import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import MobileMenu from "./MobileMenu";

function Navbar({ isAuthenticated, isAdmin, onLogout }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

  const handleLogout = async () => {
    try {
      const endpoint = isAdmin ? '/admin/login/logout' : '/user/login/logout';
      
      await axios.post(`https://bookngo-server.onrender.com${endpoint}`, {}, {
        headers: {
          'Authorization': axios.defaults.headers.common['Authorization']
        }
      });

      delete axios.defaults.headers.common['Authorization'];
      
      onLogout();
      
      enqueueSnackbar('Logged out successfully', { variant: 'success' });
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      enqueueSnackbar('Error logging out', { variant: 'error' });
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-red-600 via-green-500 to-green-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold tracking-wide hover:text-blue-300 transition duration-200">
              BookNGo
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-blue-300 focus:outline-none"
              aria-expanded="false"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {!isAuthenticated ? (
              <>
                {/* Home Button */}
                <button
                  onClick={() => navigate('/')}
                  className="px-4 py-2 border-2 border-white text-white rounded-lg hover:bg-white hover:text-gray-800 transition-colors duration-200"
                >
                  Home
                </button>
                
                {/* User Button with Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowUserModal(!showUserModal);
                      setShowAdminModal(false);
                    }}
                    className="px-4 py-2 border-2 border-white text-white rounded-lg hover:bg-white hover:text-gray-800 transition-colors duration-200"
                  >
                    User
                  </button>
                  
                  {/* User Modal */}
                  {showUserModal && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        onClick={() => setShowUserModal(false)}
                      >
                        User Login
                      </Link>
                      <Link
                        to="/register"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        onClick={() => setShowUserModal(false)}
                      >
                        User Register
                      </Link>
                    </div>
                  )}
                </div>

                {/* Admin Button with Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowAdminModal(!showAdminModal);
                      setShowUserModal(false);
                    }}
                    className="px-4 py-2 border-2 border-white text-white rounded-lg hover:bg-white hover:text-gray-800 transition-colors duration-200"
                  >
                    Admin
                  </button>
                  
                  {/* Admin Modal */}
                  {showAdminModal && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                      <Link
                        to="/admin/login"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        onClick={() => setShowAdminModal(false)}
                      >
                        Admin Login
                      </Link>
                      <Link
                        to="/admin/register"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        onClick={() => setShowAdminModal(false)}
                      >
                        Admin Register
                      </Link>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/')}
                  className="px-4 py-2 border-2 border-white text-white rounded-lg hover:bg-white hover:text-gray-800 transition-colors duration-200"
                >
                  Home
                </button>
                {isAdmin && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="px-4 py-2 border-2 border-white text-white rounded-lg hover:bg-white hover:text-gray-800 transition-colors duration-200"
                  >
                    Dashboard
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 active:bg-red-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>

        {/* Click outside to close dropdowns */}
        {(showUserModal || showAdminModal) && (
          <div 
            className="fixed inset-0 z-40"
            onClick={() => {
              setShowUserModal(false);
              setShowAdminModal(false);
            }}
          />
        )}

        {/* Mobile menu */}
        <MobileMenu 
          isMenuOpen={isMenuOpen} 
          isAuthenticated={isAuthenticated} 
          setIsMenuOpen={setIsMenuOpen} 
          isAdmin={isAdmin} 
          handleLogout={handleLogout} 
        />
      </div>
    </nav>
  );
}

export default Navbar;
