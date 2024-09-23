import { useSelector } from "react-redux";
// import carSlice from "../redux/carSlice";

const SearchBar = () => {
  const location = useSelector((state) => state.car.location);
  const startDate = useSelector((state) => state.car.startDate);
  const dropDate = useSelector((state) => state.car.dropDate);
  return (
    <form className="max-w-[50%] mx-auto mt-24 border border-black p-2 rounded bg-yellow-100">
      <div className="grid grid-cols-4 gap-4">
        <select className="p-2 border rounded" aria-label={location}>
          <option value="">{location}</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Delhi">Delhi</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Chennai">Chennai</option>
          <option value="Kolkata">Kolkata</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Pune">Pune</option>
          <option value="Ahmedabad">Ahmedabad</option>
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

export default SearchBar;
