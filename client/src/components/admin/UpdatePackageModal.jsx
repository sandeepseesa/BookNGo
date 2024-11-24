import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

function UpdatePackageModal({ isOpen, onClose, package: packageData, onUpdate }) {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    destination: '',
    title: '',
    description: '',
    price: '',
    maxTravelers: '',
    availableDates: []
  });

  useEffect(() => {
    if (packageData) {
      setFormData({
        ...packageData,
        availableDates: packageData.availableDates.map(date => new Date(date))
      });
    }
  }, [packageData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      availableDates: [...prev.availableDates, date]
    }));
  };

  const removeDate = (dateToRemove) => {
    setFormData(prev => ({
      ...prev,
      availableDates: prev.availableDates.filter(date => date !== dateToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submissionData = {
        ...formData,
        availableDates: formData.availableDates.map(date => date.toISOString())
      };
      await onUpdate(packageData._id, submissionData);
      enqueueSnackbar('Package updated successfully!', { variant: 'success' });
      onClose();
    } catch (error) {
      enqueueSnackbar(error.message || 'Failed to update package', { variant: 'error' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Update Package</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Destination</label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Destination"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder="Description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Price"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Max Travelers</label>
              <input
                type="number"
                name="maxTravelers"
                value={formData.maxTravelers}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Max Travelers"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Available Dates</label>
              <div className="mt-1">
                <DatePicker
                  selected={null}
                  onChange={handleDateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  minDate={new Date()}
                  placeholderText="Select dates"
                  isClearable
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.availableDates.map((date, index) => (
                  <div
                    key={index}
                    className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-md flex items-center"
                  >
                    <span>{date.toLocaleDateString()}</span>
                    <button
                      type="button"
                      onClick={() => removeDate(date)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                Update Package
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdatePackageModal; 