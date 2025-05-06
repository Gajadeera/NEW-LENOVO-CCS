// src/components/SelectComponents.js
import React from 'react';
import Select from 'react-select';

// CustomerSelect component
export const CustomerSelect = ({ label, customers, selectedCustomer, onChange, required = false, disabled = false }) => {
    const options = customers.map(customer => ({
        value: customer._id,
        label: customer.name,
        ...customer
    }));

    const value = selectedCustomer ? {
        value: selectedCustomer._id,
        label: selectedCustomer.name,
        ...selectedCustomer
    } : null;

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
                {required && <span className="text-red-500">*</span>}
            </label>
            <Select
                options={options}
                value={value}
                onChange={(selected) => onChange(selected)}
                isDisabled={disabled}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder={`Select ${label.toLowerCase()}`}
            />
        </div>
    );
};

// DeviceSelect component
export const DeviceSelect = ({ label, devices, selectedDevice, onChange, required = false, disabled = false }) => {
    const options = devices.map(device => ({
        value: device._id,
        label: `${device.model} (${device.serial_number})`,
        ...device
    }));

    const value = selectedDevice ? {
        value: selectedDevice._id,
        label: `${selectedDevice.model} (${selectedDevice.serial_number})`,
        ...selectedDevice
    } : null;

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
                {required && <span className="text-red-500">*</span>}
            </label>
            <Select
                options={options}
                value={value}
                onChange={(selected) => onChange(selected)}
                isDisabled={disabled}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder={`Select ${label.toLowerCase()}`}
            />
        </div>
    );
};

// UserSelect component (for technicians)
export const UserSelect = ({ label, users, selectedUser, onChange, required = false, disabled = false }) => {
    const options = users.map(user => ({
        value: user._id,
        label: `${user.name} (${user.role})`,
        ...user
    }));

    const value = selectedUser ? {
        value: selectedUser._id,
        label: `${selectedUser.name} (${selectedUser.role})`,
        ...selectedUser
    } : null;

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
                {required && <span className="text-red-500">*</span>}
            </label>
            <Select
                options={options}
                value={value}
                onChange={(selected) => onChange(selected)}
                isDisabled={disabled}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder={`Select ${label.toLowerCase()}`}
                isClearable
            />
        </div>
    );
};