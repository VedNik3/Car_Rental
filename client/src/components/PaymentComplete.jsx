import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentComplete = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize navigate function

  // Retrieve formData from localStorage
  const formData = JSON.parse(localStorage.getItem("formData"));

  console.log(formData); // Log the form data

  const [bookingStatus, setBookingStatus] = useState({
    isCompleted: false,
    message: "Processing your booking...",
  });

  useEffect(() => {
    const completeBooking = async () => {
      if (!formData) {
        setBookingStatus({
          isCompleted: false,
          message: "Error: No booking data found.",
        });
        return;
      }

      try {
        const bookingResponse = await axios.post(
          `http://localhost:8000/api/booking/booked`, // API endpoint
          {
            ...formData,
            rentalLocation: {
              pickupLocation: formData.rentalLocation.pickupLocation,
              dropoffLocation: formData.rentalLocation.dropoffLocation,
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true, // Include credentials (cookies, headers) if needed
          }
        );

        // Log the booking response for debugging
        console.log("Booking response:", bookingResponse);

        setBookingStatus({
          isCompleted: true,
          message: "Booking Successful! Thank you for choosing us.",
        });
      } catch (error) {
        // Handle errors from the API
        console.error("Error during booking:", error);
        setBookingStatus({
          isCompleted: false,
          message:
            "Booking failed: " +
            (error.response?.data?.message || error.message),
        });
      }
    };

    // Only call completeBooking if formData is available
    if (formData) {
      completeBooking();
    }
  }, []);

  // Error case when formData is not found
  if (!formData) {
    return (
      <div className="p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-xl font-semibold text-red-500">
          Error: No booking data provided.
        </h1>
      </div>
    );
  }

  const handleSeeBooking = () => {
    // Redirect to "/userdash" when the button is clicked
    navigate("/userdash");
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg">
      {bookingStatus.isCompleted ? (
        <>
          <h1 className="text-2xl font-bold text-green-600 mb-4">
            {bookingStatus.message}
          </h1>

          <p>
            <strong>Total Price:</strong> Rs{" "}
            {formData.totalPrice * (new Date(formData.rentalEndDate)-new Date(formData.rentalStartDate))/(1000*60*60*24)}
          </p>

          <p>
            <strong>Pickup Location:</strong>{" "}
            {formData.rentalLocation.pickupLocation}
          </p>
          <p>
            <strong>Dropoff Location:</strong>{" "}
            {formData.rentalLocation.dropoffLocation}
          </p>
          {/* Button to redirect to user dashboard */}
          <button
            onClick={handleSeeBooking}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            See Booking
          </button>
        </>
      ) : (
        <h1 className="text-xl font-semibold text-gray-500">
          {bookingStatus.message}
        </h1>
      )}
    </div>
  );
};

export default PaymentComplete;
