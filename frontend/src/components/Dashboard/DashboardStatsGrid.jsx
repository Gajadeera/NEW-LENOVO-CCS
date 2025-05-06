import React from 'react';
import PropTypes from 'prop-types';
import StatsCard from './StatsCard';

const DashboardStatsGrid = ({ stats, onStatClick }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-12 py-10">
            {stats.map((stat) => (
                <StatsCard
                    key={stat.title}
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                    trend={stat.trend}
                    onClick={() => onStatClick(stat)}
                    className={stat.className}
                />
            ))}
        </div>
    );
};

DashboardStatsGrid.propTypes = {
    stats: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            icon: PropTypes.node.isRequired,
            trend: PropTypes.oneOf(['up', 'down', 'steady']),
            className: PropTypes.string,
            path: PropTypes.string,
        })
    ).isRequired,
    onStatClick: PropTypes.func,
};

export default DashboardStatsGrid;