import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import axios from "axios";
import { API_END_POINT_admin } from "../../utils/constants";

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

const Chart = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_END_POINT_admin}/getallcars`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        const cars = response.data;

        // Group cars by currentLocation
        const locationDistribution = cars.reduce((acc, car) => {
          const location = car.currentLocation;
          acc[location] = (acc[location] || 0) + 1;
          return acc;
        }, {});

        // Convert to chart-compatible array format
        const formattedData = Object.entries(locationDistribution).map(([name, value]) => ({
          name,
          value,
        }));

        setCategoryData(formattedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  if (loading) {
    return <div className="text-gray-100">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <motion.div
      className="bg-slate-100 shadow-xl rounded-xl  border border-gray-700 "
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-2xl font-semibold  text-black ml-8 mt-4">Cars by Location</h2>
      <div className="h-96">
        <ResponsiveContainer width={"100%"} height={"100%"}>
          <PieChart>
            <Pie
              data={categoryData}
              cx={"50%"}
              cy={"50%"}
              labelLine={false}
              outerRadius={120}
              innerRadius={60}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0, 0, 0, 0.75)",
                borderColor: "#4B5563",
                borderRadius: "8px",
              }}
              itemStyle={{ color: "#F3F4F6" }}
            />
            <Legend
              wrapperStyle={{
                color: "white",
                fontSize: "14px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default Chart;
