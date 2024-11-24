import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className='p-4'>
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold text-red-600">404 - Page Not Found</h1>
                <p className="mt-4 text-xl text-gray-700">The page you're looking for doesn't exist.</p>
                <Link to="/" className="mt-6 text-blue-500 hover:text-blue-700">Go back to Home</Link>
            </div>
        </div>);
}

export default NotFound;
