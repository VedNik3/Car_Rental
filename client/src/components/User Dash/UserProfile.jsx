import React, { useEffect, useState } from "react";
import { API_END_POINT } from "../../utils/constants";
import axios from "axios";
import homeImage from "../../assets/image1.png";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${API_END_POINT}/profile`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        setUserData(res.data);
        setName(res.data.fullname);
      } catch (error) {
        setError("Error fetching user information");
        console.error("Error response:", error.response);
      }
    };
    fetchUserData();
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.put(
        `${API_END_POINT}/update`,
        { fullname: name },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setUserData(res.data);
      setIsEditing(false);
      setError("");
    } catch (error) {
      setError("Error updating user information");
      console.error("Update error response:", error.response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-red-300 to-red-500">
      <div className="container mx-auto  px-4 py-16 flex flex-col md:flex-row items-center  gap-40">
        {/* Profile Card */}
        <div className="w-full md:w-1/2 max-w-md ml-52 mt-5">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 transform hover:translate-y-[-4px] transition-all duration-300">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
              User Profile
            </h2>
            
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                <p>{error}</p>
              </div>
            )}

            {userData ? (
              isEditing ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div className="flex gap-4 justify-end">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdate}
                      disabled={loading}
                      className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                          </svg>
                          Updating...
                        </span>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="text-lg font-medium">{userData.fullname}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-lg font-medium">{userData.email}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full mt-6 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Edit Profile
                  </button>
                </div>
              )
            ) : (
              <div className="flex justify-center items-center h-40">
                <div className="animate-pulse flex space-x-4">
                  <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-36"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Image Section */}
        <div className="w-full md:w-1/2 max-w-md mt-32">
          <img
            src={homeImage}
            alt="Profile Illustration"
            className="w-full h-auto rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-500"
          />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;