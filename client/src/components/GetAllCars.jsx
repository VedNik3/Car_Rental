import React, { useEffect, useState } from "react";
import axios from "axios";

const AllCarsTable = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/admin/getallcars",
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true, // to send cookies or session info
          }
        );
        
        // const data = await response.json();
        setCars(response.data);
        console.log(response.data)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  if (loading) {
    return <p className="text-center text-lg font-medium text-blue-500">Loading cars...</p>;
  }

  if (error) {
    return <p className="text-center text-lg font-medium text-red-500">{error}</p>;
  }

  return (
    <div className="overflow-x-auto w-full ml-[-40%]">
      <table className="min-w-full bg-white border border-gray-200 shadow-md">
        <thead>
          <tr className="bg-gray-200">
          <th className="py-3 px-12 text-left">Owner</th>
          <th className="py-3 px-6 text-left">Model</th>
              <th className="py-3 px-6 text-left">Brand</th>
              <th className="py-3 px-6 text-left">Registration No</th>
              <th className="py-3 px-6 text-left">Type</th>
              <th className="py-3 px-6 text-left">Color</th>
              <th className="py-3 px-6 text-left">Fuel Type</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr key={car._id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border">
                {car.ownerId.fullname}
              </td>
              <td className="py-2 px-4 border">
                {car.model}
              </td>
              <td className="py-2 px-4 border">
                {car.brand}
              </td>
              <td className="py-2 px-4 border">
                {car.regNumber}
              </td>
              <td className="py-2 px-4 border">
                {car.type}
              </td>
              <td className="py-2 px-4 border">
                {car.color}
              </td>
              <td className="py-2 px-4 border">
                {car.fuelType}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllCarsTable;
