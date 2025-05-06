import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const UsersTable = ({
    users,
    title,
    columns,
    onRowClick,
    emptyMessage = 'No users found',
    className = ''
}) => {
    const navigate = useNavigate();

    const handleRowClick = (user) => {
        if (onRowClick) {
            onRowClick(user);
        } else {
            navigate(`/users/${user._id}`);
        }
    };

    return (
        <div className={`mt-8 bg-white shadow rounded-lg overflow-hidden ${className}`}>
            {title && (
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                </div>
            )}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 text-black">
                        {users.length > 0 ? (
                            users.map((user) => (
                                <tr
                                    key={user._id}
                                    className="hover:bg-gray-50 cursor-pointer"
                                    onClick={() => handleRowClick(user)}
                                >
                                    {columns.map((column) => (
                                        <td
                                            key={`${user._id}-${column.key}`}
                                            className="px-6 py-4 whitespace-nowrap text-sm"
                                        >
                                            {column.render ? column.render(user) : user[column.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

UsersTable.propTypes = {
    users: PropTypes.array.isRequired,
    title: PropTypes.string,
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            header: PropTypes.string.isRequired,
            render: PropTypes.func,
        })
    ).isRequired,
    onRowClick: PropTypes.func,
    emptyMessage: PropTypes.string,
    className: PropTypes.string,
};

export default UsersTable;