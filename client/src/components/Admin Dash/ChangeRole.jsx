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
    <div className="max-w-md mx-auto p-6 bg-gray-100 ml-[-10%] shadow-md rounded-md space-y-6">
      <h2 className="text-2xl font-semibold text-gray-700">Change User Role</h2>

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
          onClick={fetchCurrentRole}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
        >
          Fetch Current Role
        </button>

        {currentRole && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Current Role: <span className="text-blue-600">{currentRole}</span>
            </h3>
          </div>
        )}

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">New Role:</label>
          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            required
          >
            <option value="" disabled>Select a role</option>
            <option value="user">User</option>
            <option value="carOwner">Car Owner</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleChangeRole}
        className="px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600"
      >
        Change Role
      </button>
    </div>
  );
};

export default ChangeRole;