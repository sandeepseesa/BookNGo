import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useState } from "react";
import BASE_URL from "../config";

function Navbar({ isAuthenticated, isAdmin, onLogout }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

  const handleLogout = async () => {
    try {
      const endpoint = isAdmin ? '/admin/login/logout' : '/user/login/logout';

      await axios.post(`${BASE_URL}${endpoint}`, {}, {
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

  const handleLinkClick = (e, sectionId,) => {
    e.preventDefault();
    if (location.pathname === "/") {
      // If already on the Home page, scroll to the section
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }  else {
      // Navigate to Home page and scroll after navigation
      navigate('/');
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }, 300); // Delay to ensure navigation happens before scrolling
    setIsMenuOpen(false);
    }
  };


  return (
    <nav className="py-4 fixed w-full top-0 z-50 bg-black/50 shadow-xl">
      <div className="container mx-auto flex justify-between items-center px-6">
        <h1 className="text-2xl text-white font-bold">
          <Link to="/">BookNGo</Link>
        </h1>
        
        {/* Menu toggle for small screens */}
        <button
          className="text-white md:hidden"
          onClick={toggleMenu}
        >
          ☰
        </button>

        {/* Nav Links */}
        <div
          className={`absolute md:static top-16 left-0 w-full md:w-auto bg-black/75 md:bg-transparent md:flex items-center ${isMenuOpen ? "block" : "hidden"}`}
        >
          <ul className="flex flex-col md:flex-row justify-center md:space-x-8 p-4 md:p-0 w-full">
            <li><Link to="/" className="text-white hover:text-yellow-500">Home</Link></li>
            <li><Link to="/packages" className="text-white hover:text-yellow-500">Packages</Link></li>
            <li onClick={(e) => handleLinkClick(e,"about")} className="text-white hover:text-yellow-500">About</li>
            <li onClick={(e) => handleLinkClick(e, "testimonials")} className="text-white hover:text-yellow-500">Testimonials</li>
            {/* <li onClick={(e) => handleLinkClick(e, "contact")} className="text-white hover:text-yellow-500">Contact</li> */}

            {!isAuthenticated ? (
              <>
                <li className="relative">
                  <button
                    onClick={() => {
                      setShowUserModal(!showUserModal);
                      setShowAdminModal(false);
                    }}
                    className="text-white"
                  >
                    User
                  </button>
                  {showUserModal && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                      <Link to="/login" className="block px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={() => setShowUserModal(false)} > User Login </Link>
                      <Link to="/register" className="block px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={() => setShowUserModal(false)} > User Register </Link>
                    </div>
                  )}
                </li>

                <li className="relative">
                  <button onClick={() => { setShowAdminModal(!showAdminModal); setShowUserModal(false); }} className="text-white"> Admin </button>
                  {showAdminModal && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                      <Link to="/admin/login" className="block px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={() => setShowAdminModal(false)}>Admin Login </Link>
                      <Link to="/admin/register"className="block px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={() => setShowAdminModal(false)} > Admin Register </Link>
                    </div>
                  )}
                </li>
              </>
            ) : (
              <>
                {/* <li>  <button onClick={() => navigate('/')} className="text-white hover:text-yellow-500" >Home</button></li> */}

                {isAdmin ? (
                  <li><button onClick={() => navigate('/admin')} className="text-white hover:text-yellow-500" >Dashboard</button> </li>
                )
                :
                <li><button onClick={() => navigate('/user/bookings')} className="text-white hover:text-yellow-500"> My Bookings</button></li>
              }
                <li><button onClick={handleLogout} className="text-white hover:text-red-600">Logout</button></li>
              </>
            )}
          </ul>

          {/* Click outside to close dropdowns */}
          {(showUserModal || showAdminModal) && (
            <div className="fixed inset-0 z-40" onClick={() => { setShowUserModal(false); setShowAdminModal(false); }} />
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
