import React, { useEffect, useState } from "react";
import axios from "axios";

const GetAllCars = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/admin/getallcars", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        setCars(res.data);
        setFilteredCars(res.data); // Initialize filteredCars with all cars
      } catch (error) {
        console.error("Error fetching cars", error);
        setError("Failed to fetch cars");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = cars.filter(
      (car) =>
        car.model.toLowerCase().includes(query) ||
        car.brand.toLowerCase().includes(query) ||
        car.regNumber.toLowerCase().includes(query) ||
        car.type.toLowerCase().includes(query) ||
        car.color.toLowerCase().includes(query) ||
        car.fuelType.toLowerCase().includes(query)
    );
    setFilteredCars(filtered);
  };

  if (loading) {
    return <p className="text-center">Loading cars...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto ml-[-35%] p-6">
      <h2 className="text-3xl font-extrabold text-white text-center mb-8">
        All Cars
      </h2>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search cars..."
          className="w-full p-3 rounded-md bg-gray-100 text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Cars Table */}
      <div className="overflow-x-auto shadow-lg ">
        <table className="min-w-full bg-white border-collapse  overflow-hidden">
          {/* Table Header */}
          <thead>
            <tr className="bg-indigo-100 text-gray-900 uppercase text-sm leading-normal">
              <th className="py-4 px-6 text-left font-semibold">Model</th>
              <th className="py-4 px-6 text-left font-semibold">Brand</th>
              <th className="py-4 px-6 text-left font-semibold">Registration No</th>
              <th className="py-4 px-6 text-left font-semibold">Type</th>
              <th className="py-4 px-6 text-left font-semibold">Color</th>
              <th className="py-4 px-6 text-left font-semibold">Fuel Type</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="text-gray-100 bg-gray-900 text-sm font-light">
            {filteredCars.length > 0 ? (
              filteredCars.map((car) => (
                <tr
                  key={car._id}
                  className="border-b border-gray-200 transition-all duration-200"
                >
                  <td className="py-4 px-6 whitespace-nowrap">{car.model}</td>
                  <td className="py-4 px-6 whitespace-nowrap">{car.brand}</td>
                  <td className="py-4 px-6 whitespace-nowrap">{car.regNumber}</td>
                  <td className="py-4 px-6 whitespace-nowrap">{car.type}</td>
                  <td className="py-4 px-6 whitespace-nowrap">{car.color}</td>
                  <td className="py-4 px-6 whitespace-nowrap">{car.fuelType}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-gray-500 font-medium"
                >
                  No cars available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GetAllCars;