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
//   useEffect(() => {
//     const fetchCars = async () => {
//       try {
//         const response = await axios.get(
//           `${API_END_POINT_CarOwner}/getAllOwnedCars`,
//           {
//             headers: {
//               "Content-Type": "application/json",
//             },
//             withCredentials: true,
//           }
//         );

//         setCars(response.data.cars);
//       } catch (error) {
//         console.error("Error fetching cars:", error);
//         setMessage("Error fetching cars. Please try again later.");
//       }
//     };

//     fetchCars();
//   }, []);

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
//   const handleEditCar = (car) => {
//     setEditCar(car._id);
//     setEditForm({
//       brand: car.brand,
//       model: car.model,
//       year: car.year,
//       type: car.type,
//       color: car.color,
//       seats: car.seats,
//       mileage: car.mileage,
//       rentalPricePerDay: car.rentalPricePerDay,
//       status: car.status, // Include the current status in the edit form
//     });
//   };

  // Function to save the edited car details
//   const handleSaveEdit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.put(
//         `${API_END_POINT_CarOwner}/editcar/${editCar}`,
//         editForm,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//           withCredentials: true,
//         }
//       );

//       if (response.status === 200) {
//         toast.success("Car details updated successfully!");
//         setCars(
//           cars.map((car) =>
//             car._id === editCar ? { ...car, ...editForm } : car
//           )
//         );
//         setEditCar(null);
//       }
//     } catch (error) {
//       console.error("Error saving car details:", error);
//       toast.error("Error saving car details. Please try again later.");
//     }
//   };

  return (
    <div className="ml-[-40%] p-6">
      {/* Form to delete a car by registration number */}
      <div className="mt-48 bg-gray-100 p-6 rounded-lg shadow-lg">
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
