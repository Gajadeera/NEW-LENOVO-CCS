import React from 'react';
import PropTypes from 'prop-types';

const StatsCard = ({ title, value, icon, trend, onClick, className = '' }) => {
    const trendIcons = {
        up: '↑',
        down: '↓',
        steady: '→',
    };

    const trendClasses = {
        up: 'bg-green-100 text-green-800',
        down: 'bg-red-100 text-red-800',
        steady: 'bg-yellow-100 text-yellow-800',
    };

    return (
        <div
            className={`bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4 ${onClick ? 'cursor-pointer hover:bg-gray-50 transition-colors' : ''
                } ${className}`}
            onClick={onClick}
        >
            <div className="p-3 rounded-full bg-opacity-20 bg-gray-200 text-gray-600">
                {icon}
            </div>
            <div>
                <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                {trend && (
                    <span className={`text-xs px-2 py-1 rounded-full ${trendClasses[trend]}`}>
                        {trendIcons[trend]} {trend === 'up' ? 'Increased' : trend === 'down' ? 'Decreased' : 'No change'}
                    </span>
                )}
            </div>
        </div>
    );
};

StatsCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    icon: PropTypes.node.isRequired,
    trend: PropTypes.oneOf(['up', 'down', 'steady']),
    onClick: PropTypes.func,
    className: PropTypes.string,
};

export default StatsCard;