import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiHardDrive, FiPlus, FiCheckCircle, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import ErrorMessage from '../../components/common/ErrorMessage';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AddDeviceModal from './AddDeviceModal';

const DeviceCard = ({ device, onClick }) => {
    const isUnderWarranty = new Date(device.warranty_expiry) > new Date();

    return (
        <div
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow mb-4"
            onClick={onClick}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg mr-4">
                        {device.device_type.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{device.manufacturer} {device.model_number}</h3>
                        <p className="text-sm text-gray-500 capitalize">{device.device_type}</p>
                    </div>
                </div>

                <div className="flex items-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium mr-4 ${isUnderWarranty ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {isUnderWarranty ? 'Under Warranty' : 'Warranty Expired'}
                    </span>
                    <FiChevronRight className="text-gray-400" />
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                    <div>
                        <span className="text-gray-500">Serial:</span> {device.serial_number}
                    </div>
                    <div>
                        <span className="text-gray-500">Purchased:</span> {new Date(device.purchase_date).toLocaleDateString()}
                    </div>
                </div>
            </div>
        </div>
    );
};

const DeviceList = () => {
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalDevices: 0,
        underWarranty: 0
    });
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10
    });
    const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false);

    const fetchDevices = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASED_URL}/devices`, {
                params: {
                    page: filters.page,
                    limit: filters.limit
                },
                headers: { Authorization: `Bearer ${currentUser.token}` }
            });

            const devicesData = response.data.devices || [];
            setDevices(devicesData);
            updateStats(devicesData);

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch devices');
            console.error('Devices fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateStats = (devicesData) => {
        const underWarrantyCount = devicesData.filter(d =>
            new Date(d.warranty_expiry) > new Date()
        ).length;

        setStats({
            totalDevices: devicesData.length,
            underWarranty: underWarrantyCount
        });
    };

    useEffect(() => {
        fetchDevices();
    }, [filters]);

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    const handleDeviceClick = (deviceId) => {
        if (!deviceId) {
            console.error('Device ID is undefined');
            return;
        }
        navigate(`/devices/${deviceId}`);
    };

    if (error) return <ErrorMessage message={error} onRetry={fetchDevices} />;

    return (
        <div className="container mx-auto px-4 py-8">
            <button
                onClick={() => navigate('/')}
                className="flex items-center text-blue-600 hover:text-blue-800"
            >
                <FiChevronLeft className="mr-1" /> Back to Home
            </button>
            <div className="mb-8">
                <h1 className="text-2xl font-bold ">Device Management</h1>
                <p className="">Manage all company devices</p>
            </div>

            {/* Stats Cards and Add Device Button */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Devices</p>
                            <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.totalDevices}</p>
                        </div>
                        <div className="p-3 rounded-full bg-blue-50 text-blue-500">
                            <FiHardDrive className="h-6 w-6" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Under Warranty</p>
                            <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.underWarranty}</p>
                        </div>
                        <div className="p-3 rounded-full bg-green-50 text-green-500">
                            <FiCheckCircle className="h-6 w-6" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center">
                    <button
                        onClick={() => setIsAddDeviceOpen(true)}
                        className="flex items-center px-6 py-3 text-black rounded-md transition-colors w-full justify-center"
                    >
                        <FiPlus className="mr-2" />
                        Add New Device
                    </button>
                    <AddDeviceModal
                        isOpen={isAddDeviceOpen}
                        onClose={() => setIsAddDeviceOpen(false)}
                        onSuccess={() => {
                            setIsAddDeviceOpen(false);
                            fetchDevices();
                        }}
                    />
                </div>
            </div>

            {/* Devices List */}
            {loading && devices.length === 0 ? (
                <div className="p-8">
                    <LoadingSpinner />
                </div>
            ) : devices.length === 0 ? (
                <p className="text-gray-500 py-8 text-center">No devices found</p>
            ) : (
                <>
                    <div className="space-y-4 mb-8">
                        {devices.map((device) => (
                            <DeviceCard
                                key={device._id}
                                device={device}
                                onClick={() => handleDeviceClick(device._id)}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center bg-white rounded-lg shadow px-6 py-4">
                        <button
                            onClick={() => handlePageChange(filters.page - 1)}
                            disabled={filters.page <= 1}
                            className={`px-4 py-2 rounded-md ${filters.page <= 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-700">
                            Page {filters.page}
                        </span>
                        <button
                            onClick={() => handlePageChange(filters.page + 1)}
                            disabled={devices.length < filters.limit}
                            className={`px-4 py-2 rounded-md ${devices.length < filters.limit ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default DeviceList;