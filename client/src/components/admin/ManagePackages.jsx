import React, { useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import UpdatePackageModal from './UpdatePackageModal';
import BASE_URL from '../../config';

function ManagePackages({ packages, fetchData, setIsModalOpen }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const { enqueueSnackbar } = useSnackbar();

    const handleDeletePackage = async (id) => {
        if (window.confirm('Are you sure you want to delete this package? This action cannot be undone.')) {
            try {
                await axios.delete(`${BASE_URL}/package/${id}`, {
                    withCredentials: true
                });
                // setMessage("Package deleted successfully!");
                enqueueSnackbar('Package deleted successfully!', { variant: 'success' });
                fetchData();
            } catch (error) {
                enqueueSnackbar(error.response?.data?.message || 'Error deleting package', { variant: 'error' });
            }
        }
    };

    const handleUpdateClick = (pkg) => {
        setSelectedPackage(pkg);
        setIsUpdateModalOpen(true);
    };

    const handleUpdate = async (id, updatedData) => {
        try {
            await axios.put(`${BASE_URL}/package/${id}`, updatedData, {
                withCredentials: true
            });
            fetchData();
            enqueueSnackbar('Package updated successfully!', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || 'Error updating package', { variant: 'error' });
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-700">Package List</h2>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700"
                    onClick={() => setIsModalOpen(true)}
                >
                    + Create Package
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                    <div
                        key={pkg._id}
                        className="bg-white rounded-lg shadow p-6 border border-gray-200"
                    >
                        <div className="flex justify-between items-start">
                            <div className="space-y-3">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-800">
                                        {pkg.title}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {pkg.destination}
                                    </p>
                                </div>

                                <p className="text-sm text-gray-600 line-clamp-2">
                                    {pkg.description}
                                </p>

                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-700">
                                        Price: ${pkg.price}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Max Travelers: {pkg.maxTravelers}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Available Dates: {pkg.availableDates.length}
                                    </p>
                                </div>

                                <div className="pt-2">
                                    <button
                                        onClick={() => handleUpdateClick(pkg)}
                                        className="m-1 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 text-sm"
                                    >
                                        Update
                                    </button>
                                    <button
                                        onClick={() => handleDeletePackage(pkg._id)}
                                        className="m-1 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm"
                                    >
                                        Delete Package
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {packages.length === 0 && (
                <div className="text-center py-8 bg-white rounded-lg shadow">
                    <p className="text-gray-500">No packages available</p>
                </div>
            )}

            <UpdatePackageModal
                isOpen={isUpdateModalOpen}
                onClose={() => {
                    setIsUpdateModalOpen(false);
                    setSelectedPackage(null);
                }}
                package={selectedPackage}
                onUpdate={handleUpdate}
            />
        </div>
    );
}

export default ManagePackages;