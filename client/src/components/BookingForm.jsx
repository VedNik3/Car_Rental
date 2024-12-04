import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { setFormData } from "../redux/bookingSlice";
import CarImageSlider from "./CarImageSlider";

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
      <div className="w-full mx-auto p-8 bg-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300">
  <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-2 border-b">
     Car Details
  </h2>

  {/* Car Image Slider */}
  <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
    <CarImageSlider
      car={car}
      height="400px"
    />
  </div>

  {/* Details Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Specifications Card */}
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
      <h3 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
        Specifications
      </h3>
      <div className="">
        <div className="flex items-center justify-between  border-b border-gray-100">
          <span className="text-gray-600">Brand</span>
          <span className="font-semibold text-gray-800">{car.brand}</span>
        </div>
        <div className="flex items-center justify-between border-b border-gray-100">
          <span className="text-gray-600">Model</span>
          <span className="font-semibold text-gray-800">{car.model} {car.year}</span>
        </div>
        <div className="flex items-center justify-between border-b border-gray-100">
          <span className="text-gray-600">Registration</span>
          <span className="font-semibold text-gray-800">{car.regNumber}</span>
        </div>
        <div className="flex items-center justify-between  border-b border-gray-100">
          <span className="text-gray-600">Type</span>
          <span className="font-semibold text-gray-800">{car.type}</span>
        </div>
        <div className="flex items-center justify-between  border-b border-gray-100">
          <span className="text-gray-600">Color</span>
          <span className="font-semibold text-gray-800">{car.color}</span>
        </div>
        <div className="flex items-center justify-between  border-b border-gray-100">
          <span className="text-gray-600">Transmission</span>
          <span className="font-semibold text-gray-800">{car.transmission}</span>
        </div>
        <div className="flex items-center justify-between  border-b border-gray-100">
          <span className="text-gray-600">Seats</span>
          <span className="font-semibold text-gray-800">{car.seats}</span>
        </div>
        <div className="flex items-center justify-between  border-b border-gray-100">
          <span className="text-gray-600">Mileage</span>
          <span className="font-semibold text-gray-800">{car.mileage} km/l</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Price per hour</span>
          <span className="text-lg font-bold text-blue-600">₹{car.rentalPricePerDay}</span>
        </div>
      </div>
    </div>

    {/* Description Card */}
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
      <h3 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
        Description
      </h3>
      <p className="text-gray-600 leading-relaxed">
        {car.description}
      </p>
    </div>
  </div>
</div>

      <div className="w-full mx-auto p-8 bg-white rounded-2xl shadow-2xl  transform hover:shadow-3xl transition-all duration-300">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b">
          🚗 Booking Form
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Registration Number
            </label>
            <input
              type="text"
              name="regNumber"
              readOnly
              value={formData.regNumber}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Rental Start Date
            </label>
            <input
              type="datetime-local"
              name="rentalStartDate"
              value={formData.rentalStartDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Rental End Date
            </label>
            <input
              type="datetime-local"
              name="rentalEndDate"
              value={formData.rentalEndDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Total Price
            </label>
            <input
              type="number"
              readOnly
              value={Math.floor(
                formData.totalPrice *
                durationFunc(formData.rentalStartDate, formData.rentalEndDate)
              )}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-semibold text-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Pickup Location
            </label>
            <input
              type="text"
              value={formData.rentalLocation.pickupLocation}
              onChange={(e) => handleLocationChange(e, "pickupLocation")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter pickup location"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Dropoff Location
            </label>
            <input
              type="text"
              value={formData.rentalLocation.dropoffLocation}
              onChange={(e) => handleLocationChange(e, "dropoffLocation")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter dropoff location"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold
                 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
                 focus:ring-offset-2 transform hover:scale-[1.02] 
                 transition-all duration-200 mt-8"
          >
            Pay Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
