import React from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';

function ManageBookings({ bookings, fetchData, setMessage }) {
    const { enqueueSnackbar } = useSnackbar();

    const handleUpdateBookingStatus = async (id, status) => {
        try {
            const response = await axios.patch(
                `https://bookngo-server.onrender.com/booking/${id}/status`,
                { status },
                { withCredentials: true }
            );

            if (response.data && response.data.booking) {
                // setMessage(`Booking ${status.toLowerCase()} successfully!`);
                enqueueSnackbar(`Booking ${status.toLowerCase()} successfully!`, { variant: 'success' });
                await fetchData();
            }
        } catch (error) {
            enqueueSnackbar(
                error.response?.data?.message ||
                `Error updating booking to ${status}. Please try again.`,
                { variant: 'error' }
            );
            // setMessage(
            //     error.response?.data?.message ||
            //     `Error updating booking to ${status}. Please try again.`
            // );
        }
    };

    const handleDeleteBooking = async (id) => {
        if (window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
            try {
                await axios.delete(`https://bookngo-server.onrender.com/booking/${id}`, {
                    withCredentials: true
                });
                enqueueSnackbar('Booking deleted successfully', { variant: 'success' });
                await fetchData();
            } catch (error) {
                enqueueSnackbar(error.response?.data?.message || 'Error deleting booking', { variant: 'error' });
                // setMessage(error.response?.data?.message || 'Error deleting booking');
            }
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-700">Booking List</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage and track all customer bookings
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bookings.map((booking) => (
                    <div
                        key={booking._id}
                        className="bg-white rounded-lg shadow p-6 border border-gray-200"
                    >
                        {/* Status Badge */}
                        <div className="flex justify-between items-start mb-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                    booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                        'bg-red-100 text-red-800'
                                }`}>
                                {booking.status}
                            </span>
                            <p className="text-sm text-gray-500">
                                ID: {booking._id.slice(-6)}
                            </p>
                        </div>

                        {/* Main Content */}
                        <div className="space-y-4">
                            {/* Package Info */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-800">
                                    {booking.packageId?.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {booking.packageId?.destination}
                                </p>
                            </div>

                            {/* Customer Info */}
                            <div className="text-sm">
                                <p className="text-gray-600">
                                    Customer Email: {booking.email}
                                </p>
                                <p className="text-gray-600">
                                    Travel Date: {new Date(booking.selectedDate).toLocaleDateString()}
                                </p>
                                <p className="text-gray-600">
                                    Travelers: {booking.numberoftravelers}
                                </p>
                                <p className="font-medium text-gray-800">
                                    Total: ${booking.totalPrice}
                                </p>
                            </div>

                            {/* Booking Dates */}
                            <div className="text-xs text-gray-500">
                                <p>Booked: {new Date(booking.createdAt).toLocaleString()}</p>
                                <p>Updated: {new Date(booking.updatedAt).toLocaleString()}</p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-2 pt-4">
                                {booking.status === 'Pending' && (
                                    <>
                                        <button
                                            onClick={() => handleUpdateBookingStatus(booking._id, "Confirmed")}
                                            className="flex-1 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors text-sm"
                                        >
                                            Confirm
                                        </button>
                                        <button
                                            onClick={() => handleUpdateBookingStatus(booking._id, "Cancelled")}
                                            className="flex-1 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors text-sm"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                )}
                                {booking.status === 'Confirmed' && (
                                    <button
                                        onClick={() => handleUpdateBookingStatus(booking._id, "Cancelled")}
                                        className="flex-1 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors text-sm"
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDeleteBooking(booking._id)}
                                    className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {bookings.length === 0 && (
                <div className="text-center py-8 bg-white rounded-lg shadow">
                    <p className="text-gray-500">No bookings found</p>
                </div>
            )}
        </div>
    );
}

export default ManageBookings; 