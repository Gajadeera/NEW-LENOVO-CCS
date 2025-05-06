import React from 'react';
import PropTypes from 'prop-types';
import { FiEye, FiEdit2, FiTrash2, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

const ActionButtons = ({
    onView,
    onEdit,
    onDelete,
    onApprove,
    onReject,
    onStatusChange,
    statusOptions,
    currentStatus,
    className = '',
}) => {
    return (
        <div className={`flex space-x-2 ${className}`}>
            {onView && (
                <button
                    onClick={onView}
                    className="text-blue-600 hover:text-blue-900"
                    title="View"
                >
                    <FiEye className="h-5 w-5" />
                </button>
            )}
            {onEdit && (
                <button
                    onClick={onEdit}
                    className="text-yellow-600 hover:text-yellow-900"
                    title="Edit"
                >
                    <FiEdit2 className="h-5 w-5" />
                </button>
            )}
            {onDelete && (
                <button
                    onClick={onDelete}
                    className="text-red-600 hover:text-red-900"
                    title="Delete"
                >
                    <FiTrash2 className="h-5 w-5" />
                </button>
            )}
            {onApprove && (
                <button
                    onClick={onApprove}
                    className="text-green-600 hover:text-green-900"
                    title="Approve"
                >
                    <FiCheckCircle className="h-5 w-5" />
                </button>
            )}
            {onReject && (
                <button
                    onClick={onReject}
                    className="text-red-600 hover:text-red-900"
                    title="Reject"
                >
                    <FiAlertTriangle className="h-5 w-5" />
                </button>
            )}
            {onStatusChange && statusOptions && (
                <select
                    onChange={(e) => onStatusChange(e.target.value)}
                    value={currentStatus}
                    className="border rounded px-2 py-1 text-sm"
                >
                    {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
};

ActionButtons.propTypes = {
    onView: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    onApprove: PropTypes.func,
    onReject: PropTypes.func,
    onStatusChange: PropTypes.func,
    statusOptions: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })
    ),
    currentStatus: PropTypes.string,
    className: PropTypes.string,
};

export default ActionButtons;