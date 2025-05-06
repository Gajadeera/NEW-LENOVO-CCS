import React from 'react';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';
import PropTypes from 'prop-types';

const ErrorMessage = ({ message, onRetry, className = '' }) => {
    return (
        <div className={`bg-red-50 border-l-4 border-red-400 p-4 ${className}`}>
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <FiAlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3 flex-1">
                    <p className="text-sm text-red-700">
                        {message || 'An unexpected error occurred. Please try again.'}
                    </p>
                    {onRetry && (
                        <div className="mt-2">
                            <button
                                onClick={onRetry}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                <FiRefreshCw className="mr-2 h-4 w-4" />
                                Retry
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

ErrorMessage.propTypes = {
    message: PropTypes.string,
    onRetry: PropTypes.func,
    className: PropTypes.string
};

export default ErrorMessage;