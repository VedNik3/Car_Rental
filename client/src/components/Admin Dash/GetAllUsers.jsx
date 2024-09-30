import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_END_POINT_admin } from '../../utils/constants'; 

const GetAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState(''); 
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Fetch all users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_END_POINT_admin}/getallusers`, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
        setUsers(response.data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error fetching users');
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on selected role
  useEffect(() => {
    if (selectedRole) {
      const filtered = users.filter((user) => user.role === selectedRole);
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users); // Show all users if no role is selected
    }
  }, [selectedRole, users]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-100 ml-[-10%] shadow-md rounded-md space-y-6">
      <h2 className="text-2xl font-semibold text-gray-700">User List</h2>

      {/* Dropdown to select user role */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Filter by Role:
        </label>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Users</option>
          <option value="admin">Admin</option>
          <option value="carOwner">Car Owner</option>
          <option value="user">User</option>
        </select>
      </div>

      {/* Display list of filtered users */}
      <div>
        {filteredUsers.length > 0 ? (
          <ul className="space-y-4">
            {filteredUsers.map((user) => (
              <li key={user._id} className="p-4 bg-white rounded-md shadow-md">
                <div className="font-semibold">Name: {user.fullname || 'N/A'}</div>
                <div>Email: {user.email}</div>
                <div>Role: {user.role}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No users found for this role.</p>
        )}
      </div>
    </div>
  );
};

export default GetAllUsers;