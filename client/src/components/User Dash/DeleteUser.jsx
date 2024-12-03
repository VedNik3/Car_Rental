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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 ml-[-45%]">
            <h1 className="text-3xl font-bold mb-4">Delete User Account</h1>

            {/* Show error message if there is one */}
            {error && <div className="text-red-600 mb-4">{error}</div>}

            {/* Show success message if account deletion is successful */}
            {successMessage && <div className="text-green-600 mb-4">{successMessage}</div>}

            {/* Show a confirmation message before deletion */}
            <p className="mb-4 text-center">
                Are you sure you want to delete your account? This action is irreversible.
            </p>

            {/* Delete button */}
            <button
                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
                onClick={deleteAccount}
                disabled={loading}
            >
                {loading ? 'Deleting...' : 'Delete Account'}
            </button>
        </div>
    );
};

export default DeleteUser;