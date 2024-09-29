import { useState } from "react";
import { API_END_POINT_CarOwner } from "../../utils/constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AddCar = () => {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    regNumber: "",
    type: "sedan",
    color: "",
    rentalPricePerDay: "",
    fuelType: "",
    transmission: "manual",
    seats: "",
    status: "available",
    mileage: "",
    description: "",
    images: [""],
    currentLocation: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData({ ...formData, images: updatedImages });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ""] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the registration number is filled
  if (!formData.regNumber) {
    toast.error("Registration number is required");
    return;
  }

    try {
      const res = await axios.post(
        `${API_END_POINT_CarOwner}/addcar`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      // if (res.data.success) {
        // Show success message
        toast.success("Car added successfully!");
        // toast.success(res.data.message);
console.log(res.data.message);
        // Navigate back to the car list or home
        navigate("/Ownerdashboard");
      // }
    } catch (error) {
    //   Handle the error
      toast.error("Error adding car: " + error.response?.data?.message || error.message);
    // toast.error(
    //     "Error adding car: " +
    //     error.response?.data?.message || error.message
    // );
    }
  };

  return (
    <form
    onSubmit={handleSubmit}
    className="max-w-2xl mx-auto p-6 bg-blue-400 shadow-md rounded-md space-y-6 ml-[-10%]"
  >
    <h2 className="text-2xl font-semibold text-gray-700">Add a New Car</h2>

    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Brand:</label>
        <input
          type="text"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          required
          className="mt-1 p-2 block w-full border-black rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Model:</label>
        <input
          type="text"
          name="model"
          value={formData.model}
          onChange={handleChange}
          required
          className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Year:</label>
        <input
          type="number"
          name="year"
          value={formData.year}
          onChange={handleChange}
          required
          className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Registration Number:</label>
        <input
          type="text"
          name="regNumber"
          value={formData.regNumber}
          onChange={handleChange}
          required
          className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Type:</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="sedan">Sedan</option>
          <option value="suv">SUV</option>
          <option value="hatchback">Hatchback</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Color:</label>
        <input
          type="text"
          name="color"
          value={formData.color}
          onChange={handleChange}
          required
          className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Rental Price Per Day:</label>
        <input
          type="number"
          name="rentalPricePerDay"
          value={formData.rentalPricePerDay}
          onChange={handleChange}
          required
          className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Fuel Type:</label>
        <input
          type="text"
          name="fuelType"
          value={formData.fuelType}
          onChange={handleChange}
          required
          className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Transmission:</label>
        <select
          name="transmission"
          value={formData.transmission}
          onChange={handleChange}
          required
          className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="manual">Manual</option>
          <option value="automatic">Automatic</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Seats:</label>
        <input
          type="number"
          name="seats"
          value={formData.seats}
          onChange={handleChange}
          required
          className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Status:</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="available">Available</option>
          <option value="booked">Booked</option>
          <option value="in service">In Service</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Mileage:</label>
        <input
          type="number"
          name="mileage"
          value={formData.mileage}
          onChange={handleChange}
          required
          className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Current Location:</label>
        <input
          type="text"
          name="currentLocation"
          value={formData.currentLocation}
          onChange={handleChange}
          required
          className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Images (URLs):</label>
        {formData.images.map((image, index) => (
          <input
            key={index}
            type="text"
            value={image}
            onChange={(e) => handleImageChange(index, e.target.value)}
            className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        ))}
        <button
          type="button"
          onClick={addImageField}
          className="mt-2 bg-indigo-500 text-white px-3 py-1 rounded-md shadow-md hover:bg-indigo-600"
        >
          Add More Images
        </button>
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
      >
        Submit
      </button>
    </div>
  </form>
  );
};

export default AddCar;