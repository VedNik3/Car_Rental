import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios'; // Import Axios
import { useSelector } from 'react-redux';
import { API_END_POINT_booking } from '../utils/constants';

const BookingForm = () => {
  const location = useLocation();
  const { car } = location.state || {};

  const StartDate = useSelector(state => state.car.startDate);
  const DropDate = useSelector(state => state.car.dropDate);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
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
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      console.log('Booking Response:', response.data);
      alert('Booking Successful!');
    } catch (error) {
      console.error('Error:', error);
      alert('Booking failed: ' + (error.response?.data?.message || error.message));
    }
  };

  if (!car) return <p>No car selected for booking.</p>; // Handle case where no car is passed

  // Calculate the duration in hours and total price
    const durationFunc = (start, end) => {
      const diffInMs = new Date(end) - new Date(start);
      return diffInMs / (1000 * 60 * 60);
    };
  

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {/* Car Details Section */}
      <div className="p-6 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl">
        <h2 className="text-2xl font-bold text-blue-600 mb-3">Car Details</h2>
        <img 
          src={car.images} 
          alt={car.model} 
          className="w-72 h-48 object-cover rounded-lg mb-4 border border-gray-300 shadow-sm" 
        />
        <p className="text-lg text-gray-800 mb-1">
          <strong className="font-semibold">Model:</strong> {car.model}
        </p>
        <p className="text-lg text-gray-800 mb-1">
          <strong className="font-semibold">Price per hour:</strong> Rs {car.rentalPricePerDay}
        </p>
        <p className="text-lg text-gray-800 mb-1">
          <strong className="font-semibold">Status:</strong> {car.status}
        </p>
      </div>

      {/* Booking Form Section */}
      <div className="p-4 bg-white rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold">Booking Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="regNumber" className="block text-sm font-medium text-gray-700">Registration Number</label>
            <input
              type="text"
              id="regNumber"
              name="regNumber"
              readOnly
              value={formData.regNumber}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="rentalStartDate" className="block text-sm font-medium text-gray-700">Rental Start Date</label>
            <input
              type="datetime-local"
              id="rentalStartDate"
              name="rentalStartDate"
              value={formData.rentalStartDate}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="rentalEndDate" className="block text-sm font-medium text-gray-700">Rental End Date</label>
            <input
              type="datetime-local"
              id="rentalEndDate"
              name="rentalEndDate"
              value={formData.rentalEndDate}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="totalPrice" className="block text-sm font-medium text-gray-700">Total Price</label>
            <input
              type="number"
              id="totalPrice"
              name="totalPrice"
              value={formData.totalPrice * durationFunc(formData.rentalStartDate, formData.rentalEndDate)}
              readOnly
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">Payment Method</label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="credit_card">Credit Card</option>
              <option value="debit_card">Debit Card</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700">Transaction ID</label>
            <input
              type="text"
              id="transactionId"
              name="transactionId"
              value={formData.transactionId}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700">Pickup Location</label>
            <input
              type="text"
              id="pickupLocation"
              name="pickupLocation"
              value={formData.rentalLocation.pickupLocation}
              onChange={(e) => handleChange({
                target: { name: 'rentalLocation', value: { ...formData.rentalLocation, pickupLocation: e.target.value } }
              })}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="dropoffLocation" className="block text-sm font-medium text-gray-700">Dropoff Location</label>
            <input
              type="text"
              id="dropoffLocation"
              name="dropoffLocation"
              value={formData.rentalLocation.dropoffLocation}
              onChange={(e) => handleChange({
                target: { name: 'rentalLocation', value: { ...formData.rentalLocation, dropoffLocation: e.target.value } }
              })}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Book Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
