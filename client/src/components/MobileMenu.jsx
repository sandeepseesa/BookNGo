import React from 'react';
import { Link } from 'react-router-dom';

const MobileMenu = ({ isMenuOpen, isAuthenticated, setIsMenuOpen, isAdmin, handleLogout }) => {
  return (
    <div 
          className={`
            fixed top-0 right-0 h-full w-64 bg-white transform transition-transform duration-300 ease-in-out
            ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
            md:hidden z-50
          `}
        >
          {/* Close button */}
          <div className="flex justify-end p-4">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-black hover:text-gray-600"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Menu items */}
          <div className="flex flex-col space-y-3 p-4">
            {!isAuthenticated ? (
              <>
                <Link 
                  to="/" 
                  className="text-black hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/login" 
                  className="text-black hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  User Login
                </Link>
                <Link 
                  to="/register" 
                  className="text-black hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  User Register
                </Link>
                <Link 
                  to="/admin/login" 
                  className="text-black hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Login
                </Link>
                <Link 
                  to="/admin/register" 
                  className="text-black hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Register
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/" 
                  className="text-black hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/user/bookings" 
                  className="text-black hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Bookings
                </Link>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="text-black hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="bg-red-500 px-4 py-2 rounded hover:bg-red-700 text-left w-full"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
  );
};

export default MobileMenu;