import React, { useEffect, useState } from 'react';
import { API_END_POINT } from "../../utils/constants";
import axios from 'axios';

const UserProfile = () => {
  const [userData, setUserData] = useState(null); // State for user data
  const [error, setError] = useState(''); // State for errors
  const [name, setName] = useState(''); // State for editing the user's name
  const [loading, setLoading] = useState(false); // State for handling loading during update
  const [isEditing, setIsEditing] = useState(false); // State for managing edit mode

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${API_END_POINT}/profile`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Send cookies along with the request
        });

        setUserData(res.data); // Save the user data to state
        setName(res.data.fullname); // Set initial name in the state
      } catch (error) {
        setError('Error fetching user information');
        console.error("Error response:", error.response);
      }
    };

    fetchUserData();
  }, []);

  // Function to handle the update of the user's name
  const handleUpdate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.put(`${API_END_POINT}/update`, { fullname: name }, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Send cookies along with the request
      });

      setUserData(res.data); // Update the user data in state
      setIsEditing(false); // Exit edit mode after updating
      setError(''); // Clear any previous errors
      setLoading(false);
    } catch (error) {
      setError('Error updating user information');
      console.error("Update error response:", error.response);
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold mb-6">User Information</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {userData ? (
          <div>
            {isEditing ? (
              // Edit Mode: Show the form when editing
              <div>
                <h3 className="text-xl font-medium mb-4">Edit Your Details</h3>
                
                {/* Name input field for editing */}
                <div className="mb-4">
                  <label className="block text-left mb-2 text-gray-600">Name:</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <p className="mt-4"><strong>Email:</strong> {userData.email}</p>

                {/* Update and Cancel Buttons */}
                <button
                  onClick={handleUpdate}
                  className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Name'}
                </button>

                {/* Cancel button to return to view mode */}
                <button
                  onClick={() => setIsEditing(false)}
                  className="ml-4 mt-6 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            ) : (
              // Normal View: Display user info when not editing
              <div>
                <h3 className="text-xl font-medium">User Details</h3>
                <p className="mt-2"><strong>Name:</strong> {userData.fullname}</p>
                <p className="mt-2"><strong>Email:</strong> {userData.email}</p>

                {/* Button to open the edit form */}
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit Name
                </button>
              </div>
            )}
          </div>
        ) : (
          <p>Loading...</p> // Display a loading message while data is being fetched
        )}
      </div>
    </div>
  );
};

export default UserProfile;