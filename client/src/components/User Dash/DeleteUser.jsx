import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from "react-hot-toast";
import { API_END_POINT } from "../../utils/constants";

const DeleteUser = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate(); // Hook for programmatic navigation

    const deleteAccount = async () => {
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            // Send DELETE request to the backend to delete the user
            await axios.delete(`${API_END_POINT}/deleteAccount`, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true, // To send cookies/session info
            });

            // On successful deletion, show success message and redirect to login
            // setSuccessMessage('Your account has been successfully deleted.');
            toast.success("Your account has been successfully deleted.");
            setTimeout(() => {
                navigate('/login'); // Redirect to login page after a short delay
            }, 1000); // Wait for 2 seconds before redirection
        } catch (err) {
            setError(err.response ? err.response.data.message : "Unable to delete account. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-300">
        <h1 className="text-4xl font-bold mb-8 text-red-700">Delete User Account</h1>
    
        {error && <div className="text-red-600 mb-6 px-4 py-2 bg-red-100 rounded-md">{error}</div>}
    
        {successMessage && <div className="text-green-600 mb-6 px-4 py-2 bg-green-100 rounded-md">{successMessage}</div>}
    
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 mb-8">
            <p className="mb-6 text-center text-gray-700 text-lg">
                Are you sure you want to delete your account? This action is irreversible.
            </p>
    
            <button
                className="w-full bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 transition ease-in-out duration-200 text-lg font-semibold"
                onClick={deleteAccount}
                disabled={loading}
            >
                {loading ? 'Deleting...' : 'Delete Account'}
            </button>
        </div>
    </div>
    );
};

export default DeleteUser;