import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { FaUsers, FaCar, FaCalendarAlt, FaMoneyBillWave } from "react-icons/fa";
import { GiMoneyStack } from "react-icons/gi";
// import '../styles/RevenueReport.css'

const RevenueReport = () => {
  const userRole = useSelector((state) => state.app.user?.role);
  const [cars, setCars] = useState([]);
  const [ownedCars, setOwnedCars] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [carOwnerBookings, setCarOwnerBookings] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [lastMonthRevenue, setLastMonthRevenue] = useState(0);
  const [carOwnerRevenue, setCarOwnerRevenue] = useState(0);
  const [lastMonthCarOwnerRevenue, setLastMonthCarOwnerRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (userRole === "admin") {
          await Promise.all([getCars(), getUsers(), getBookings()]);
        } else if (userRole === "carOwner") {
          await Promise.all([getOwnedCars(), getCarOwnerBookings()]);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    fetchRecentBookings();
  }, [userRole]);

  const getCars = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/admin/getallcars", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setCars(res.data);
    } catch (error) {
      console.error("Error fetching cars:", error.message);
    }
  };

  const getUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/admin/getallusers", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });


      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  const getBookings = async () => {
    try {

      const res = await axios.get("http://localhost:8000/api/admin/allbookings", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      setBookings(res.data);
      calculateRevenue(res.data, setRevenue, setLastMonthRevenue);
    } catch (error) {
      console.error("Error fetching bookings:", error.message);
    }
  };

  const getOwnedCars = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/carOwner/getallownedcars", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      // console.log(res)
      setOwnedCars(res.data.cars);
    } catch (error) {
      console.error("Error fetching owned cars:", error.message);
    }
  };

  const getCarOwnerBookings = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/carOwner/CarOwnerBookingDetails", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      // console.log(res)
      setCarOwnerBookings(res.data.bookings);
      calculateRevenue(res.data.bookings, setCarOwnerRevenue, setLastMonthCarOwnerRevenue);
    } catch (error) {
      console.error("Error fetching car owner bookings:", error.message);
    }
  };

  const fetchRecentBookings = async () => {
    try {
      let res;
      if (userRole === "admin") {
        res = await axios.get("http://localhost:8000/api/admin/recent-bookings", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
      } else if (userRole === "carOwner") {
        res = await axios.get("http://localhost:8000/api/carOwner/recent-bookings", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
      }

      console.log("Fetched recent bookings:", res.data); // Log response data directly
      setRecentBookings(res.data); // Update state with fetched data
    } catch (error) {
      console.error("Error fetching recent bookings:", error.message);
    }
  };

  // const calculateRevenue = (bookings, setTotalRevenue, setLastMonthRevenue) => {
  //   const currentDate = new Date();
  //   const lastMonth = currentDate.getMonth() - 1;
  //   const totalRevenue = bookings.reduce((total, booking) => total + booking.totalPrice, 0);
  //   const lastMonthRevenue = bookings
  //     .filter((booking) => new Date(booking.date).getMonth() === lastMonth)
  //     .reduce((total, booking) => total + booking.totalPrice, 0);

  //   setTotalRevenue(totalRevenue);
  //   setLastMonthRevenue(lastMonthRevenue);
  // };

  const calculateRevenue = (bookings, setTotalRevenue, setLastMonthRevenue) => {
    const currentDate = new Date();
    const lastMonth = currentDate.getMonth() - 1;

    // Filter out canceled bookings
    const validBookings = bookings.filter((booking) => booking.status !== "canceled");

    // Calculate total revenue from valid bookings
    let totalRevenue = 0;
    if (userRole === "admin") {
      totalRevenue = validBookings.reduce((total, booking) => total + (booking.totalPrice * 0.2), 0);
    } else if (userRole === "carOwner") {
      totalRevenue = validBookings.reduce((total, booking) => total + (booking.totalPrice * 0.8), 0);
    }

    // Calculate revenue for the last month from valid bookings
    const lastMonthRevenue = validBookings
      .filter((booking) => new Date(booking.rentalStartDate).getMonth() === lastMonth)
      .reduce((total, booking) => total + booking.totalPrice * 0.8, 0);

    setTotalRevenue(totalRevenue);
    setLastMonthRevenue(lastMonthRevenue);
  };

  return (
    <div className="h-screen bg-white">
      <div className="mx-auto rounded-lg p-8">
        <h1 className="text-4xl font-bold text-black mb-6 border-b pb-4 ">
          {userRole === "admin" ? "Admin Dashboard" : "Owner Dashboard"}
        </h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {/* Align cards in a single horizontal line */}
            <div className="flex flex-wrap gap-6 ">
              {userRole === "admin" && (
                <div className="p-6 bg-gray-100 rounded-lg shadow-md transform hover:scale-105 transition duration-300 ease-in-out hover:bg-gray-300 hover:shadow-xl border border-gray-200">
                  <h2 className="text-xl font-semibold animate-pulse">Total Users Listed</h2>
                  <p className="text-3xl font-bold">{users.length}</p>
                </div>
              )}
              <div className="p-6 w-64 bg-white bg-gradient-to-r from-blue-100 to-blue-400 rounded-lg shadow-black shadow-[0_15px_25px_-15px_rgba(0,0,0,0)] transform hover:scale-105 transition duration-300 ease-in-out hover: ml-8 ">
                <h2 className="text-xl font-semibold animate-pulse  text-black">Total Cars Listed</h2>
                <FaCar className="text-4xl text-blue-600" />
                <p className="text-3xl font-bold text-black">
                  {userRole === "admin" ? cars.length : ownedCars.length}
                </p>
              </div>
              <div className="p-6 w-64 bg-white bg-gradient-to-r from-violet-100 to-violet-400 rounded-lg shadow-black shadow-[0_15px_15px_-15px_rgba(0,0,0,0)] transform hover:scale-105 transition duration-300 ease-in-out">
                <h2 className="text-xl font-semibold animate-pulse">Total Bookings</h2>
                <FaCalendarAlt className="text-4xl text-violet-500" />
                <p className="text-3xl font-bold">
                  {userRole === "admin" ? bookings.length : carOwnerBookings.length}
                </p>
              </div>
              {/* </div> */}

              {/* Align revenue cards in a single horizontal line */}
              {/* <div className="flex flex-wrap gap-6 justify-center mt-6"> */}
              <div className="p-6 w-64 bg-white bg-gradient-to-r from-yellow-100 to-yellow-400 rounded-lg shadow-black shadow-[0_15px_15px_-15px_rgba(0,0,0,0)] transform hover:scale-105 transition duration-300 ease-in-out ">
                <h2 className="text-xl font-semibold animate-pulse">Total Revenue</h2>
                <FaMoneyBillWave className="text-4xl text-yellow-400" />
                <p className="text-3xl font-bold">
                  Rs. {userRole === "admin" ? revenue : carOwnerRevenue}
                </p>
              </div>
              <div className="p-6 w-64 bg-white bg-gradient-to-r from-green-100 to-green-400  rounded-lg  shadow-black shadow-[0_15px_15px_-15px_rgba(0,0,0,0)] transform hover:scale-105 transition duration-300 ease-in-out ">
                <h2 className="text-xl font-semibold animate-pulse">Last Month Revenue</h2>
                {/* <FaMoneyBillWave className="text-4xl text-black" /> */}
                <GiMoneyStack className="text-4xl text-green-600" />
                <p className="text-3xl font-bold">
                  Rs. {userRole === "admin" ? lastMonthRevenue : lastMonthCarOwnerRevenue}
                </p>
              </div>
            </div>

            {/* Recent Bookings Table */}
            <div className="flex flex-wrap gap-6 ">
              <div className="border-2 rounded-xl mt-20 border-gray-300 shadow-lg bg-gradient-to-r from-white via-gray-100 to-white p-8 w-full mx-auto">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                  📋 Recent Bookings
                </h2>
                <div className="overflow-x-auto shadow-black shadow-[0_15px_15px_-15px_rgba(0,0,0,0)]">
                  <table className="w-full table-auto bg-white rounded-lg shadow-md">
                    <thead>
                      <tr className="bg-gradient-to-b from-gray-700 to-gray-500 text-white text-sm uppercase tracking-wider">
                        <th className="px-6 py-0">User</th>
                        <th className="px-6 py-1">Car</th>
                        <th className="px-6 py-1">Pickup</th>
                        <th className="px-6 py-4">Dropoff</th>
                        <th className="px-6 py-4">Total Price</th>
                        <th className="px-6 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((booking) => (
                        <tr
                          key={booking._id}
                          className="border-t border-gray-200 bg-gray-50 hover:bg-gradient-to-b from-gray-100 to-gray-100 transition duration-300"
                        >
                          {console.log(booking.user)}
                          <td className="px-6 py-4 text-gray-800 font-medium">
                            {booking.user?.fullname || "N/A"}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            🚗 {booking.car?.brand} {booking.car?.model}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            📍 {booking.rentalLocation.pickupLocation}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            📍 {booking.rentalLocation.dropoffLocation}
                          </td>
                          <td className="px-6 py-4 text-gray-800 font-bold">
                            ₹ {booking.totalPrice}
                          </td>
                          <td className="px-4 py-2 text-xs text-center">
                            <span
                              className={`px-2 py-2 text-sm inline-block rounded-full border ${booking.status === "completed"
                                ? "text-green-600 border-green-600 bg-green-100"
                                : booking.status === "canceled"
                                  ? "text-yellow-600 border-yellow-600 bg-yellow-100"
                                  : "text-red-600 border-red-600 bg-red-100"
                                }`}
                            >
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

  );
};

export default RevenueReport;