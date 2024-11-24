import React from 'react';

function BookingModal({ selectedPackage, formData, setFormData, onClose, onSubmit }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-700 mb-4">
          Book Package: {selectedPackage.title}
        </h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Number of Travelers:
            </label>
            <input
              type="number"
              value={formData.numberoftravelers}
              onChange={(e) => setFormData({ 
                ...formData, 
                numberoftravelers: Math.min(
                  parseInt(e.target.value), 
                  selectedPackage.maxTravelers
                )
              })}
              min="1"
              max={selectedPackage.maxTravelers}
              required
              className="w-full mt-1 p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Select Date:</label>
            <select
              value={formData.selectedDate}
              onChange={(e) => setFormData({ ...formData, selectedDate: e.target.value })}
              required
              className="w-full mt-1 p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a date</option>
              {selectedPackage.availableDates.map((date, index) => (
                <option key={index} value={date}>
                  {new Date(date).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          <div className="text-right font-semibold text-lg text-gray-700">
            Total Price: ${selectedPackage.price * formData.numberoftravelers}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookingModal; 