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
    <div className="max-w-md mx-auto p-6 bg-gray-100 shadow-md ml-[-10%] rounded-md space-y-6">
      <h2 className="text-2xl font-semibold text-gray-700">Get User Details</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">User Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter user email"
            className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <button
          onClick={handleGetUser}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
        >
          Fetch User
        </button>

        {userData && (
          <div className="mt-4 p-4 bg-white shadow-md rounded-md">
            <h3 className="text-lg font-semibold text-gray-700">User Details:</h3>
            <p><strong>Name:</strong> {userData.fullname || 'N/A'}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Role:</strong> {userData.role}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetUser;