import React from 'react';
import PropTypes from 'prop-types';

const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-blue-100 text-blue-800',
    fulfilled: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    closed: 'bg-green-100 text-green-800',
    'in progress': 'bg-blue-100 text-blue-800',
    assigned: 'bg-yellow-100 text-yellow-800',
    'on hold': 'bg-yellow-100 text-yellow-800',
    new: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
};

const StatusBadge = ({ status, className = '' }) => {
    const statusKey = status.toLowerCase();
    const colorClass = statusColors[statusKey] || 'bg-gray-100 text-gray-800';

    return (
        <span className={`px-2 py-1 text-xs rounded capitalize ${colorClass} ${className}`}>
            {status}
        </span>
    );
};

StatusBadge.propTypes = {
    status: PropTypes.string.isRequired,
    className: PropTypes.string,
};

export default StatusBadge;