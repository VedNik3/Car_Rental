import { useState } from "react";
import { API_END_POINT_CarOwner, API_END_POINT_admin } from "../../utils/constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const AddCar = () => {
  const userRole = useSelector((state) => state.app.user.role);

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    regNumber: "",
    type: "sedan",
    color: "",
    rentalPricePerDay: "",
    fuelType: "petrol",
    transmission: "manual",
    seats: "",
    status: "available",
    mileage: "",
    description: "",
    images: [""],
    currentLocation: "",
  });

  const [activeField, setActiveField] = useState(null);
  const [imageInputs, setImageInputs] = useState([""]);

  const navigate = useNavigate();


  const handleFileChange = (e) => {
    setFormData({ ...formData, images: Array.from(e.target.files) });
  };

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
    setImageInputs([...imageInputs, ""]);
    setFormData({ ...formData, images: [...formData.images, ""] });
  };

  const removeImageField = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setImageInputs(imageInputs.filter((_, i) => i !== index));
    setFormData({ ...formData, images: updatedImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.regNumber) {
      toast.error("Registration number is required");
      return;
    }

    const endpoint =
      userRole === "admin"
        ? `${API_END_POINT_admin}/addcar`
        : `${API_END_POINT_CarOwner}/addcar`;

        const formDataToSend = new FormData();
  Object.entries(formData).forEach(([key, value]) => {
    if (key === "images") {
      value.forEach((file) => formDataToSend.append("images", file));
    } else {
      formDataToSend.append(key, value);
    }
  });

  try {
    const res = await axios.post(endpoint, formDataToSend, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });


      toast.success("Car added successfully!");
      userRole === "carOwner" ? navigate("/carownerdash") : navigate("/admindash");
    } catch (error) {
      toast.error("Error adding car: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-7xl p-8  shadow-lg rounded-lg space-y-6 ml-[-44%]"
    >
      <h2 className="text-3xl font-semibold text-black text-center">Add a New Car</h2>

      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { name: "brand", label: "Brand" },
            { name: "model", label: "Model" },
            { name: "year", label: "Year", type: "number" },
            { name: "regNumber", label: "Registration Number" },
            { name: "color", label: "Color" },
            { name: "rentalPricePerDay", label: "Rental Price Per Day", type: "number" },
            { name: "seats", label: "Seats", type: "number" },
            { name: "mileage", label: "Mileage", type: "number" },
            { name: "currentLocation", label: "Current Location" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-black">{field.label}:</label>
              <input
                type={field.type || "text"}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                onFocus={() => setActiveField(field.name)}
                onBlur={() => setActiveField(null)}
                required={field.name === "regNumber"}
                className={`mt-1 p-3 block w-full font-medium  border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                  activeField === field.name ? "bg-gradient-to-b from-gray-700 to-gray-600 text-white" : "bg-gray-300 text-black"
                }`}
              />
            </div>
          ))}

          {/* Select Fields */}
          {[
            {
              name: "type",
              label: "Type",
              options: ["sedan", "suv", "hatchback"],
            },
            {
              name: "fuelType",
              label: "Fuel Type",
              options: ["petrol", "diesel", "electric"],
            },
            {
              name: "transmission",
              label: "Transmission",
              options: ["manual", "automatic"],
            },
            {
              name: "status",
              label: "Status",
              options: ["available", "booked", "maintenance"],
            },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-black">{field.label}:</label>
              <select
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                onFocus={() => setActiveField(field.name)}
                onBlur={() => setActiveField(null)}
                className={`mt-1 p-3 block w-full font-medium border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                  activeField === field.name ? "bg-gradient-to-b from-gray-500 to-gray-400 text-black" : "bg-gray-300 text-black"
                }`}
              >
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {/* Description Field */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-black">Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              onFocus={() => setActiveField("description")}
              onBlur={() => setActiveField(null)}
              className={`mt-1 p-3 block w-full text-white  border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                activeField === "description" ? "bg-gradient-to-b from-gray-700 to-gray-600" : "bg-gray-300"
              }`}
              rows="4"
            ></textarea>
          </div>      
    <div>
      <label>Upload Images</label>
      <input
        type="file"
        name="images"
        multiple // Allow multiple files
        onChange={handleFileChange}
      className="mt-1 block w-full text-white p-3 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-gray-300"
      />
    </div>
          
        </div>
      </div>

      <button
        type="submit"
        className="w-full px-6 py-3 mt-6 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition duration-200"
      >
        Add Car
      </button>
    </form>
  );
};

export default AddCar;
