import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { API_END_POINT_CarOwner } from "../../utils/constants";
import axios from "axios";
import CarImageSlider from "../CarImageSlider";

const OwnedCars = () => {
  const [cars, setCars] = useState([]);
  const [message, setMessage] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [editCar, setEditCar] = useState(null); // Store the car being edited
  const [editForm, setEditForm] = useState({}); // Store the form values for editing

  // Fetch cars when the component mounts
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get(
          `${API_END_POINT_CarOwner}/getAllOwnedCars`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        setCars(response.data.cars);
      } catch (error) {
        console.error("Error fetching cars:", error);
        setMessage("Error fetching cars. Please try again later.");
      }
    };

    fetchCars();
  }, []);

  // Function to handle car deletion
  const handleDeleteCar = async (e) => {
    e.preventDefault();

    if (!regNumber) {
      setDeleteMessage("Please enter a registration number.");
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
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.success("Car deleted successfully");
        // Refetch cars after deletion
        setCars(cars.filter((car) => car.regNumber !== regNumber));
      } else {
        setDeleteMessage("Failed to delete the car. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting the car:", error);
      setDeleteMessage("Error deleting the car. Please try again later.");
    }

    setRegNumber(""); // Clear the input field after submission
  };

  // Function to start editing a car
  const handleEditCar = (car) => {
    setEditCar(car._id);
    setEditForm({
      brand: car.brand,
      model: car.model,
      year: car.year,
      type: car.type,
      color: car.color,
      seats: car.seats,
      mileage: car.mileage,
      rentalPricePerDay: car.rentalPricePerDay,
      status: car.status, // Include the current status in the edit form
    });
  };

  // Function to save the edited car details
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${API_END_POINT_CarOwner}/editcar/${editCar}`,
        editForm,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("Car details updated successfully!");
        setCars(
          cars.map((car) =>
            car._id === editCar ? { ...car, ...editForm } : car
          )
        );
        setEditCar(null);
      }
    } catch (error) {
      console.error("Error saving car details:", error);
      toast.error("Error saving car details. Please try again later.");
    }
  };

  return (
    <div className="ml-[-40%] p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Owned Cars</h1>
      {message && <p className="text-red-500 text-center mb-4">{message}</p>}

      {cars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div
              key={car._id}
              className="bg-gradient-to-b from-gray-300 to-gray-100 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
            >
              {/* <div className="h-40"> */}

              <CarImageSlider car={car} height="176px"/>
              {/* </div> */}

              <h2 className="text-xl font-semibold text-gray-800">
                {car.brand} {car.model}
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Registration Number:</strong> {car.regNumber}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <strong>Year:</strong> {car.year}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <strong>Type:</strong> {car.type}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <strong>Color:</strong> {car.color}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <strong>Seats:</strong> {car.seats}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <strong>Mileage:</strong> {car.mileage}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <strong>Fule:</strong> {car.fuelType}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <strong>Rental Price Per Day:</strong> ₹{car.rentalPricePerDay}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <strong>Status:</strong> {car.status}
              </p>

              {/* Edit button */}
              <button
                className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600"
                onClick={() => handleEditCar(car)}
              >
                Edit
              </button>

              {/* Show edit form if this car is being edited */}
              {editCar === car._id && (
                <form
                  onSubmit={handleSaveEdit}
                  className="mt-4 p-4 border-t border-gray-300"
                >
                  <div className="space-y-2">
                    <input
                      type="text"
                      className="w-full border rounded p-2"
                      placeholder="Brand"
                      value={editForm.brand}
                      onChange={(e) =>
                        setEditForm({ ...editForm, brand: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      className="w-full border rounded p-2"
                      placeholder="Model"
                      value={editForm.model}
                      onChange={(e) =>
                        setEditForm({ ...editForm, model: e.target.value })
                      }
                    />
                    <input
                      type="number"
                      className="w-full border rounded p-2"
                      placeholder="Year"
                      value={editForm.year}
                      onChange={(e) =>
                        setEditForm({ ...editForm, year: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      className="w-full border rounded p-2"
                      placeholder="Type"
                      value={editForm.type}
                      onChange={(e) =>
                        setEditForm({ ...editForm, type: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      className="w-full border rounded p-2"
                      placeholder="Color"
                      value={editForm.color}
                      onChange={(e) =>
                        setEditForm({ ...editForm, color: e.target.value })
                      }
                    />
                    <input
                      type="number"
                      className="w-full border rounded p-2"
                      placeholder="Seats"
                      value={editForm.seats}
                      onChange={(e) =>
                        setEditForm({ ...editForm, seats: e.target.value })
                      }
                    />
                    <input
                      type="number"
                      className="w-full border rounded p-2"
                      placeholder="Mileage"
                      value={editForm.mileage}
                      onChange={(e) =>
                        setEditForm({ ...editForm, mileage: e.target.value })
                      }
                    />
                    <input
                      type="number"
                      className="w-full border rounded p-2"
                      placeholder="Rental Price Per Day"
                      value={editForm.rentalPricePerDay}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          rentalPricePerDay: e.target.value,
                        })
                      }
                    />
                    {/* Status Dropdown */}
                    <select
                      className="w-full border rounded p-2"
                      value={editForm.status}
                      onChange={(e) =>
                        setEditForm({ ...editForm, status: e.target.value })
                      }
                    >
                      <option value="available">Available</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="booked">Booked</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 mt-4 rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 mt-4">No cars found.</p>
      )}

      {/* Form to delete a car by registration number */}
      <div className="mt-8 bg-gray-100 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center">Delete a Car</h2>
        <form onSubmit={handleDeleteCar} className="space-y-4">
          <div>
            <label
              htmlFor="regNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Car Registration Number:
            </label>
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
          <button
            type="submit"
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded w-full"
          >
            Delete Car
          </button>
        </form>
        {deleteMessage && (
          <p className="text-red-500 mt-4 text-center">{deleteMessage}</p>
        )}
      </div>
    </div>
  );
};

export default OwnedCars;
