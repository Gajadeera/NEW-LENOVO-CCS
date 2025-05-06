import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiPackage, FiCheckCircle, FiAlertTriangle, FiBox } from 'react-icons/fi';
import DashboardStatsGrid from '../../components/Dashboard/DashboardStatsGrid';
import ErrorMessage from '../../components/common/ErrorMessage';
import DashboardHeader from '../../components/Dashboard/DashboardHeader';
import PartsRequestsTable from '../../components/PartsRequests/PartsRequestsTable';
import InventoryTable from '../../components/Inventory/InventoryTable';

const PartsTeamDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        pendingRequests: 0,
        approvedRequests: 0,
        lowStockItems: 0,
        fulfilledRequests: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTable, setActiveTable] = useState(null);
    const [tableData, setTableData] = useState({
        pendingRequests: [],
        approvedRequests: [],
        lowStockItems: [],
        fulfilledRequests: []
    });

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError('');

            const [
                pendingRequestsRes,
                approvedRequestsRes,
                fulfilledRequestsRes,
                lowStockItemsRes
            ] = await Promise.all([
                axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASED_URL}/parts_requests`, {
                    params: { status: 'Pending' },
                    headers: { Authorization: `Bearer ${user.token}` }
                }),
                axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASED_URL}/parts_requests`, {
                    params: { status: 'Approved' },
                    headers: { Authorization: `Bearer ${user.token}` }
                }),
                axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASED_URL}/parts_requests`, {
                    params: { status: 'Fulfilled' },
                    headers: { Authorization: `Bearer ${user.token}` }
                }),
                axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASED_URL}/inventory`, {
                    params: { lowStock: true },
                    headers: { Authorization: `Bearer ${user.token}` }
                })
            ]);

            // Handle different API response structures
            const pendingRequests = pendingRequestsRes.data.partsRequests || pendingRequestsRes.data || [];
            const approvedRequests = approvedRequestsRes.data.partsRequests || approvedRequestsRes.data || [];
            const fulfilledRequests = fulfilledRequestsRes.data.partsRequests || fulfilledRequestsRes.data || [];
            const lowStockItems = lowStockItemsRes.data.inventory || lowStockItemsRes.data || [];

            setTableData({
                pendingRequests,
                approvedRequests,
                fulfilledRequests,
                lowStockItems
            });

            setStats({
                pendingRequests: pendingRequests.length,
                approvedRequests: approvedRequests.length,
                lowStockItems: lowStockItems.length,
                fulfilledRequests: fulfilledRequests.length
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
                            req.status === 'Fulfilled' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'}`}>
                    {req.status}
                </span>
            )
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

    const statsData = [
        {
            title: 'Pending Requests',
            value: stats.pendingRequests,
            icon: <FiPackage className="h-6 w-6" />,
            trend: stats.pendingRequests > 5 ? 'up' : 'steady',
            className: 'bg-blue-50 text-blue-600'
        },
        {
            title: 'Approved Requests',
            value: stats.approvedRequests,
            icon: <FiCheckCircle className="h-6 w-6" />,
            trend: stats.approvedRequests > 3 ? 'up' : 'steady',
            className: 'bg-green-50 text-green-600'
        },
        {
            title: 'Low Stock Items',
            value: stats.lowStockItems,
            icon: <FiAlertTriangle className="h-6 w-6" />,
            trend: stats.lowStockItems > 10 ? 'up' : 'steady',
            className: 'bg-red-50 text-red-600'
        },
        {
            title: 'Fulfilled Requests',
            value: stats.fulfilledRequests,
            icon: <FiBox className="h-6 w-6" />,
            trend: 'steady',
            className: 'bg-purple-50 text-purple-600'
        }
    ];

    if (error) return <ErrorMessage message={error} onRetry={fetchDashboardData} />;

    return (
        <div>
            <DashboardHeader />
            <div className="container mx-auto px-20 py-8">
                <DashboardStatsGrid stats={statsData} onStatClick={handleStatClick} />

                {activeTable === 'Pending Requests' && (
                    <PartsRequestsTable
                        requests={tableData.pendingRequests}
                        title="Pending Parts Requests"
                        columns={partsRequestColumns}
                    />
                )}

                {activeTable === 'Approved Requests' && (
                    <PartsRequestsTable
                        requests={tableData.approvedRequests}
                        title="Approved Parts Requests"
                        columns={partsRequestColumns}
                    />
                )}

                {activeTable === 'Fulfilled Requests' && (
                    <PartsRequestsTable
                        requests={tableData.fulfilledRequests}
                        title="Fulfilled Parts Requests"
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

export default PartsTeamDashboard;