import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { API_END_POINT_admin } from "../../utils/constants";

const GetAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_END_POINT_admin}/getallusers`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        setUsers(response.data);
        setFilteredUsers(response.data); // Initialize filteredUsers with all users
      } catch (error) {
        toast.error(error.response?.data?.message || "Error fetching users");
      }
    };

    fetchUsers();
  }, []);

  // Handle search query changes
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = users.filter(
      (user) =>
        user.fullname.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  };

  return (
    <div className=" bg-gray-700 text-white w-[84.4%] p-6 fixed top-0 right-0  ">
      <h2 className="text-2xl font-semibold text-white mb-6">User Details</h2>

      {/* Search Box */}
      <div className="relative mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search users..."
          className="w-full p-3 text-black bg-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-black"
        />
      </div>

      {/* User Table */}
      <div className="overflow-x-auto h-full">
        <table className="min-w-full  text-gray-300 table-auto">
          <thead>
            <tr className="text-left bg-custom-gray">
              <th className="py-3 px-6">Name</th>
              <th className="py-3 px-6">Email</th>
              <th className="py-3 px-6">Role</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-t border-gray-900 hover:bg-gray-600 transition"
                >
                  <td className="py-3 px-6 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-center text-white font-bold flex items-center justify-center mr-3">
                      {user.fullname.charAt(0).toUpperCase()}
                    </div>
                    {user.fullname || "N/A"}
                  </td>
                  <td className="py-3 px-6">{user.email}</td>
                  <td className="py-3 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        user.role === "admin"
                          ? "bg-blue-500 text-white"
                          : user.role === "carOwner"
                          ? "bg-green-500 text-white"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-6 text-gray-400">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GetAllUsers;
