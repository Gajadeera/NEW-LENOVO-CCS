import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    FiUsers,
    FiBriefcase,
    FiHardDrive,
    FiPackage,
    FiUserCheck,
    FiAlertTriangle,
    FiBox,
    FiCheckCircle
} from 'react-icons/fi';
import DashboardStatsGrid from '../../components/Dashboard/DashboardStatsGrid';
import ErrorMessage from '../../components/common/ErrorMessage';
import DashboardHeader from '../../components/Dashboard/DashboardHeader';
import JobsTable from '../../components/Job/JobsTable';
import UsersTable from '../../components/User/UsersTable';
import InventoryTable from '../../components/Inventory/InventoryTable';
import PartsRequestsTable from '../../components/PartsRequests/PartsRequestsTable';
import DevicesTable from '../../components/Device/DevicesTable';

const ManagerDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        totalDevices: 0,
        activeJobs: 0,
        completedJobs: 0,
        pendingPartsRequests: 0,
        highPriorityJobs: 0,
        lowStockItems: 0,
        totalInventory: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTable, setActiveTable] = useState(null);
    const [tableData, setTableData] = useState({
        users: [],
        activeUsers: [],
        devices: [],
        activeJobs: [],
        completedJobs: [],
        highPriorityJobs: [],
        pendingPartsRequests: [],
        lowStockItems: [],
        inventory: []
    });

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError('');

            const [
                usersRes,
                devicesRes,
                jobsRes,
                inventoryRes,
                partsRequestsRes
            ] = await Promise.all([
                axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASED_URL}/users`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                }),
                axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASED_URL}/devices`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                }),
                axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASED_URL}/jobs`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                }),
                axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASED_URL}/inventory`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                }),
                axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASED_URL}/parts_requests`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                })
            ]);

            const users = usersRes.data.users || usersRes.data || [];
            const devices = devicesRes.data.devices || devicesRes.data || [];
            const jobs = jobsRes.data.jobs || jobsRes.data || [];
            const inventory = inventoryRes.data.inventory || inventoryRes.data || [];
            const partsRequests = partsRequestsRes.data.partsRequests || partsRequestsRes.data || [];

            const activeJobs = jobs.filter(job => job.status !== 'Closed');
            const completedJobs = jobs.filter(job => job.status === 'Closed');
            const highPriorityJobs = jobs.filter(job => ['High', 'Urgent'].includes(job.priority));
            const lowStockItems = inventory.filter(item => item.current_quantity <= item.minimum_quantity);
            const pendingPartsRequests = partsRequests.filter(req => req.status === 'Pending');
            const activeUsers = users.filter(user => user.isActive);

            setTableData({
                users,
                activeUsers,
                devices,
                activeJobs,
                completedJobs,
                highPriorityJobs,
                pendingPartsRequests,
                lowStockItems,
                inventory
            });

            setStats({
                totalUsers: users.length,
                activeUsers: activeUsers.length,
                totalDevices: devices.length,
                activeJobs: activeJobs.length,
                completedJobs: completedJobs.length,
                highPriorityJobs: highPriorityJobs.length,
                pendingPartsRequests: pendingPartsRequests.length,
                lowStockItems: lowStockItems.length,
                totalInventory: inventory.length
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
        if (activeTable === stat.title) {
            setActiveTable(null);
        } else {
            setActiveTable(stat.title);
        }
    };

    const commonJobColumns = [
        {
            key: 'job_number',
            header: 'Job Number',
            render: (job) => job.job_number || job._id.substring(0, 8)
        },
        {
            key: 'description',
            header: 'Description',
            render: (job) => job.description || 'N/A'
        },
        {
            key: 'customer',
            header: 'Customer',
            render: (job) => job.customer_id?.name || 'N/A'
        },
        {
            key: 'assigned_to',
            header: 'Assigned To',
            render: (job) => job.assigned_to?.name || 'Unassigned'
        },
        {
            key: 'scheduled_date',
            header: 'Due Date',
            render: (job) => job.scheduled_date ? new Date(job.scheduled_date).toLocaleDateString() : 'Not set'
        },
        {
            key: 'priority',
            header: 'Priority',
            render: (job) => (
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${job.priority === 'High' ? 'bg-red-100 text-red-800' :
                        job.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'}`}>
                    {job.priority || 'Low'}
                </span>
            )
        },
        {
            key: 'status',
            header: 'Status',
            render: (job) => (
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${job.status === 'Assigned' ? 'bg-blue-100 text-blue-800' :
                        job.status === 'In Progress' ? 'bg-purple-100 text-purple-800' :
                            job.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'}`}>
                    {job.status}
                </span>
            )
        }
    ];

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
            header: 'Role'
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
        }
    ];

    const inventoryColumns = [
        {
            key: 'part_name',
            header: 'Part Name'
        },
        {
            key: 'part_number',
            header: 'Part Number'
        },
        {
            key: 'current_quantity',
            header: 'Current Qty'
        },
        {
            key: 'minimum_quantity',
            header: 'Min Qty'
        },
        {
            key: 'location',
            header: 'Location'
        },
        {
            key: 'status',
            header: 'Status',
            render: (item) => (
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${item.current_quantity <= item.minimum_quantity ? 'bg-red-100 text-red-800' :
                        'bg-green-100 text-green-800'}`}>
                    {item.current_quantity <= item.minimum_quantity ? 'Low Stock' : 'In Stock'}
                </span>
            )
        }
    ];

    const partsRequestColumns = [
        {
            key: 'part_name',
            header: 'Part Name'
        },
        {
            key: 'quantity',
            header: 'Quantity'
        },
        {
            key: 'requested_by',
            header: 'Requested By',
            render: (req) => req.requested_by?.name || 'N/A'
        },
        {
            key: 'job_id',
            header: 'Job',
            render: (req) => req.job_id?.job_number || 'N/A'
        },
        {
            key: 'requested_date',
            header: 'Requested Date',
            render: (req) => new Date(req.requested_date).toLocaleDateString()
        },
        {
            key: 'status',
            header: 'Status',
            render: (req) => (
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${req.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        req.status === 'Approved' ? 'bg-green-100 text-green-800' :
                            req.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'}`}>
                    {req.status}
                </span>
            )
        }
    ];

    const deviceColumns = [
        {
            key: 'device_name',
            header: 'Device Name'
        },
        {
            key: 'serial_number',
            header: 'Serial Number'
        },
        {
            key: 'manufacturer',
            header: 'Manufacturer'
        },
        {
            key: 'model',
            header: 'Model'
        },
        {
            key: 'status',
            header: 'Status',
            render: (device) => (
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${device.status === 'Active' ? 'bg-green-100 text-green-800' :
                        device.status === 'In Maintenance' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'}`}>
                    {device.status}
                </span>
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
            title: 'Total Devices',
            value: stats.totalDevices,
            icon: <FiHardDrive className="h-6 w-6" />,
            trend: 'up',
            className: 'bg-purple-50 text-purple-600'
        },
        {
            title: 'Active Jobs',
            value: stats.activeJobs,
            icon: <FiBriefcase className="h-6 w-6" />,
            trend: stats.activeJobs > 5 ? 'up' : 'steady',
            className: 'bg-blue-50 text-blue-600'
        },
        {
            title: 'Completed Jobs',
            value: stats.completedJobs,
            icon: <FiCheckCircle className="h-6 w-6" />,
            trend: 'steady',
            className: 'bg-green-50 text-green-600'
        },
        {
            title: 'High Priority Jobs',
            value: stats.highPriorityJobs,
            icon: <FiAlertTriangle className="h-6 w-6" />,
            trend: stats.highPriorityJobs > 0 ? 'up' : 'steady',
            className: 'bg-red-50 text-red-600'
        },
        {
            title: 'Pending Parts Requests',
            value: stats.pendingPartsRequests,
            icon: <FiPackage className="h-6 w-6" />,
            trend: stats.pendingPartsRequests > 3 ? 'up' : 'steady',
            className: 'bg-yellow-50 text-yellow-600'
        },
        {
            title: 'Low Stock Items',
            value: stats.lowStockItems,
            icon: <FiBox className="h-6 w-6" />,
            trend: stats.lowStockItems > 10 ? 'up' : 'steady',
            className: 'bg-orange-50 text-orange-600'
        }
    ];

    if (error) return <ErrorMessage message={error} onRetry={fetchDashboardData} />;

    return (
        <div>
            <DashboardHeader />
            <div className="container mx-auto px-20 py-8">
                <DashboardStatsGrid stats={statsData} onStatClick={handleStatClick} />

                {activeTable === 'Total Users' && (
                    <UsersTable
                        users={tableData.users}
                        title="All Users"
                        columns={userColumns}
                    />
                )}

                {activeTable === 'Active Users' && (
                    <UsersTable
                        users={tableData.activeUsers}
                        title="Active Users"
                        columns={userColumns}
                    />
                )}

                {activeTable === 'Total Devices' && (
                    <DevicesTable
                        devices={tableData.devices}
                        title="All Devices"
                        columns={deviceColumns}
                    />
                )}

                {activeTable === 'Active Jobs' && (
                    <JobsTable
                        jobs={tableData.activeJobs}
                        title="Active Jobs"
                        columns={commonJobColumns}
                    />
                )}

                {activeTable === 'Completed Jobs' && (
                    <JobsTable
                        jobs={tableData.completedJobs}
                        title="Completed Jobs"
                        columns={commonJobColumns}
                    />
                )}

                {activeTable === 'High Priority Jobs' && (
                    <JobsTable
                        jobs={tableData.highPriorityJobs}
                        title="High Priority Jobs"
                        columns={commonJobColumns}
                    />
                )}

                {activeTable === 'Pending Parts Requests' && (
                    <PartsRequestsTable
                        requests={tableData.pendingPartsRequests}
                        title="Pending Parts Requests"
                        columns={partsRequestColumns}
                    />
                )}

                {activeTable === 'Low Stock Items' && (
                    <InventoryTable
                        items={tableData.lowStockItems}
                        title="Low Stock Items"
                        columns={inventoryColumns}
                    />
                )}
            </div>
        </div>
    );
};

export default ManagerDashboard;