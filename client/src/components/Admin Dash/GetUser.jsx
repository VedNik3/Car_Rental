import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_END_POINT_admin } from '../../utils/constants';

const GetUser = () => {
  const [email, setEmail] = useState('');
  const [userData, setUserData] = useState(null);

  const handleGetUser = async () => {
    if (!email) {
      toast.error("Please enter an email");
      return;
    }

    try {
      const response = await axios.get(`${API_END_POINT_admin}/getuser`, {
        params: { email },
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      setUserData(response.data);
      toast.success("User fetched successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching user');
      setUserData(null);
    }
  };

  return (
    <div className="w-[90%] max-w-4xl mx-auto p-12 bg-gray-700 text-white pt-40   space-y-10 ml-[-20%]">
      <h2 className="text-4xl font-bold text-center">Get User Details</h2>

      <div className="space-y-8">
        {/* Email Input */}
        <div>
          <label className="block text-lg font-medium mb-2">User Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter user email"
            className="w-full p-4 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
            required
          />
        </div>

        {/* Fetch User Button */}
        <button
          onClick={handleGetUser}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition duration-300"
        >
          Fetch User
        </button>

        {/* Display User Data */}
        {userData && (
          <div className="p-6 bg-gray-700 rounded-lg shadow-lg space-y-4">
            <h3 className="text-2xl font-bold text-center">User Details</h3>
            <div className="text-lg">
              <p><strong>Name:</strong> {userData.fullname || 'N/A'}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Role:</strong> {userData.role}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetUser;