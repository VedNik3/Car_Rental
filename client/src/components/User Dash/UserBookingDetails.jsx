import React, { useState, useEffect } from "react";
import { API_END_POINT } from "../../utils/constants";
import toast from "react-hot-toast";
import axios from "axios";

const UserBookingDetails = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // To show success message after actions

  // Function to fetch bookings for the user
  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${API_END_POINT}/userbookingdetails`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // to send cookies or session info
      });
      setBookings(response.data.bookings);
    } catch (err) {
      setError(
        err.response ? err.response.data.message : "Unable to fetch bookings"
      );
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a booking
  const deleteBooking = async (bookingId) => {
    setMessage("");
    try {
      await axios.delete(`${API_END_POINT}/deleteuserbooking/${bookingId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // to send cookies or session info
      });
      setBookings(bookings.filter((booking) => booking._id !== bookingId));
      toast.success("Booking deleted successfully.");
    } catch (err) {
      setError(
        err.response ? err.response.data.message : "Unable to delete booking"
      );
    }
  };

    // Function to cancel a booking
    const cancelBooking = async (bookingId) => {
        setMessage('');
        try {
            await axios.patch(`${API_END_POINT}/canceluserbooking/${bookingId}`, {
                status: "canceled", // Send the status update
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true, // to send cookies or session info
            });
            // Update the booking status in the state
            setBookings(bookings.map(booking =>
                booking._id === bookingId ? { ...booking, status: "canceled" } : booking
            ));
            toast.success("Booking canceled successfully.");
        } catch (err) {
            setError(err.response ? err.response.data.message : "Unable to cancel booking");
        }
    };

  // Automatically fetch bookings when the component loads
  useEffect(() => {
    fetchBookings();
  }, []); // Only run once on component mount

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-300 ml-[16%] ">
      <h1 className="text-2xl font-bold p-2 border-2 bg-gray-400 text-gray-800 border-black w-full text-center">
        Your Booking Details
      </h1>

      {/* Show error if any */}
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {/* Show success message after actions */}
      {message && <div className="text-green-600 mb-4">{message}</div>}
      {/* Show loading spinner */}
      {loading && <div className="text-blue-600">Loading...</div>}

      {/* Render booking details in a table */}
      {!loading && bookings.length > 0 && (
        <div className="relative flex flex-col w-full max-w-7xl bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  {[
                    "Car",
                    "Rental Period",
                    "Total Price",
                    "Pickup Location",
                    "Dropoff Location",
                    "Status",
                    "Actions",
                  ].map((head) => (
                    <th
                      key={head}
                      className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                    >
                      <div className="font-semibold text-sm text-blue-gray-700 leading-none">
                        {head}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, index) => {
                  const isLast = index === bookings.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr
                      key={booking._id}
                      className="hover:bg-blue-gray-50/50 transition-colors duration-200"
                    >
                      <td className={classes}>
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm text-blue-gray-900">
                            {booking.car.brand} {booking.car.model}
                          </span>
                          <span className="text-xs text-blue-gray-600">
                            {booking.car.regNumber}
                          </span>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="flex flex-col">
                          <span className="text-sm text-blue-gray-900">
                            {new Date(
                              booking.rentalStartDate
                            ).toLocaleDateString()}
                          </span>
                          <span className="text-sm text-blue-gray-900">
                            to{" "}
                            {new Date(
                              booking.rentalEndDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className={classes}>
                        <span className="font-medium text-sm text-emerald-600">
                          Rs. {booking.totalPrice}
                        </span>
                      </td>
                      <td className={classes}>
                        <span className="text-sm text-blue-gray-900">
                          {booking.rentalLocation.pickupLocation}
                        </span>
                      </td>
                      <td className={classes}>
                        <span className="text-sm text-blue-gray-900">
                          {booking.rentalLocation.dropoffLocation}
                        </span>
                      </td>
                      <td className={classes}>
                        <span
                          className={`
                                        inline-block px-3 py-1 rounded-full text-xs font-medium
                                        ${
                                          booking.status === "canceled"
                                            ? "bg-red-100 text-red-800"
                                            : booking.status === "booked"
                                            ? "bg-blue-100 text-blue-800"
                                            : "bg-green-100 text-green-800"
                                        }
                                    `}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className={classes}>
                        <div className="flex gap-2">
                          <button
                            onClick={() => deleteBooking(booking._id)}
                            className="px-4 py-2 text-xs font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => cancelBooking(booking._id)}
                            disabled={booking.status === "canceled"}
                            className={`
                                                px-4 py-2 text-xs font-medium text-white rounded-lg transition-all duration-200
                                                ${
                                                  booking.status === "canceled"
                                                    ? "bg-gray-300 cursor-not-allowed"
                                                    : "bg-yellow-500 hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                                                }
                                            `}
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
