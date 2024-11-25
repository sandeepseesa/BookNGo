<h1 align="center">
BookBazaar
</h1>
<p align="center"> 
<a href='https://bookngo-client.onrender.com'>Live Website</a> | <a href='https://github.com/sandeepseesa/BookNGo'>GitHub Repository</a> <p>
## Overview
>A full-featured Travel Booking Content Management System (CMS) built using the MERN stack (MongoDB, Express, React, Node.js). A booking system that allows users to browse, book, and manage travel packages. The platform features separate interfaces for users and administrators, with secure authentication and real-time booking management.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Authentication](#authentication)
- [Responsive Design](#responsive-design)
- [Error Handling](#error-handling)
- [Security Measures](#security-measures)
- [Contributing](#contributing)
  
## Features

### User Features
- **Admin Authentication**: Secure login with JWT for administrators.
- **Travel Package Management**: Create, view, edit, and delete travel packages with fields like destination, price, dates, and capacity.
- **Booking Management**: Manage customer bookings, including customer details, selected packages, and booking statuses.
- **Responsive UI**: Optimized for both desktop and mobile views with modern UI/UX.
- **Deployment**: Hosted live on Render.com

## Technology Stack

- **Frontend**: React, Axios, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Deployment**: Render

## Installation

To run the project locally, follow these steps:

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
## Environment Variables
     
### In server directory, create .env file
  ```bash    
    PORT=5000
    MONGODB_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    ADMIN_SECRET_KEY=your_admin_secret
  ```

### Usage
   To start the application:
   
### Start backend server (from server directory)
   ```bash
    cd backend
    npm start
   ```
### Start frontend development server (from client directory)
  ```bash
    cd frontend
    npm start
  ```
## Authentication
- JWT Authentication: Admin routes are protected and require a valid JWT token for access.

### Login
<p align="center"> <img src="./screenshots/Login.png" alt="Login" width="300"/> </p>

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

## Error Handling
- Proper error messages are provided for failed authentication and invalid operations.
## Security Measures
- httpOnly Cookies: Used for JWT storage to prevent XSS attacks.
- Environment Variables: Sensitive keys are stored securely.
- CORS: Configured to allow only trusted domains.

## Contributing
Contributions are welcome! Feel free to submit issues, fork the repository, and send pull requests.

---
Happy Coding!🚀
