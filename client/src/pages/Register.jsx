import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // Username validation: Minimum length of 4 characters
  const validateUsername = (username) => {
    return username.length >= 4;
  };

  // Password validation: Minimum length of 8, must include at least one letter and one number
  const validatePassword = (password) => {
    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /\d/.test(password);

    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters long.' };
    }

    if (!hasLetter) {
      return { valid: false, message: 'Password must contain at least one letter.' };
    }
    if (!hasNumber) {
      return { valid: false, message: 'Password must contain at least one number.' };
    }

    return { valid: true };
  };

  const validateEmail = (email) => {
    return email.includes('@');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if both fields are filled
    if (!username || !password || !email) {
      setError('Please fill in all fields');
      return;
    }

    // Validate username and password
    if (!validateUsername(username)) {
      setError('Username must be at least 4 characters long.');
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setError(passwordValidation.message);
      return;
    }

    if (!validateEmail(email)) {
      setError('Invalid email address.');
      return;
    }

    try {
      const response = await axios.post('https://bookngo-server.onrender.com/user/register', { username, password, email });
      enqueueSnackbar('Registered Successfully!', { variant: 'success' });
      setError('');

      // Clear form after successful registration
      setUsername('');
      setPassword('');
      setEmail('');

      //Redirect to login page 
      navigate('/login');

    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message); // Display the error message from the backend
        enqueueSnackbar(error.response.data.message, { variant: 'error' });
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-xl">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-3">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Log in here
            </a>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username" required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password" required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email" required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex justify-between items-center">
            <button type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700 transition">
              Register
            </button>
          </div>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
};

export default Register;
