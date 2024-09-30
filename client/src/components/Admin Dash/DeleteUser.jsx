import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_END_POINT_admin } from '../../utils/constants'; 

const DeleteUser = () => {
  const [email, setEmail] = useState('');

  const handleDeleteUser = async () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    try {
      const response = await axios.delete(`${API_END_POINT_admin}/deleteuser`, {
        data: { email }, // Pass email in the request body
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      toast.success(response.data.message);
      setEmail(''); // Clear the input field
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting user');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-100 ml-[-10%] shadow-md rounded-md space-y-6">
      <h2 className="text-2xl font-semibold text-gray-700">Delete User</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            User Email:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter user email"
            className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
            required
          />
        </div>

        <button
          onClick={handleDeleteUser}
          className="px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600"
        >
          Delete User
        </button>
      </div>
    </div>
  );
};

export default DeleteUser;