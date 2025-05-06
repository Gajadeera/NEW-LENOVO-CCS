import React from 'react';
import PropTypes from 'prop-types';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
    const sizes = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16'
    };

    return (
        <div className={`flex justify-center items-center ${className}`}>
            <div
                className={`animate-spin rounded-full border-b-2 border-gray-400 ${sizes[size]}`}
                style={{
                    borderTopColor: 'transparent',
                    borderRightColor: 'transparent',
                    borderLeftColor: 'transparent'
                }}
            ></div>
        </div>
    );
};

LoadingSpinner.propTypes = {
    size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
    className: PropTypes.string
};

export default LoadingSpinner;