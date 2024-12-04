import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { API_END_POINT_admin } from '../../utils/constants'; 

const ChangeRole = () => {
  const [email, setEmail] = useState('');
  const [newRole, setNewRole] = useState('');
  const [currentRole, setCurrentRole] = useState('');

  
  const fetchCurrentRole = () => {
    if (!email) {
      toast.error('Email is required');
      return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${API_END_POINT_admin}/getuser?email=${email}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.withCredentials = true; // to send cookie,

    xhr.onload = function () {
      if (xhr.status === 200) {
        const user = JSON.parse(xhr.responseText);
        if (user && user.role) {
          setCurrentRole(user.role);
        } else {
          toast.error('User not found or no role assigned');
          setCurrentRole('');
        }
      } else {
        const error = JSON.parse(xhr.responseText);
        toast.error(error.message || 'Error fetching user role');
      }
    };

    xhr.onerror = function () {
      toast.error('Network error or server is down');
    };

    xhr.send();
  };

  // Handle role change using XMLHttpRequest
  const handleChangeRole = () => {
    if (!email || !newRole) {
      toast.error('Email and new role are required');
      return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('PUT', `${API_END_POINT_admin}/change-role`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.withCredentials = true;

    xhr.onload = function () {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        toast.success(response.message);
        fetchCurrentRole(); // Fetch the updated role after change
      } else {
        const error = JSON.parse(xhr.responseText);
        toast.error(error.message || 'Error changing user role');
      }
    };

    xhr.onerror = function () {
      toast.error('Network error or server is down');
    };

    const data = JSON.stringify({ email, newRole });
    xhr.send(data);
  };

  return (
    <div className="w-[100%] max-w-3xl mx-auto p-10 h-[100vh]  bg-gray-700  text-white space-y-8 ml-[-20%]">
    <h2 className="text-3xl font-bold text-center">Change User Role</h2>
  
    <div className="space-y-6">
      {/* Email Input */}
      <div>
        <label className="block text-lg font-medium mb-2">User Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter user email"
          className="w-full p-4 border border-gray-500 rounded-lg shadow-sm bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500 placeholder-gray-100"
          required
        />
      </div>
  
      {/* Fetch Current Role Button */}
      <button
        onClick={fetchCurrentRole}
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition duration-300"
      >
        Fetch Current Role
      </button>
  
      {/* Current Role Display */}
      {currentRole && (
        <div className="mt-6 text-center">
          <h3 className="text-xl font-semibold">
            Current Role: <span className="text-blue-400">{currentRole}</span>
          </h3>
        </div>
      )}
  
      {/* New Role Selection */}
      <div>
        <label className="block text-lg font-medium mb-2">New Role:</label>
        <select
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          className="w-full p-4 border border-gray-500 rounded-lg shadow-sm bg-gray-700 text-white focus:ring-green-500 focus:border-green-500"
          required
        >
          <option value="" disabled>Select a role</option>
          <option value="user">User</option>
          <option value="carOwner">Car Owner</option>
          <option value="admin">Admin</option>
        </select>
      </div>
    </div>
  
    {/* Change Role Button */}
    <button
      onClick={handleChangeRole}
      className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition duration-300"
    >
      Change Role
    </button>
  </div>
  
  );
};

export default ChangeRole;