import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { setFormData } from "../redux/bookingSlice";

const BookingForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { car } = location.state || {};

  console.log("BookingForm");
  

  const StartDate = useSelector((state) => state.car.startDate);
  const DropDate = useSelector((state) => state.car.dropDate);

  const [formData, setFormData] = useState({
    regNumber: car?.regNumber || '',
    rentalStartDate: StartDate || '', 
    rentalEndDate: DropDate || '',     
    totalPrice: car?.rentalPricePerDay || 0,
    paymentStatus: 'pending',
    paymentMethod: 'credit_card',
    transactionId: '',
    rentalLocation: {
      pickupLocation: '',
      dropoffLocation: ''
    },
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLocationChange = (e, field) => {
    const { value } = e.target;
    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        rentalLocation: {
          ...prevData.rentalLocation,
          [field]: value,
        },
      };
      localStorage.setItem("formData", JSON.stringify(updatedData)); // Save formData to localStorage
      return updatedData;
    });
  };

 // Calculate the duration in hours and total price
 const durationFunc = (start, end) => {
  const diffInMs = new Date(end) - new Date(start);
  return diffInMs / (1000 * 60 * 60 * 24);
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const duration = durationFunc(formData.rentalStartDate, formData.rentalEndDate);
      const totalPrice = formData.totalPrice * duration;

      const response = await axios.post("http://localhost:8000/checkout", {
        carName: car?.model,
        totalPrice: totalPrice,
      });

      // Redirect to Stripe payment page
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Error:", error);
      alert(
        "Payment initiation failed: " +
          (error.response?.data?.message || error.message || "Unknown error")
      );
    }
  };

  if (!car) return <p>No car selected for booking.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-3">Car Details</h2>
        <img
          src={car.images}
          alt={car.model}
          className="w-72 h-48 object-cover rounded-lg mb-4"
        />
        <p><strong>Model:</strong> {car.model}</p>
        <p><strong>Price per hour:</strong> Rs {car.rentalPricePerDay}</p>
        <p><strong>Status:</strong> {car.status}</p>
      </div>

      <div className="p-4 bg-white rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold">Booking Form</h2>
        <form onSubmit={handleSubmit}>
          <label>Registration Number</label>
          <input
            type="text"
            name="regNumber"
            readOnly
            value={formData.regNumber}
            className="w-full mb-4"
          />

          <label>Rental Start Date</label>
          <input
            type="datetime-local"
            name="rentalStartDate"
            value={formData.rentalStartDate}
            onChange={handleChange}
            className="w-full mb-4"
          />

          <label>Rental End Date</label>
          <input
            type="datetime-local"
            name="rentalEndDate"
            value={formData.rentalEndDate}
            onChange={handleChange}
            className="w-full mb-4"
          />

          <label>Total Price</label>
          <input
            type="number"
            readOnly
            value={
              Math.floor(
                formData.totalPrice *
                durationFunc(formData.rentalStartDate, formData.rentalEndDate)
              )
            }
            
            className="w-full mb-4"
          />

          <label>Pickup Location</label>
          <input
            type="text"
            value={formData.rentalLocation.pickupLocation}
            onChange={(e) => handleLocationChange(e, "pickupLocation")}
            className="w-full mb-4"
          />

          <label>Dropoff Location</label>
          <input
            type="text"
            value={formData.rentalLocation.dropoffLocation}
            onChange={(e) => handleLocationChange(e, "dropoffLocation")}
            className="w-full mb-4"
          />

          <button type="submit" className="w-full bg-blue-500 text-white py-2">
            Pay Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
