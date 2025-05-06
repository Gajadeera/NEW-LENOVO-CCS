import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiUsers, FiPlus, FiUserCheck, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import ErrorMessage from '../../components/common/ErrorMessage';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import SignupModal from '../../pages/Signup';

const UserCard = ({ user, onClick }) => {
    const isOnline = new Date(user.last_login) > new Date(Date.now() - 5 * 60 * 1000);

    return (
        <div
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow mb-4"
            onClick={onClick}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg mr-4">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{user.role.replace('_', ' ')}</p>
                    </div>
                </div>

                <div className="flex items-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium mr-4 ${isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {isOnline ? 'Online' : 'Offline'}
                    </span>
                    <FiChevronRight className="text-gray-400" />
                </div>
            </div>
        </div>
    );
};

const Users = () => {
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0
    });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        usersPage: 1,
        limit: 10
    });
    const [isSignupOpen, setIsSignupOpen] = useState(false);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await axios.get('http://localhost:5000/users/', {
                params: {
                    page: filters.usersPage,
                    limit: filters.limit
                },
                headers: { Authorization: `Bearer ${currentUser.token}` }
            });

            const usersData = response.data;
            setUsers(usersData);
            updateStats(usersData);

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch users');
            console.error('Users fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateStats = (usersData) => {
        const activeCount = usersData.filter(u =>
            new Date(u.last_login) > new Date(Date.now() - 5 * 60 * 1000)
        ).length;

        setStats({
            totalUsers: usersData.length,
            activeUsers: activeCount
        });
    };

    useEffect(() => {
        fetchUsers();
    }, [filters]);

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, usersPage: newPage }));
    };

    const handleUserClick = (userId) => {
        if (!userId) {
            console.error('User ID is undefined');
            return;
        }
        navigate(`/users/${userId}`);
    };

    if (error) return <ErrorMessage message={error} onRetry={fetchUsers} />;

    return (
        <div className="container mx-auto px-4 py-8">
            <button
                onClick={() => navigate('/')}
                className="flex items-center text-blue-600 hover:text-blue-800"
            >
                <FiChevronLeft className="mr-1" /> Back to Home
            </button>
            <div className="mb-8">
                <h1 className="text-2xl font-bold ">User Management</h1>
                <p className="">Manage all system users</p>
            </div>

            {/* Stats Cards and Add User Button */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Users</p>
                            <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.totalUsers}</p>
                        </div>
                        <div className="p-3 rounded-full bg-blue-50 text-blue-500">
                            <FiUsers className="h-6 w-6" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Active Users</p>
                            <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.activeUsers}</p>
                        </div>
                        <div className="p-3 rounded-full bg-green-50 text-green-500">
                            <FiUserCheck className="h-6 w-6" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center">
                    <button
                        onClick={() => setIsSignupOpen(true)}
                        className="flex items-center px-6 py-3  text-black rounded-md  transition-colors w-full justify-center"
                    >
                        <FiPlus className="mr-2" />
                        Add New User
                    </button>
                    <SignupModal
                        isOpen={isSignupOpen}
                        onClose={() => setIsSignupOpen(false)}
                        onSuccess={() => {
                            setIsSignupOpen(false);
                            fetchUsers();
                        }}
                    />
                </div>
            </div>

            {/* Users List */}
            {loading && users.length === 0 ? (
                <div className="p-8">
                    <LoadingSpinner />
                </div>
            ) : users.length === 0 ? (
                <p className="text-gray-500 py-8 text-center">No users found</p>
            ) : (
                <>
                    <div className="space-y-4 mb-8">
                        {users.map((user) => (
                            <UserCard
                                key={user._id}
                                user={user}
                                onClick={() => handleUserClick(user._id)}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center bg-white rounded-lg shadow px-6 py-4">
                        <button
                            onClick={() => handlePageChange(filters.usersPage - 1)}
                            disabled={filters.usersPage <= 1}
                            className={`px-4 py-2 rounded-md ${filters.usersPage <= 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-700">
                            Page {filters.usersPage}
                        </span>
                        <button
                            onClick={() => handlePageChange(filters.usersPage + 1)}
                            disabled={users.length < filters.limit}
                            className={`px-4 py-2 rounded-md ${users.length < filters.limit ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Users;