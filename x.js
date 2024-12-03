//on payment completion, booking should happen


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


/////////////////////////////////////////////////////////////////
// payment complete Component



import { useState, useEffect, Component } from "react";

const PaymentComplete = ({ formData, setFormData }) => {
  const [isCompleted, setIsCompleted] = useState(false);

  // Log formData to check if it's passed properly
  console.log("---->", formData);

  useEffect(() => {
    if (formData) { // Check if formData exists before accessing it
      // Simulate a delay (e.g., waiting for payment confirmation)
      setTimeout(() => {
        setIsCompleted(true);
        handleBooking(); // Trigger the booking process once payment is complete
      }, 500); // Adjust the time as needed for the animation
    }
  }, [formData]); // Ensure the effect runs when formData is available

  const handleBooking = async () => {
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

  return (
    <div className="payment-complete-container">
      <div className={`tick-container ${isCompleted ? 'show' : ''}`}>
        <svg
          className="checkmark"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="100px"
          height="100px"
        >
          <circle className="circle" cx="12" cy="12" r="10" />
          <path
            className="check-path"
            fill="none"
            stroke="green"
            strokeWidth="2"
            d="M7 12l5 5L17 8"
          />
        </svg>
      </div>
      {isCompleted && <p className="success-message">Payment Successful!</p>}
    </div>
  );
};


export default PaymentComplete;


/////////////////////////// OLD bookingForm.jsx
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
        ${API_END_POINT_booking}/booked,
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


////////////////////////////////////import { useSelector } from "react-redux";
import mainLogo from "../assets/mainLogo.png";
import { useNavigate } from "react-router";
import Dropdown from "./Admin Dash/DropDown";

const Sidebar = ({ setcliCkedOwnerOption, setClickedUserOption }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.app.user);
  const userRole = user?.role;

  const handleLogoClick = () => {
    navigate("/");
  };

  // Dropdown data for different sections based on user role
  const carsDropdownItems = [
    { label: "Add New Car" },
    { label: "View All Cars" },
    { label: "Update/Delete Cars" },
  ];

  const usersDropdownItems = [
    { label: "View All Users" },
    { label: "Change User Role" },
    { label: "View Car Owners" },
    { label: "Get User" },
    { label: "Delete User" },
  ];

  const bookingsDropdownItems = [
    { label: "View All Bookings" },
    { label: "Add/Delete Bookings" },
  ];

  const profileDropdownItems = [
    { label: "View Profile" },
    { label: "Edit Profile" },
  ];

  const revenueDropdownItems = [
    { label: "View Admin Revenue" },
    { label: "View Car Owners' Revenue" },
  ];

  return (
    <div className="flex fixed top-0 left-0 z-9">
      <div className="flex flex-col p-4 bg-gray-900 text-white w-60 min-h-screen">
        <img
          onClick={handleLogoClick}
          alt="Your Company"
          src={mainLogo}
          className="h-10 cursor-pointer"
        />

        <hr className="border-gray-700 mb-4" />
        <ul className="flex flex-col space-y-2">
          {/* Dashboard */}
          <li>
            <div
              className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
              onClick={() =>
                userRole === "carOwner"
                  ? setcliCkedOwnerOption("dashboard")
                  : setClickedUserOption("dashboard")
              }
            >
              <span className="text-base">
                {userRole === "admin"
                  ? "Dashboard (Admin)"
                  : userRole === "carOwner"
                  ? "Dashboard (Owner)"
                  : "Dashboard (User)"}
              </span>
            </div>
          </li>

          {/* Cars Management (for Admin only) */}
          {userRole === "admin" ? (
            <Dropdown title="Cars Management" items={carsDropdownItems} />
          ) : userRole === "carOwner" ? (
            <li>
              <div
                className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                onClick={() => setcliCkedOwnerOption("addcar")}
              >
                <span className="text-base">Add Car</span>
              </div>
            </li>
          ) : (
            <li>
              <div
                className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                onClick={() => setClickedUserOption("profile")}
              >
                <span className="text-base">Profile</span>
              </div>
            </li>
          )}

          {/* Users Management (for Admin only) */}
          {userRole === "admin" ? (
            <Dropdown title="Users Management" items={usersDropdownItems} />
          ) : userRole === "carOwner" ? (
            <li>
              <div
                className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                onClick={() => setcliCkedOwnerOption("ownedcars")}
              >
                <span className="text-base">Owned Cars</span>
              </div>
            </li>
          ) : (
            <li>
              <div
                className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                onClick={() => setClickedUserOption("booking")}
              >
                <span className="text-base">User Bookings</span>
              </div>
            </li>
          )}

          {/* Bookings Management (for Admin only) */}
          {userRole === "admin" ? (
            <Dropdown title="Bookings Management" items={bookingsDropdownItems} />
          ) : userRole === "carOwner" ? (
            <li>
              <div
                className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                onClick={() => setcliCkedOwnerOption("OwnerBookingDetails")}
              >
                <span className="text-base">Bookings</span>
              </div>
            </li>
          ) : (
            <li>
              <div className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                <span className="text-base">Home</span>
              </div>
            </li>
          )}

          {/* Settings (for Admin only) */}
          {userRole === "admin" ? (
            <Dropdown title="Settings" items={bookingsDropdownItems} />
          ) : userRole === "carOwner" ? (
            <li>
              <div
                className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                onClick={() => setcliCkedOwnerOption("Deletecarowner")}
              >
                <span className="text-base">Settings</span>
              </div>
            </li>
          ) : (
            <li>
              <div className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                <span className="text-base">Home</span>
              </div>
            </li>
          )}

          {/* Profile Management (common for all roles) */}
          <Dropdown title="Profile" items={profileDropdownItems} />

          {/* Revenue Analytics (for Admin only) */}
          {userRole === "admin" ? (
            <Dropdown title="Revenue Analytics" items={revenueDropdownItems} />
          ) : userRole === "carOwner" ? (
            <li>
              <div className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                <span className="text-base">Home (Car Owner)</span>
              </div>
            </li>
          ) : (
            <li>
              <div className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                <span className="text-base">Home</span>
              </div>
            </li>
          )}
        </ul>

        <hr className="border-gray-700 my-4" />
        <div className="mt-auto">
          <div className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
            <span className="text-base">Log Out</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
