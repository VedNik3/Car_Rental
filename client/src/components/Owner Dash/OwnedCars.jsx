import React, { useEffect, useState } from 'react';
import toast from "react-hot-toast";
import { API_END_POINT_CarOwner } from "../../utils/constants";
import axios from 'axios';

const OwnedCars = () => {
  const [cars, setCars] = useState([]);
  const [message, setMessage] = useState('');
  const [regNumber, setRegNumber] = useState(''); // State for regNumber input
  const [deleteMessage, setDeleteMessage] = useState(''); // State for delete success/error message

  // Fetch cars when the component mounts
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get(`${API_END_POINT_CarOwner}/getAllOwnedCars`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // to send cookies or session info
        });
    
        
        setCars(response.data.cars);
      } catch (error) {
        console.error('Error fetching cars:', error);
        setMessage('Error fetching cars. Please try again later.');
      }
    };

    fetchCars();
  }, []);

  // Function to handle car deletion
  const handleDeleteCar = async (e) => {
    e.preventDefault();

    if (!regNumber) {
      setDeleteMessage('Please enter a registration number.');
      return;
    }

    try {
      const response = await axios.delete(`${API_END_POINT_CarOwner}/deletecar`, {
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          regNumber: regNumber,
        },
        withCredentials: true, // to send cookies or session info
      });

      if (response.status === 200) {
        // setDeleteMessage('Car deleted successfully.');
        toast.success("Car deleted successfully");
        // Refetch cars after deletion
        setCars(cars.filter(car => car.regNumber !== regNumber));
      } else {
        setDeleteMessage('Failed to delete the car. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting the car:', error);
      setDeleteMessage('Error deleting the car. Please try again later.');
    }

    setRegNumber(''); // Clear the input field after submission
  };

  return (
    <div className="ml-[-40%]">
      <h1 className="text-2xl font-bold mb-4">Owned Cars</h1>
      {message && <p className="text-red-500">{message}</p>}
      {cars.length > 0 ? (
        <ul>
          {cars.map((car) => (
            <li key={car._id} className="mb-4 border border-gray-300 p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">{car.brand} {car.model}</h2>
              <p><strong>Registration Number:</strong> {car.regNumber}</p>
              <p><strong>Year:</strong> {car.year}</p>
              <p><strong>Type:</strong> {car.type}</p>
              <p><strong>Color:</strong> {car.color}</p>
              <p><strong>Rental Price Per Day:</strong> ₹{car.rentalPricePerDay}</p>
              <p><strong>Status:</strong> {car.status}</p>
              <img src={car.images[0]} alt={`${car.brand} ${car.model}`} className="w-48 h-auto mt-2" />
            </li>
          ))}
        </ul>
      ) : (
        <p>No cars found.</p>
      )}

      {/* Form to delete a car by registration number */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Delete a Car</h2>
        <form onSubmit={handleDeleteCar} className="space-y-4">
          <div>
            <label htmlFor="regNumber" className="block text-sm font-medium text-gray-700">Car Registration Number:</label>
            <input
              type="text"
              id="regNumber"
              value={regNumber}
              onChange={(e) => setRegNumber(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter registration number"
              required
            />
          </div>
          <button type="submit" className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded">
            Delete Car
          </button>
        </form>
        {deleteMessage && <p className="text-red-500 mt-4">{deleteMessage}</p>}
      </div>
    </div>
  );
};

export default OwnedCars;