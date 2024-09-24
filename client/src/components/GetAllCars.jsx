import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GetAllCars = () => {
  const [cars, setCars] = useState([]); 
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
        

      } catch (error) {
        console.error("Error fetching cars", error);
        setError("Failed to fetch cars"); 
      } finally {
        setLoading(false); 
      }
    };

    fetchCars();
  }, []);


  if (loading) {
    return <p className="text-center">Loading cars...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto  p-4">
      <h2 className="text-2xl font-bold text-center mb-6">All Cars</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Model</th>
              <th className="py-3 px-6 text-left">Brand</th>
              <th className="py-3 px-6 text-left">Registration No</th>
              <th className="py-3 px-6 text-left">Type</th>
              <th className="py-3 px-6 text-left">Color</th>
              <th className="py-3 px-6 text-left">Fuel Type</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {cars.length > 0 ? (
              cars.map((car) => (
                <tr key={car._id} className="border-b border-gray-200 hover:bg-gray-100 transition-colors">
                  <td className="py-3 px-6">{car.model}</td>
                  <td className="py-3 px-6">{car.brand}</td>
                  <td className="py-3 px-6">{car.regNumber}</td>
                  <td className="py-3 px-6">{car.type}</td>
                  <td className="py-3 px-6">{car.color}</td>
                  <td className="py-3 px-6">{car.fuelType}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-3 px-6">No cars available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GetAllCars;
