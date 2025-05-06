import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import DatePicker from '../../components/common/DatePicker';
import { CustomerSelect } from '../../components/common/SelectComponents';

const AddDeviceModal = ({ isOpen, onClose, onSuccess, currentUser }) => {
    const [formData, setFormData] = useState({
        customer_id: null,
        device_type: 'Laptop',
        manufacturer: '',
        model_number: '',
        serial_number: '',
        purchase_date: null,
        warranty_expiry: null,
        specifications: {
            cpu: '',
            ram: '',
            storage: '',
            os: ''
        },
        notes: ''
    });
    const [customers, setCustomers] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [showSpecs, setShowSpecs] = useState(false);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const storedUser = localStorage.getItem('user');
                const token = storedUser ? JSON.parse(storedUser).token : null;

                const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASED_URL}/customers`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setCustomers(response.data.customers || []);
                setIsLoadingData(false);
            } catch (err) {
                setError('Failed to load customers');
                console.error('Customers loading error:', err);
                setIsLoadingData(false);
            }
        };

        if (isOpen) {
            fetchCustomers();
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleCustomerChange = (selectedCustomer) => {
        setFormData(prev => ({
            ...prev,
            customer_id: selectedCustomer ? selectedCustomer._id : null
        }));
    };

    const handleDateChange = (name, date) => {
        setFormData(prev => ({
            ...prev,
            [name]: date
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.customer_id || !formData.manufacturer || !formData.model_number || !formData.serial_number) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);
            const deviceData = {
                ...formData,
                purchase_date: formData.purchase_date,
                warranty_expiry: formData.warranty_expiry,
                created_at: new Date(),
                updated_at: new Date()
            };

            const storedUser = localStorage.getItem('user');
            const token = storedUser ? JSON.parse(storedUser).token : null;
            if (!token) {
                setError('You are not authorized to perform this action. Please log in.');
                setLoading(false);
                return;
            }

            await axios.post(
                `${import.meta.env.VITE_REACT_APP_BACKEND_BASED_URL}/devices`,
                deviceData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setFormData({
                customer_id: null,
                device_type: 'Laptop',
                manufacturer: '',
                model_number: '',
                serial_number: '',
                purchase_date: null,
                warranty_expiry: null,
                specifications: {
                    cpu: '',
                    ram: '',
                    storage: '',
                    os: ''
                },
                notes: ''
            });
            onClose();
            onSuccess();

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add device');
            console.error('Device creation error:', err);
        } finally {
            setLoading(false);
        }
    };

    const deviceTypeOptions = [
        { value: 'Laptop', label: 'Laptop' },
        { value: 'Desktop', label: 'Desktop' },
        { value: 'Server', label: 'Server' },
        { value: 'Printer', label: 'Printer' },
        { value: 'Network', label: 'Network' },
        { value: 'Storage', label: 'Storage' },
        { value: 'Other', label: 'Other' }
    ];

    if (isLoadingData) {
        return (
            <Modal isOpen={isOpen} onClose={onClose} title="Add New Device" size="md">
                <div className="flex justify-center items-center h-32">
                    <p>Loading data...</p>
                </div>
            </Modal>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Device" size="lg">
            {error && <Alert type="error" message={error} className="mb-3" />}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
                    <CustomerSelect
                        label="Customer*"
                        customers={customers}
                        selectedCustomer={formData.customer_id ?
                            customers.find(c => c._id === formData.customer_id) : null}
                        onChange={handleCustomerChange}
                        required
                        className="md:col-span-2 lg:col-span-3"
                    />

                    <Select
                        label="Type*"
                        name="device_type"
                        value={formData.device_type}
                        onChange={handleChange}
                        options={deviceTypeOptions}
                        required
                    />

                    <Input
                        label="Manufacturer*"
                        name="manufacturer"
                        value={formData.manufacturer}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        label="Model*"
                        name="model_number"
                        value={formData.model_number}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        label="Serial*"
                        name="serial_number"
                        value={formData.serial_number}
                        onChange={handleChange}
                        required
                    />

                    <DatePicker
                        label="Purchase Date"
                        selected={formData.purchase_date}
                        onChange={(date) => handleDateChange('purchase_date', date)}
                        className="mb-0"
                    />

                    <DatePicker
                        label="Warranty Expiry"
                        selected={formData.warranty_expiry}
                        onChange={(date) => handleDateChange('warranty_expiry', date)}
                        minDate={formData.purchase_date}
                        className="mb-0"
                    />
                </div>

                <div className="border-t border-gray-200 pt-3 mt-3">
                    <button
                        type="button"
                        className="flex items-center text-sm text-gray-600 mb-2"
                        onClick={() => setShowSpecs(!showSpecs)}
                    >
                        {showSpecs ? 'Hide' : 'Show'} Specifications
                    </button>

                    {showSpecs && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                            <Input
                                label="CPU"
                                name="specifications.cpu"
                                value={formData.specifications.cpu}
                                onChange={handleChange}
                                compact
                            />
                            <Input
                                label="RAM"
                                name="specifications.ram"
                                value={formData.specifications.ram}
                                onChange={handleChange}
                                compact
                            />
                            <Input
                                label="Storage"
                                name="specifications.storage"
                                value={formData.specifications.storage}
                                onChange={handleChange}
                                compact
                            />
                            <Input
                                label="OS"
                                name="specifications.os"
                                value={formData.specifications.os}
                                onChange={handleChange}
                                compact
                            />
                        </div>
                    )}
                </div>

                <Input
                    label="Notes"
                    name="notes"
                    type="textarea"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={2}
                    className="mb-3"
                />

                <div className="flex justify-end gap-2 mt-4">
                    <Button
                        type="button"
                        onClick={onClose}
                        variant="outline"
                        size="sm"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        loading={loading}
                        size="sm"
                    >
                        {loading ? 'Adding...' : 'Add Device'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default AddDeviceModal;