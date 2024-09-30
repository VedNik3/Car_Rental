import React, { useState, useEffect } from 'react';
import { API_END_POINT } from "../../utils/constants";
import toast from "react-hot-toast";
import axios from 'axios';

const UserBookingDetails = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState(''); // To show success message after deleting

    // Function to fetch bookings for the user
    const fetchBookings = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`${API_END_POINT}/userbookingdetails`, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true, // to send cookies or session info
            });
            setBookings(response.data.bookings);
        } catch (err) {
            setError(err.response ? err.response.data.message : "Unable to fetch bookings");
        } finally {
            setLoading(false);
        }
    };

    // Function to delete a booking
    const deleteBooking = async (bookingId) => {
        setMessage('');
        try {
            await axios.delete(`${API_END_POINT}/deleteuserbooking/${bookingId}`, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true, // to send cookies or session info
            });
            setBookings(bookings.filter(booking => booking._id !== bookingId));
            // setMessage('Booking deleted successfully.');
            toast.success("Booking deleted successfully.");
        } catch (err) {
            setError(err.response ? err.response.data.message : "Unable to delete booking");
        }
    };

    // Automatically fetch bookings when the component loads
    useEffect(() => {
        fetchBookings();
    }, []); // Only run once on component mount

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 ml-[16%]">
            <h1 className="text-3xl font-bold mb-4">Your Booking Details</h1>

            {/* Show error if any */}
            {error && <div className="text-red-600 mb-4">{error}</div>}
            {/* Show success message after deletion */}
            {message && <div className="text-green-600 mb-4">{message}</div>}
            {/* Show loading spinner */}
            {loading && <div className="text-blue-600">Loading...</div>}

            {/* Render booking details in a table */}
            {!loading && bookings.length > 0 && (
                <div className="overflow-x-auto w-full">
                    <table className="min-w-full bg-white border border-gray-200 shadow-md">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="py-2 px-4 border-b">Car</th>
                                <th className="py-2 px-4 border-b">Rental Period</th>
                                <th className="py-2 px-4 border-b">Total Price</th>
                                <th className="py-2 px-4 border-b">Pickup Location</th>
                                <th className="py-2 px-4 border-b">Dropoff Location</th>
                                <th className="py-2 px-4 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking._id} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border-b">
                                        {booking.car.brand} {booking.car.model} ({booking.car.regNumber})
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        {new Date(booking.rentalStartDate).toLocaleDateString()} - {new Date(booking.rentalEndDate).toLocaleDateString()}
                                    </td>
                                    <td className="py-2 px-4 border-b">${booking.totalPrice}</td>
                                    <td className="py-2 px-4 border-b">
                                        {booking.rentalLocation.pickupLocation}
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        {booking.rentalLocation.dropoffLocation}
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        <button 
                                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                            onClick={() => deleteBooking(booking._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* If no bookings found */}
            {!loading && bookings.length === 0 && !error && (
                <div>No bookings found for this user.</div>
            )}
        </div>
    );
};

export default UserBookingDetails;