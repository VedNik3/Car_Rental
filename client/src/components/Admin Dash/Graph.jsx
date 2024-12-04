import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import axios from "axios";
import { API_END_POINT_admin } from "../../utils/constants";

const Graph = () => {
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_END_POINT_admin}/allbookings`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });

        const bookings = response.data;
        console.log(bookings);
        

        // Initialize month mapping
        const monthMapping = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        // Process bookings to calculate monthly revenue
        const revenueData = bookings.reduce((acc, booking) => {
          if (booking.status === "canceled") return acc;

          const rentalStartDate = new Date(booking.rentalStartDate);
          const rentalEndDate = new Date(booking.rentalEndDate);
          const daysRented =
            (rentalEndDate - rentalStartDate) / (1000 * 60 * 60 * 24);
          const revenue = daysRented * (( booking.totalPrice*0.2) / daysRented);

          const month = monthMapping[rentalStartDate.getMonth()];
          acc[month] = (acc[month] || 0) + revenue;
          return acc;
        }, {});

        // Convert revenue data to chart-compatible format
        const formattedData = monthMapping.map((month) => ({
          name: month,
          revenue: revenueData[month] || 0,
        }));

        setMonthlyRevenue(formattedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return <div className="text-gray-100">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <motion.div
      className="bg-gradient-to-r from-gray-400 to-gray-300 shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-lg font-medium mb-4 text-black">Monthly Revenue (₹)</h2>
      <div className="h-80">
        <ResponsiveContainer width={"100%"} height={"100%"}>
          <LineChart data={monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
            <XAxis dataKey={"name"} stroke="#000000" />
            <YAxis stroke="#000000" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#10B981"
              strokeWidth={3}
              dot={{ fill: "#1810b9", strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default Graph;
