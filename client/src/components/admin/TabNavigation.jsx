import React from 'react';

function TabNavigation({ activeTab, setActiveTab }) {
  return (
    <nav className="flex space-x-4 border-b border-gray-200 mb-6">
      <button
        className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
          activeTab === "packages"
            ? "bg-white text-blue-600 border-b-2 border-blue-600"
            : "text-gray-500 hover:text-gray-700"
        }`}
        onClick={() => setActiveTab("packages")}
      >
        Manage Packages
      </button>
      <button
        className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
          activeTab === "bookings"
            ? "bg-white text-blue-600 border-b-2 border-blue-600"
            : "text-gray-500 hover:text-gray-700"
        }`}
        onClick={() => setActiveTab("bookings")}
      >
        Manage Bookings
      </button>
    </nav>
  );
}

export default TabNavigation; 