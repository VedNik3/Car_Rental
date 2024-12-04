import React, { useState, useEffect } from "react";
import { API_END_POINT_CarOwner } from "../../utils/constants";
import { API_END_POINT } from "../../utils/constants";
import toast from "react-hot-toast";
import axios from "axios";

const OwnerBookingDetails = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // To show success message after actions

  // Function to fetch bookings after the car owner logs in
  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${API_END_POINT_CarOwner}/CarOwnerBookingDetails`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // to send cookies or session info
        }
      );
      setBookings(response.data.bookings);
    } catch (err) {
      setError(
        err.response
          ? err.response.data.message
          : "Unable to fetch bookings"
      );
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a booking
  const deleteBooking = async (bookingId) => {
    setMessage("");
    try {
      await axios.delete(
        `${API_END_POINT_CarOwner}/deletecarownerbooking/${bookingId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setBookings(bookings.filter((booking) => booking._id !== bookingId));
      toast.success("Booking deleted successfully.");
    } catch (err) {
      setError(
        err.response
          ? err.response.data.message
          : "Unable to delete booking"
      );
    }
  };

  // Function to cancel a booking
  const cancelBooking = async (bookingId) => {
    setMessage('');
    try {
      await axios.patch(`${API_END_POINT_CarOwner}/canceluserbooking/${bookingId}`, {
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
    <div className="flex flex-col items-center min-h-screen bg-gray-100 ml-[-45%]">
      <h1 className="text-3xl font-bold mb-4">Car Owner Booking Details</h1>

      {/* Show error if any */}
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {/* Show success message after actions */}
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
                <th className="py-2 px-4 border-b">Customer</th>
                <th className="py-2 px-4 border-b">Rental Period</th>
                <th className="py-2 px-4 border-b">Total Price</th>
                <th className="py-2 px-4 border-b">Pickup Location</th>
                <th className="py-2 px-4 border-b">Dropoff Location</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border">
                    {booking.car.brand} {booking.car.model} (
                    {booking.car.regNumber})
                  </td>
                  <td className="py-2 px-4 border">
                    {booking.user?.fullname} ({booking.user?.email})
                  </td>
                  <td className="py-2 px-4 border-b">
                    {new Date(booking.rentalStartDate).toLocaleDateString()} -{" "}
                    {new Date(booking.rentalEndDate).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border">
                    ₹{booking.totalPrice}
                  </td>
                  <td className="py-2 px-4 border">
                    {booking.rentalLocation.pickupLocation}
                  </td>
                  <td className="py-2 px-4 border">
                    {booking.rentalLocation.dropoffLocation}
                  </td>
                  {/* <td className="py-2 px-4 border-b">{booking.status}</td> */}
                  <td className="px-4 py-2 text-xs text-center border">
                    <span
                      className={`px-2 py-2 text-sm inline-block rounded-full border ${booking.status === "completed"
                        ? "text-green-600 border-green-600 bg-green-100"
                        : booking.status === "canceled"
                          ? "text-yellow-600 border-yellow-600 bg-yellow-100"
                          : "text-red-600 border-red-600 bg-red-100"
                        }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  {/* <td className="py-2 px-4 border-b flex">
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mr-2"
                      onClick={() => deleteBooking(booking._id)}
                    >
                      Delete
                    </button>
                    <button
                      className={`px-4 py-2 rounded ${booking.status === "canceled" || booking.status === "completed"
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-yellow-500 text-white hover:bg-yellow-600"
                        }`}
                      onClick={() =>
                        booking.status !== "canceled" && booking.status !== "completed" &&
                        cancelBooking(booking._id)
                      }
                      disabled={booking.status === "canceled" || booking.status === "completed"}
                    >
                      Cancel
                    </button>
                  </td> */}
                  <td className="pb-3 px-4 border-b space-x-2 flex mt-3">
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      onClick={() => deleteBooking(booking._id)}
                    >
                      Delete
                    </button>
                    <button
                      className={`px-4 py-2 rounded ${booking.status === "canceled" || booking.status === "completed"
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-yellow-500 text-white hover:bg-yellow-600"
                        }`}
                      onClick={() =>
                        booking.status !== "canceled" && booking.status !== "completed" &&
                        cancelBooking(booking._id)
                      }
                      disabled={booking.status === "canceled" || booking.status === "completed"}
                    >
                      Cancel
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
        <div>No bookings found for this car owner.</div>
      )}
    </div>
  );
};

export default OwnerBookingDetails;
