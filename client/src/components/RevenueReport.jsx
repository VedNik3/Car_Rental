import { useState, useEffect } from "react";
import axios from "axios";
import {
  API_END_POINT_admin,
  API_END_POINT_CarOwner,
} from "../utils/constants";
import { useSelector } from "react-redux"; // Correct import

const RevenueReport = () => {
  const userRole = useSelector((state) => state.app.user?.role);
  const [cars, setCars] = useState([]);
  const [ownedCars, setOwnedCars] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [carOwnerBookings, setCarOwnerBookings] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [lastMonthRevenue, setLastMonthRevenue] = useState(0);

  // Add state for car owner revenue
  const [carOwnerRevenue, setCarOwnerRevenue] = useState(0);
  const [lastMonthCarOwnerRevenue, setLastMonthCarOwnerRevenue] = useState(0);

  useEffect(() => {
    const getCars = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/admin/getallcars",
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        setCars(res.data.cars);
      } catch (error) {
        console.error("Error fetching cars:", error.message);
      }
    };

    const getOwnedCars = async () => {
      try {
        const res = await axios.get(
          `${API_END_POINT_CarOwner}/getallownedcars`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        setOwnedCars(res.data.cars);
      } catch (error) {
        console.error("Error fetching car owner's cars:", error.message);
      }
    };

    const getUsers = async () => {
      try {
        const res = await axios.get(`${API_END_POINT_admin}/getallusers`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

    const getBookings = async () => {
      try {
        const res = await axios.get(`${API_END_POINT_admin}/allbookings`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        let sum = 0;
        let lastMonthSum = 0;

        const currentDate = new Date();
        const lastMonthStart = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - 1,
          1
        );
        const lastMonthEnd = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          0
        );

        res.data.forEach((booking) => {
          if (booking.status === "booked" || booking.status === "completed") {
            const bookingTime =
              new Date(booking.rentalEndDate) -
              new Date(booking.rentalStartDate);
            const hours = bookingTime / (1000 * 60 * 60); // Convert milliseconds to hours

            const bookingPrice = parseFloat(
              (booking.totalPrice * hours).toFixed(2)
            );

            sum += bookingPrice * 0.2;

            // last month bookings
            const rentalStartDate = new Date(booking.rentalStartDate);
            if (
              rentalStartDate >= lastMonthStart &&
              rentalStartDate <= lastMonthEnd
            ) {
              lastMonthSum += bookingPrice * 0.2;
            }
          }
        });

        setRevenue(sum);
        setLastMonthRevenue(lastMonthSum);
        setBookings(res.data);
      } catch (error) {
        console.error("Error fetching bookings:", error.message);
      }
    };

    const getCarOwnerBookings = async () => {
      try {
        const res = await axios.get(
          `${API_END_POINT_CarOwner}/CarOwnerBookingDetails`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        let sum = 0;
        let lastMonthSum = 0;

        const currentDate = new Date();
        const lastMonthStart = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - 1,
          1
        );
        const lastMonthEnd = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          0
        );

        res.data.bookings.forEach((booking) => {
          if (booking.status === "booked" || booking.status === "completed") {
            const bookingTime =
              new Date(booking.rentalEndDate) -
              new Date(booking.rentalStartDate);
            const hours = bookingTime / (1000 * 60 * 60); // Convert milliseconds to hours

            const bookingPrice = parseFloat(
              (booking.totalPrice * hours).toFixed(2)
            );

            sum += bookingPrice * 0.9;

            // Calculate last month bookings
            const rentalStartDate = new Date(booking.rentalStartDate);
            if (
              rentalStartDate >= lastMonthStart &&
              rentalStartDate <= lastMonthEnd
            ) {
              lastMonthSum += bookingPrice * 0.9;
            }
          }
        });

        setCarOwnerRevenue(sum);
        setLastMonthCarOwnerRevenue(lastMonthSum);
        setCarOwnerBookings(res.data.bookings);
      } catch (error) {
        console.error("Error fetching car owner bookings:", error.message);
      }
    };

    if(userRole === "admin"){
      getCars();
      getBookings();
      getUsers();
    } else if(userRole === "carOwner"){
      getOwnedCars();
      getCarOwnerBookings();
    }

   
    
  }, []); // Empty dependency array to run only on mount

  return (
    <div className="mx-auto rounded-lg p-8 ml-[-40%]">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 border-b pb-4">
        {userRole === "admin" ? "Admin Dashboard" : "Owner Dashboard"}
      </h1>
  
      {/* Row for Total Users, Total Cars, and Total Bookings */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {userRole === "admin" && (
          <div className="p-6 bg-gray-100 rounded-lg shadow-md transition-transform transform hover:scale-105">
            <h2 className="text-xl font-semibold text-gray-700">
              Total Users Listed
            </h2>
            <p className="text-3xl font-bold text-gray-900">{users.length}</p>
          </div>
        )}
  
        <div className="p-6 bg-gray-100 rounded-lg shadow-md transition-transform transform hover:scale-105">
          <h2 className="text-xl font-semibold text-gray-700">
            Total Cars Listed
          </h2>
          <p className="text-3xl font-bold text-gray-900">
            {userRole === "admin" ? cars.length : ownedCars.length}
          </p>
        </div>
  
        <div className="p-6 bg-gray-100 rounded-lg shadow-md transition-transform transform hover:scale-105">
          <h2 className="text-xl font-semibold text-gray-700">
            Total Bookings
          </h2>
          <p className="text-3xl font-bold text-gray-900">
            {userRole === "admin" ? bookings.length : carOwnerBookings.length}
          </p>
        </div>
      </div>
  
      {/* Row for Total Revenue and Last Month Revenue */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        <div className="p-6 bg-gray-100 rounded-lg shadow-md transition-transform transform hover:scale-105">
          <h2 className="text-xl font-semibold text-gray-700">Total Revenue</h2>
          <p className="text-3xl font-bold text-gray-900">
            Rs. {userRole === "admin" ? revenue : carOwnerRevenue}
          </p>
        </div>
  
        <div className="p-6 bg-gray-100 rounded-lg shadow-md transition-transform transform hover:scale-105">
          <h2 className="text-xl font-semibold text-gray-700">
            Last Month Revenue
          </h2>
          <p className="text-3xl font-bold text-gray-900">
            Rs.{" "}
            {userRole === "admin"
              ? lastMonthRevenue
              : lastMonthCarOwnerRevenue}
          </p>
        </div>
      </div>
    </div>
  );
  
};

export default RevenueReport;