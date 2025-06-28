import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { API_END_POINT_booking } from "../utils/constants";

const PaymentComplete = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const formData = JSON.parse(localStorage.getItem("formData"));
  const [bookingStatus, setBookingStatus] = useState({
    isCompleted: false,
    message: "Processing your booking...",
  });

  // Use a ref to prevent multiple API calls
  const bookingCalled = useRef(false);

  useEffect(() => {
    const completeBooking = async () => {
      if (!formData || bookingCalled.current) return;

      // Mark the booking process as started
      bookingCalled.current = true;

      try {
        const bookingResponse = await axios.post(
          `${API_END_POINT_booking}/booked`,
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
            withCredentials: true,
          }
        );

        console.log("Booking response:", bookingResponse);

        setBookingStatus({
          isCompleted: true,
          message: "Booking Successful! Thank you for choosing us.",
        });
      } catch (error) {
        console.error("Error during booking:", error);
        setBookingStatus({
          isCompleted: false,
          message:
            "Booking failed: " +
            (error.response?.data?.message || error.message),
        });
      }
    };

    // Call the function only once
    completeBooking();
  }, [formData]);

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
            {formData.totalPrice *
              (new Date(formData.rentalEndDate) -
                new Date(formData.rentalStartDate)) /
              (1000 * 60 * 60 * 24)}
          </p>
          <p>
            <strong>Pickup Location:</strong>{" "}
            {formData.rentalLocation.pickupLocation}
          </p>
          <p>
            <strong>Dropoff Location:</strong>{" "}
            {formData.rentalLocation.dropoffLocation}
          </p>
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
