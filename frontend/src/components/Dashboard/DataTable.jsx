import React from 'react';
import PropTypes from 'prop-types';
import LoadingSpinner from '../common/LoadingSpinner';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const DataTable = ({
    data,
    columns,
    loading,
    page,
    limit,
    totalCount,
    onPageChange,
    rowActions,
}) => {
    if (loading && data.length === 0) return <LoadingSpinner />;
    if (data.length === 0) return <p className="text-gray-500 py-4">No data found</p>;

    return (
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
                        {rowActions && (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((item, rowIndex) => (
                        <tr key={item._id || rowIndex} className="hover:bg-gray-50">
                            {columns.map((column) => (
                                <td key={`${column.key}-${rowIndex}`} className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {typeof column.accessor === 'function'
                                            ? column.accessor(item)
                                            : item[column.accessor]}
                                    </div>
                                </td>
                            ))}
                            {rowActions && (
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                        {rowActions.map((action, actionIndex) => (
                                            <button
                                                key={actionIndex}
                                                onClick={() => action.onClick(item)}
                                                className={`${action.className}`}
                                                title={action.title}
                                            >
                                                {action.icon}
                                            </button>
                                        ))}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-between items-center px-6 py-3 bg-white border-t border-gray-200">
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FiChevronLeft className="h-5 w-5" />
                </button>
                <span className="text-sm text-gray-700">
                    Page {page} of {Math.ceil(totalCount / limit)}
                </span>
                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={data.length < limit || page * limit >= totalCount}
                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FiChevronRight className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

DataTable.propTypes = {
    data: PropTypes.array.isRequired,
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            header: PropTypes.string.isRequired,
            accessor: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
        })
    ).isRequired,
    loading: PropTypes.bool,
    page: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
    totalCount: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    rowActions: PropTypes.arrayOf(
        PropTypes.shape({
            icon: PropTypes.node.isRequired,
            title: PropTypes.string.isRequired,
            className: PropTypes.string.isRequired,
            onClick: PropTypes.func.isRequired,
        })
    ),
};

export default DataTable;