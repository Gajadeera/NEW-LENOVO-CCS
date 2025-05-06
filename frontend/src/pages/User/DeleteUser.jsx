import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FiX, FiUser, FiAlertTriangle } from 'react-icons/fi';

const DeleteUser = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASED_URL}/users/${userId}`);
                setUser(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch user');
                console.error('Fetch user error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    const handleDelete = async () => {
        try {
            setDeleting(true);
            await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_BASED_URL}/users/${userId}`);
            navigate('/users');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete user');
            console.error('Delete user error:', err);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow text-center">
                    <p>Loading user information...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
                    <div className="text-red-500 mb-4">{error}</div>
                    <button
                        onClick={() => navigate('/users')}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Back to Users
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <FiAlertTriangle className="text-red-500 mr-2" />
                        Delete User
                    </h1>
                    <button
                        onClick={() => navigate('/users')}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                {user && (
                    <>
                        <div className="flex items-center mb-6">
                            <div className="h-12 w-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold mr-3">
                                <FiUser size={20} />
                            </div>
                            <div>
                                <div className="text-lg font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                                <div className="text-sm text-gray-500 capitalize">{user.role.replace('_', ' ')}</div>
                            </div>
                        </div>

                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <FiAlertTriangle className="h-5 w-5 text-red-500" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">
                                        Are you sure you want to delete this user? This action cannot be undone.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => navigate('/users')}
                                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                                disabled={deleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                disabled={deleting}
                            >
                                {deleting ? 'Deleting...' : 'Delete User'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default DeleteUser;