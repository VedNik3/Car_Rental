import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { setLocation } from "../../redux/carSlice";

const Modify = () => {
  const location = useSelector((state) => state.car.location);
  const startDate = useSelector((state) => state.car.startDate);
  const dropDate = useSelector((state) => state.car.dropDate);
  const dispatch = useDispatch();
  
  const [selectedLocation, setSelectedLocation] = useState(location);

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(setLocation(selectedLocation));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl ml-48 mt-24  border border-black p-2 rounded ">
      <div className="grid grid-cols-4 gap-4">
        <select
          className="p-2 border rounded"
          value={selectedLocation}
          onChange={handleLocationChange}
        >
          <option value="" disabled>Select a location</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Delhi">Delhi</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Chennai">Chennai</option>
          <option value="Kolkata">Kolkata</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Pune">Pune</option>
          <option value="Ahmedabad">Ahmedabad</option>
          <option value="Amravati">Amravati</option>
          <option value="Dhule">Dhule</option>
        </select>

        <input
          type="datetime-local"
          className="p-2 border rounded"
          placeholder="Start Date"
          value={startDate}
        />

        <input
          type="datetime-local"
          className="p-2 border rounded"
          placeholder="End Date"
          value={dropDate}
        />

        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Modify
        </button>
      </div>
    </form>
  );
};

export default Modify;
