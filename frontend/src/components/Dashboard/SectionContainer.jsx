import React from 'react';
import PropTypes from 'prop-types';

const SectionContainer = ({
    title,
    children,
    buttonText,
    onButtonClick,
    buttonIcon,
    className = ''
}) => {
    return (
        <div className={`bg-white shadow rounded-lg overflow-hidden ${className}`}>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">{title}</h2>
                {buttonText && (
                    <button
                        onClick={onButtonClick}
                        className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                        {buttonIcon && <span className="mr-1">{buttonIcon}</span>}
                        {buttonText}
                    </button>
                )}
            </div>
            {children}
        </div>
    );
};

SectionContainer.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    buttonText: PropTypes.string,
    onButtonClick: PropTypes.func,
    buttonIcon: PropTypes.node,
    className: PropTypes.string,
};

export default SectionContainer;