import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

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
      console.log(res.data);
      
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  const getBookings = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/admin/getallbookings", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setBookings(res.data.bookings);
      calculateRevenue(res.data.bookings, setRevenue, setLastMonthRevenue);
    } catch (error) {
      console.error("Error fetching bookings:", error.message);
    }
  };

  const getOwnedCars = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/carowner/getownedcars", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setOwnedCars(res.data.cars);
    } catch (error) {
      console.error("Error fetching owned cars:", error.message);
    }
  };

  const getCarOwnerBookings = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/carowner/getbookings", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setCarOwnerBookings(res.data.bookings);
      calculateRevenue(res.data.bookings, setCarOwnerRevenue, setLastMonthCarOwnerRevenue);
    } catch (error) {
      console.error("Error fetching car owner bookings:", error.message);
    }
  };

  const calculateRevenue = (bookings, setTotalRevenue, setLastMonthRevenue) => {
    const currentDate = new Date();
    const lastMonth = currentDate.getMonth() - 1;
    const totalRevenue = bookings.reduce((total, booking) => total + booking.amount, 0);
    const lastMonthRevenue = bookings
      .filter((booking) => new Date(booking.date).getMonth() === lastMonth)
      .reduce((total, booking) => total + booking.amount, 0);

    setTotalRevenue(totalRevenue);
    setLastMonthRevenue(lastMonthRevenue);
  };

  return (
    <div className="mx-auto rounded-lg p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 border-b pb-4">
        {userRole === "admin" ? "Admin Dashboard" : "Owner Dashboard"}
      </h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {userRole === "admin" && (
              <div className="p-6 bg-gray-100 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold">Total Users Listed</h2>
                <p className="text-3xl font-bold">{users.length}</p>
              </div>
            )}
            <div className="p-6 bg-gray-100 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">Total Cars Listed</h2>
              <p className="text-3xl font-bold">
                {userRole === "admin" ? cars.length : ownedCars.length}
              </p>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">Total Bookings</h2>
              <p className="text-3xl font-bold">
                {userRole === "admin" ? bookings.length : carOwnerBookings.length}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            <div className="p-6 bg-gray-100 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">Total Revenue</h2>
              <p className="text-3xl font-bold">
                Rs. {userRole === "admin" ? revenue : carOwnerRevenue}
              </p>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">Last Month Revenue</h2>
              <p className="text-3xl font-bold">
                Rs. {userRole === "admin" ? lastMonthRevenue : lastMonthCarOwnerRevenue}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenueReport;
