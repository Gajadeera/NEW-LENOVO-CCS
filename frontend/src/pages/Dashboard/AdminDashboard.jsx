import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    FiUsers,
    FiUserCheck,
    FiUserPlus,
    FiUserX,
    FiClock,
    FiActivity,
    FiSettings
} from 'react-icons/fi';
import { FcDocument } from "react-icons/fc";
import DashboardStatsGrid from '../../components/Dashboard/DashboardStatsGrid';
import ErrorMessage from '../../components/common/ErrorMessage';
import DashboardHeader from '../../components/Dashboard/DashboardHeader';
import UsersTable from '../../components/User/UsersTable';
import SignupModal from '../../pages/Signup'; // Import your existing Signup modal
import Button from '../../components/common/Button';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [showCreateUserModal, setShowCreateUserModal] = useState(false);

    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        newUsersThisWeek: 0,
        adminUsers: 0,
        pendingActivations: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTable, setActiveTable] = useState(null);
    const [tableData, setTableData] = useState({
        users: [],
        activeUsers: [],
        inactiveUsers: [],
        newUsers: [],
        adminUsers: [],
        pendingActivations: []
    });

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError('');

            const usersRes = await axios.get('http://localhost:5000/users', {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            const users = usersRes.data.users || usersRes.data || [];
            const activeUsers = users.filter(user => user.isActive);
            const inactiveUsers = users.filter(user => !user.isActive);
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            const newUsers = users.filter(user => new Date(user.createdAt) > oneWeekAgo);
            const adminUsers = users.filter(user => user.role === 'admin');
            const pendingActivations = users.filter(user => !user.isActive && !user.deletedAt);

            setTableData({
                users,
                activeUsers,
                inactiveUsers,
                newUsers,
                adminUsers,
                pendingActivations
            });

            setStats({
                totalUsers: users.length,
                activeUsers: activeUsers.length,
                inactiveUsers: inactiveUsers.length,
                newUsersThisWeek: newUsers.length,
                adminUsers: adminUsers.length,
                pendingActivations: pendingActivations.length
            });

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch dashboard data');
            console.error('Dashboard error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleStatClick = (stat) => {
        if (stat.title === 'Create User') {
            setShowCreateUserModal(true);
        } else if (activeTable === stat.title) {
            setActiveTable(null);
        } else {
            setActiveTable(stat.title);
        }
    };

    const handleUserCreated = () => {
        setShowCreateUserModal(false);
        fetchDashboardData(); // Refresh data after user creation
    };

    const userColumns = [
        {
            key: 'name',
            header: 'Name'
        },
        {
            key: 'email',
            header: 'Email'
        },
        {
            key: 'role',
            header: 'Role',
            render: (user) => (
                <span className="capitalize">{user.role}</span>
            )
        },
        {
            key: 'isActive',
            header: 'Status',
            render: (user) => (
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                </span>
            )
        },
        {
            key: 'lastLogin',
            header: 'Last Login',
            render: (user) => user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'
        },
        {
            key: 'actions',
            header: 'Actions',
            render: (user) => (
                <div className="flex space-x-2">
                    <Button
                        size="xs"
                        variant="outline"
                        onClick={() => navigate(`/users/${user._id}`)}
                    >
                        Edit
                    </Button>
                </div>
            )
        }
    ];

    const statsData = [
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: <FiUsers className="h-6 w-6" />,
            trend: 'up',
            className: 'bg-indigo-50 text-indigo-600'
        },
        {
            title: 'Active Users',
            value: stats.activeUsers,
            icon: <FiUserCheck className="h-6 w-6" />,
            trend: stats.activeUsers > stats.totalUsers / 2 ? 'up' : 'steady',
            className: 'bg-green-50 text-green-600'
        },
        {
            title: 'Inactive Users',
            value: stats.inactiveUsers,
            icon: <FiUserX className="h-6 w-6" />,
            trend: stats.inactiveUsers > 0 ? 'up' : 'steady',
            className: 'bg-red-50 text-red-600'
        },
        {
            title: 'New Users (7 days)',
            value: stats.newUsersThisWeek,
            icon: <FiClock className="h-6 w-6" />,
            trend: stats.newUsersThisWeek > 0 ? 'up' : 'steady',
            className: 'bg-blue-50 text-blue-600'
        },
        {
            title: 'Admin Users',
            value: stats.adminUsers,
            icon: <FiSettings className="h-6 w-6" />,
            trend: 'steady',
            className: 'bg-purple-50 text-purple-600'
        },
        {
            title: 'Pending Activations',
            value: stats.pendingActivations,
            icon: <FiActivity className="h-6 w-6" />,
            trend: stats.pendingActivations > 0 ? 'up' : 'steady',
            className: 'bg-yellow-50 text-yellow-600'
        },
        {
            title: 'Create User',
            value: '+',
            icon: <FiUserPlus className="h-6 w-6" />,
            trend: 'up',
            className: 'bg-teal-50 text-teal-600 cursor-pointer hover:bg-teal-100'
        },
        {
            title: 'Reports',
            value: '+',
            icon: <FcDocument className="h-6 w-6" />,
            trend: 'up',
            className: 'bg-teal-50 text-teal-600 cursor-pointer hover:bg-teal-100'
        }
    ];

    if (error) return <ErrorMessage message={error} onRetry={fetchDashboardData} />;

    return (
        <div>
            <DashboardHeader />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

                <DashboardStatsGrid stats={statsData} onStatClick={handleStatClick} />

                {activeTable === 'Total Users' && (
                    <div className="mt-6">
                        <UsersTable
                            users={tableData.users}
                            title="All Users"
                            columns={userColumns}
                        />
                    </div>
                )}

                {activeTable === 'Active Users' && (
                    <div className="mt-6">
                        <UsersTable
                            users={tableData.activeUsers}
                            title="Active Users"
                            columns={userColumns}
                        />
                    </div>
                )}

                {activeTable === 'Inactive Users' && (
                    <div className="mt-6">
                        <UsersTable
                            users={tableData.inactiveUsers}
                            title="Inactive Users"
                            columns={userColumns}
                        />
                    </div>
                )}

                {activeTable === 'New Users (7 days)' && (
                    <div className="mt-6">
                        <UsersTable
                            users={tableData.newUsers}
                            title="New Users (Last 7 Days)"
                            columns={userColumns}
                        />
                    </div>
                )}

                {activeTable === 'Admin Users' && (
                    <div className="mt-6">
                        <UsersTable
                            users={tableData.adminUsers}
                            title="Admin Users"
                            columns={userColumns}
                        />
                    </div>
                )}

                {activeTable === 'Pending Activations' && (
                    <div className="mt-6">
                        <UsersTable
                            users={tableData.pendingActivations}
                            title="Pending Activations"
                            columns={userColumns}
                        />
                    </div>
                )}
            </div>

            {/* Use your existing Signup modal */}
            <SignupModal
                isOpen={showCreateUserModal}
                onClose={() => setShowCreateUserModal(false)}
                onSuccess={handleUserCreated}
            />
        </div>
    );
};

export default AdminDashboard;