import React from 'react';
import PropTypes from 'prop-types';

const priorityColors = {
    high: 'bg-red-100 text-red-800',
    urgent: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800',
};

const PriorityBadge = ({ priority, className = '' }) => {
    const priorityKey = priority.toLowerCase();
    const colorClass = priorityColors[priorityKey] || 'bg-gray-100 text-gray-800';

    return (
        <span className={`px-2 py-1 text-xs rounded capitalize ${colorClass} ${className}`}>
            {priority}
        </span>
    );
};

PriorityBadge.propTypes = {
    priority: PropTypes.string.isRequired,
    className: PropTypes.string,
};

export default PriorityBadge;