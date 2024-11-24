# BookNGo - Travel Package Booking System

## Overview
BookNGo is a comprehensive travel package booking system that allows users to browse, book, and manage travel packages. The platform features separate interfaces for users and administrators, with secure authentication and real-time booking management.

## Features

### User Features
- **User Authentication**
  - Secure registration and login
  - Password encryption
  - Email validation
  - Session management

- **Package Browsing**
  - View available travel packages
  - Detailed package information
  - Real-time availability status
  - Package pricing and dates

- **Booking Management**
  - Book travel packages
  - View booking history
  - Cancel bookings
  - Receive booking confirmations

### Admin Features
- **Secure Admin Panel**
  - Protected admin registration with secret key
  - Separate admin authentication
  - Role-based access control

- **Package Management**
  - Create new travel packages
  - Update existing packages
  - Delete packages
  - Manage package availability

- **Booking Overview**
  - View all bookings
  - Manage booking statuses
  - Track booking history
  - Generate booking reports

## Technology Stack

### Frontend
- React.js
- Tailwind CSS
- Axios for API calls
- React Router for navigation
- Notistack for notifications

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing

## Installation

1. Clone the repository 
  ```bash
git clone https://github.com/sandeepseesa/BookNGo.git
cd BookNGo
  ```
2. Install dependencies for both frontend and backend
    
  ### Install backend dependencies  
  ```bash
  cd server
  npm install
  ```
  ### Install frontend dependencies
   ```bash
  cd ../client
  npm install
  ```
  3. Set up environment variables
     
### In server directory, create .env file
  ```bash    
    PORT=5000
    MONGODB_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    ADMIN_SECRET_KEY=your_admin_secret
  ```

4. Start the application
### Start backend server (from server directory)
   ```bash
    npm start
   ```
### Start frontend development server (from client directory)
  ```bash
    npm start
  ```
## API Endpoints

### User Routes
- `POST /user/register` - Register new user
- `POST /user/login` - User login
- `GET /user/logout` - User logout

### Admin Routes
- `POST /admin/register` - Register new admin
- `POST /admin/login` - Admin login
- `GET /admin` - Admin dashboard access

### Package Routes
- `GET /package` - Get all packages
- `POST /package` - Create new package (admin only)
- `PUT /package/:id` - Update package (admin only)
- `DELETE /package/:id` - Delete package (admin only)

### Booking Routes
- `POST /booking` - Create new booking
- `GET /booking` - Get all bookings
- `PUT /booking/:id` - Update booking status
- `DELETE /booking/:id` - Cancel booking

## Security Features
- Password hashing
- JWT authentication
- Protected routes
- Input validation
- Error handling
- CORS protection
- Rate limiting

## Folder Structure
BookNGo/
├── client/ # Frontend React application
│ ├── src/
│ │ ├── components/ # Reusable components
│ │ │ ├── admin/ # Admin-specific components
│ │ │ │ ├── CreatePackageModal.jsx
│ │ │ │ ├── ManageBookings.jsx
│ │ │ │ ├── ManagePackages.jsx
│ │ │ │ ├── MessageAlert.jsx
│ │ │ │ └── TabNavigation.jsx
│ │ │ └── BookingModal.jsx
│ │ │ ├── MobileMenu.jsx
│ │ │ ├── Navbar.jsx
│ │ │ └── PackageCard.jsx
│ │ │ └── ProtectedRoute.jsx
│ │ ├── pages/ # Page components
│ │ │ ├── AdminLogin.jsx
│ │ │ ├── AdminPanel.jsx
│ │ │ ├── AdminRegister.jsx
│ │ │ ├── Home.jsx
│ │ │ ├── Login.jsx
│ │ │ ├── NotFound.jsx
│ │ │ └── Register.jsx
│ │ ├── App.js # Main application component
│ │ └── index.js # Application entry point
│ ├── package.json
│ └── tailwind.config.js # Tailwind CSS configuration
│
├── server/ # Backend Node.js application
│ ├── models/ # Database models
│ │ ├── Admin.js
│ │ ├── Booking.js
│ │ ├── Package.js
│ │ └── User.js
│ ├── routes/ # API routes
│ │ ├── adminAuthMiddleware.js
│ │ ├── adminLogin.js
│ │ ├── adminRegister.js
│ │ ├── authMiddleware.js
│ │ ├── bookingRoutes.js
│ │ ├── login.js
│ │ ├── packageRoutes.js
│ │ └── register.js
│ ├── .env # Environment variables
│ ├── package.json
│ └── index.js # Server entry point
│
├── .gitignore
├── README.md
└── package.json

## Contributing
Contributions are welcome! Feel free to submit issues, fork the repository, and send pull requests.

---
Happy Coding!🚀
