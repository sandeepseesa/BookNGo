import React from 'react';

function MessageAlert({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
      <span className="block sm:inline">{message}</span>
      <button
        className="absolute top-0 bottom-0 right-0 px-4 py-3"
        onClick={onClose}
      >
        <span className="text-green-500 hover:text-green-800">×</span>
      </button>
    </div>
  );
}

export default MessageAlert; 