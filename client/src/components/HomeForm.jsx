import { useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  setLocation,
  setStartDateInStore,
  setDropDateInStore,
} from "../redux/carSlice";
import { MdOutlineCancel } from "react-icons/md";

const HomeForm = () => {
  const [duration, setDuration] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dropDate, setDropDate] = useState("");
  const [toggle, setToggle] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Calculate rental duration based on start and drop dates
  const calculateDuration = (startDate, dropDate) => {
    if (startDate && dropDate) {
      const startDateObj = new Date(startDate);
      const dropDateObj = new Date(dropDate);
      const diffInMs = dropDateObj - startDateObj;

      if (diffInMs >= 0) {
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        const diffInHours = Math.floor(
          (diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const diffInMinutes = Math.floor(
          (diffInMs % (1000 * 60 * 60)) / (1000 * 60)
        );

        return diffInDays > 0
          ? `${diffInDays} days and ${diffInMinutes} mins`
          : `${diffInHours} hrs and ${diffInMinutes} mins`;
      }
      return "Invalid duration";
    }
    return "";
  };

  const handleDateChange = (type, value) => {
    if (type === "start") {
      setStartDate(value);
      dispatch(setStartDateInStore(value));

      // Automatically set the drop date to the next day
      const nextDay = new Date(value);
      nextDay.setDate(nextDay.getDate() + 1); // Add one day
      const nextDayISO = nextDay.toISOString().slice(0, 16); // Convert to ISO format for input

      if (!dropDate || new Date(value) >= new Date(dropDate)) {
        setDropDate(nextDayISO);
        dispatch(setDropDateInStore(nextDayISO));
      }

      setDuration(calculateDuration(value, nextDayISO));
    } else {
      setDropDate(value);
      dispatch(setDropDateInStore(value));
      setDuration(calculateDuration(startDate, value));
    }
  };

  const handleBookNow = (event) => {
    event.preventDefault();
    navigate("/cards");
  };

  const handleLocationChange = (e) => {
    dispatch(setLocation(e.target.value));
  };

  const handleToggle = (e) => {
    setToggle(!toggle);
  };

  return (
    <>
      <Navbar toggle={toggle} setToggle={setToggle} />

      <div className="relative w-full h-screen bg-[url('https://wallpaperaccess.com/full/1838837.jpg')] bg-cover bg-center flex items-center">
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <h1 className="text-white text-4xl md:text-5xl font-bold relative ml-[10%] mb-[25%]">
          <span>Your Ideal Car,</span>
          <span className="block mt-4">Just a Click Away!</span>
        </h1>

        {/* Form */}
        {toggle && (
          <div className="relative z-10 border-2 border-white p-8 rounded-lg shadow-lg max-w-md w-full mt-11 ml-[25%] bg-transparent text-white">
            <h2 className="text-2xl font-bold text-center mb-6">Car Rental Form</h2>
            <form onSubmit={handleBookNow}>
              {/* Pickup Address */}
              <div className="mb-4">
                <label
                  className="block font-bold mb-2"
                  htmlFor="pickup-address"
                >
                  Pickup Address
                </label>
                <select
                  className="w-full p-1 border bg-transparent text-white border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="pickup-address"
                  defaultValue=""
                  onChange={handleLocationChange}
                  required
                >
                  <option value="" disabled>
                    Select Pickup City
                  </option>
                  {["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad", "Amravati"].map((city) => (
                    <option key={city} value={city} className="text-black">
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Date and Time */}
              <div className="mb-4">
                <label
                  className="block font-bold mb-2"
                  htmlFor="start-date-time"
                >
                  Start Date & Time
                </label>
                <input
                  className="w-full p-1 border bg-transparent border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="datetime-local"
                  id="start-date-time"
                  value={startDate}
                  min={new Date().toISOString().slice(0, 16)} // Restrict to current or future dates
                  onChange={(e) => handleDateChange("start", e.target.value)}
                  required
                />
              </div>

              {/* Drop-off Date and Time */}
              <div className="mb-4">
                <label
                  className="block font-bold mb-2"
                  htmlFor="drop-date-time"
                >
                  Drop-off Date & Time
                </label>
                <input
                  className="w-full p-1 border bg-transparent border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="datetime-local"
                  id="drop-date-time"
                  value={dropDate}
                  min={startDate || new Date().toISOString().slice(0, 16)} // Restrict to start date or current date
                  onChange={(e) => handleDateChange("drop", e.target.value)}
                  required
                />
              </div>

              {/* Duration */}
              <div className="mb-4">
                <label className="block font-bold mb-2">Duration:</label>
                <div>{duration || "Select start and drop-off times"}</div>
              </div>

              {/* Submit Button */}
              <button className="w-full bg-blue-500 text-white p-1.5 rounded hover:bg-blue-600 transition duration-300">
                Book Now
              </button>
              <button
                className="absolute top-2 right-2 text-2xl"
                onClick={handleToggle}
              >
                <MdOutlineCancel />
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default HomeForm;
