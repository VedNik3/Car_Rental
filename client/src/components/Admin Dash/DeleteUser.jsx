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
    <div className="w-[100%] mx-auto p-16 space-y-10 bg-gray-700 pt-40 ml-[-20%] text-white">
  <h2 className="text-3xl font-bold text-center text-white">
    Delete User
  </h2>

  <div className="space-y-6">
    <div>
      <label
        htmlFor="user-email"
        className="block text-lg font-medium text-white"
      >
        User Email:
      </label>
      <input
        id="user-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter user email"
        className="mt-2 p-4 block w-full border border-gray-300 rounded-lg shadow-sm text-lg focus:ring-red-500 focus:border-red-500"
        required
      />
    </div>

    <button
      onClick={handleDeleteUser}
      className="w-full py-3 bg-red-500 text-white font-semibold text-lg rounded-lg shadow hover:bg-red-600 transition duration-300"
    >
      Delete User
    </button>
  </div>
</div>
  );
};

export default DeleteUser;