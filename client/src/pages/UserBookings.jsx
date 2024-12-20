import { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from "../config";
import { useSnackbar } from 'notistack';
import { useNavigate } from "react-router-dom";
import { Navigate, useLocation } from "react-router-dom";

const UserBookings = ({ isAuthenticated }) => {
    const [myBookings, setMyBookings] = useState([]);
    const [showUpdateBooking, setShowUpdateBooking] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const location = useLocation();

    const fetchData = async () => {
        try {
            const token = axios.defaults.headers.common['Authorization'];
            const config = {
                headers: { Authorization: token }
            };

            const myBookingsResponse = await axios.get(
                `${BASE_URL}/user/bookings`,
                config
            );


            const bookingsArray = myBookingsResponse.data.bookings;
            // Check if data is an array
            if (Array.isArray(bookingsArray)) {
                const mappedResponse = bookingsArray.map((item) => { 
                    return {
                    bookingId: item._id,
                    user: {
                        userId: item.userId._id,
                        username: item.userId.username,
                        email: item.userId.email,
                    },
                    package: {
                        packageId: item.packageId._id,
                        packageName: item.packageId.title,
                        packageDestination: item.packageId.destination,
                        price: item.packageId.price,
                    },
                    email: item.email,
                    selectedDate: item.selectedDate,
                    numberOfTravelers: item.numberoftravelers,
                    totalPrice: item.totalPrice,
                    status: item.status,
                    statusHistory: item.statusHistory,
                    createdAt: new Date(item.createdAt).toLocaleString(),
                    updatedAt: new Date(item.updatedAt).toLocaleString(),
                };
                });

                setMyBookings(mappedResponse.reverse());

            } else {
                console.error("bookings is not an array");
                setMyBookings([]); // Fallback
            }

        } catch (error) {
            console.error('Fetch data error:', error);
            if (error.response?.status === 401) {
                // Check if the error is due to user token
                if (error.response.data.message.includes("Unauthorized access")) {
                    delete axios.defaults.headers.common['Authorization'];
                    navigate('/login');
                } else {
                    enqueueSnackbar(
                        error.response?.data?.message || "Error fetching data",
                        { variant: 'error' }
                    );
                }
            } else {
                enqueueSnackbar(
                    error.response?.data?.message || "Error fetching data",
                    { variant: 'error' }
                );
            }

        }
    }

    useEffect(() => {
        if (isAuthenticated) {
            fetchData();
        } else {
            navigate('/login');
        }

    }, []);

    const handleDeleteBooking = async (id) => {
        if (window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
            try {
                await axios.delete(`${BASE_URL}/booking/${id}`, {
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

    // const handleUpdateClick = (booking) => {
    //     setIsUpdateModalOpen(true);
    // }

    // const handleUpdateBooking = async (id, updatedData) => {
    //     try {
    //         await axios.put(`${BASE_URL}/booking/${id}`, updatedData, {
    //             withCredentials: true
    //         });
    //         await UpdateData();
    //         enqueueSnackbar('Package updated successfully!', { variant: 'success' });
    //     } catch (error) {
    //         enqueueSnackbar(error.response?.data?.message || 'Error updating package', { variant: 'error' });
    //     }
    // };
    
    return (
        <div>
        <div className="container mx-auto p-4 relative top-16">
            <h1 className="text-2xl font-bold mb-4 text-blue-600">My Bookings</h1>
            {myBookings.length > 0 ? (
                
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {myBookings.map((booking) => (
                        <li key={booking.bookingId} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
                            <h2 className="text-lg font-semibold text-green-600 mb-2">Package: <span className="font-normal text-gray-800"><strong>{booking.package.packageName}</strong></span></h2>
                            <h3 className="text-lg font-semibold text-blue-600 mb-2">Package Price: <span className="font-normal text-gray-800">${booking.package.price}</span></h3>
                            <p className="text-gray-600">Date: <span className="text-gray-800">{new Date(booking.selectedDate).toLocaleDateString()}</span></p>
                            <p className="text-gray-600">Travelers: <span className="text-gray-800">{booking.numberOfTravelers}</span></p>
                            <p className="text-gray-600">Total Price: <span className="font-bold text-red-600">${booking.totalPrice}</span></p>
                            <p className="text-gray-600">Status: <span className={`font-semibold ${booking.status === 'Confirmed' ? 'text-green-500' : 'text-red-500'}`}>{booking.status}</span></p>
                            <p className="text-gray-600">Booked Date: <span className="text-gray-800">{booking.createdAt}</span></p>
                            <div className='flex justify-between items-center'> 
                            <button onClick={() => handleDeleteBooking(booking.bookingId)} className='ml-auto mt-2 bg-red-500 text-white px-4 py-1 rounded-md hover:bg-gray-700'>Delete</button>
                            {/* <button onClick={() => handleUpdateClick(booking.bookingId)} className='ml-auto mt-2 bg-red-500 text-white px-4 py-1 rounded-md hover:bg-gray-700'>Update</button>  */}
                            </div>
                            
                        </li>        
                    ))}
                </ul>
                
               
            ) : (
                <p className="text-gray-500">No bookings found.</p>
            )}
        </div>

        {/* <UpdateBooking
            isOpen={isUpdateModalOpen}
            isClose={() => {
                setIsUpdateModalOpen(false);
            }}
            onUpdate={handleUpdateBooking}
        /> */}

        </div>
    )
}

export default UserBookings;