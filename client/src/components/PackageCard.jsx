import React from 'react';

function PackageCard({ pkg, isAuthenticated, onBookClick }) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <h2 className="text-xl font-semibold text-orange-500">{pkg.title}</h2>
      <p className="text-blue-700 mt-2">Destination: {pkg.destination}</p>
      <p className="text-gray-700 mt-2">{pkg.description}</p>
      <p className="text-gray-900 mt-2 font-semibold">Price: ${pkg.price}</p>
      <p className="text-gray-600 mt-2">
        Available Dates: {pkg.availableDates.map(date => 
          new Date(date).toLocaleDateString()
        ).join(", ")}
      </p>
      <p className="text-gray-600 mt-2">Max Travelers: {pkg.maxTravelers}</p>
      <button
        className={`mt-4 w-full py-2 px-4 rounded transition-colors ${
          isAuthenticated
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-400 text-white cursor-not-allowed"
        }`}
        onClick={() => onBookClick(pkg)}
      >
        {isAuthenticated ? "Book Now" : "Login to Book"}
      </button>
    </div>
  );
}

export default PackageCard; 