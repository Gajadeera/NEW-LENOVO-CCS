import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiEdit2, FiTrash2, FiSave, FiX, FiChevronLeft, FiClock, FiCalendar, FiInfo } from 'react-icons/fi';
import ErrorMessage from '../common/ErrorMessage';
import LoadingSpinner from '../common/LoadingSpinner';
import ConfirmationModal from '../common/ConfirmationModal';
import Button from '../common/Button';
import Card from '../common/Card';

const ViewComponent = ({
    backRoute,
    apiPath,
    config,
    titleKey,
    deleteMessage,
    defaultData
}) => {
    const { id } = useParams();
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(defaultData || {});
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        message: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');

                if (!id || id === 'undefined') {
                    throw new Error(`Invalid ${titleKey} ID`);
                }

                if (config.fetchAdditionalData) {
                    const additionalData = await config.fetchAdditionalData(
                        apiPath,
                        id,
                        currentUser.token
                    );
                    setData(additionalData);
                    setEditData(additionalData);
                } else {
                    const response = await axios.get(`${apiPath}/${id}`, {
                        headers: { Authorization: `Bearer ${currentUser.token}` }
                    });
                    setData(response.data);
                    setEditData(response.data);
                }
            } catch (err) {
                const errorMsg = err.response?.data?.message ||
                    err.message ||
                    `Failed to fetch ${titleKey} details`;
                console.error(`${titleKey} fetch error:`, err);
                setError(errorMsg);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, currentUser.token, apiPath, titleKey, config]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setEditData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setEditData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const submissionData = config.prepareDataForSubmission
                ? config.prepareDataForSubmission(editData)
                : editData;

            const response = await axios.put(
                `${apiPath}/${id}`,
                submissionData,
                { headers: { Authorization: `Bearer ${currentUser.token}` } }
            );

            setData(response.data);
            setIsEditing(false);
        } catch (err) {
            setError(err.response?.data?.message || `Failed to update ${titleKey}`);
            console.error(`${titleKey} update error:`, err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${apiPath}/${id}`, {
                headers: { Authorization: `Bearer ${currentUser.token}` }
            });
            navigate(backRoute);
        } catch (err) {
            setError(err.response?.data?.message || `Failed to delete ${titleKey}`);
            console.error(`${titleKey} delete error:`, err);
        }
    };

    const handleCancelEdit = () => {
        setEditData(data);
        setIsEditing(false);
    };

    const renderField = (field) => {
        const { name, label, type, options, render } = field;

        const getValue = (obj, path) => {
            return path.split('.').reduce((o, p) => (o || {})[p], obj);
        };

        const value = name.includes('.') ? getValue(editData, name) : editData[name];

        if (render) {
            return render(data, isEditing, handleInputChange);
        }

        if (isEditing) {
            if (type === 'select' && options) {
                const selectOptions = typeof options === 'function' ? options(data) : options;

                return (
                    <select
                        name={name}
                        value={value?._id || value || ''}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="">Select...</option>
                        {selectOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );
            }

            if (type === 'textarea') {
                return (
                    <textarea
                        name={name}
                        value={value || ''}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        rows="2"
                    />
                );
            }

            if (type === 'date') {
                return (
                    <input
                        type="date"
                        name={name}
                        value={value ? value.split('T')[0] : ''}
                        onChange={handleInputChange}
                        className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                );
            }

            return (
                <input
                    type={type || 'text'}
                    name={name}
                    value={value || ''}
                    onChange={handleInputChange}
                    className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
            );
        }

        // Display mode
        if (value && typeof value === 'object') {
            return <span className="text-sm text-gray-700">{value.name || value._id || '-'}</span>;
        }

        if (type === 'date' && value) {
            return (
                <div className="flex items-center text-sm text-gray-700">
                    <FiCalendar className="mr-1" />
                    {new Date(value).toLocaleDateString()}
                </div>
            );
        }

        return <span className="text-sm text-gray-700">{value || '-'}</span>;
    };

    if (!id || id === 'undefined') return (
        <div className="max-w-4xl mx-auto p-2 text-center py-4">
            <FiInfo className="inline mr-2" />
            Loading {titleKey} data...
        </div>
    );

    if (loading && !data) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;
    if (!data) return (
        <div className="max-w-4xl mx-auto p-2 text-center py-4">
            <FiInfo className="inline mr-2" />
            {titleKey} not found
        </div>
    );

    const userRole = currentUser.role;
    console.log(userRole);

    return (
        <div className="max-w-4xl mx-auto p-2 space-y-3">
            <div className="flex justify-between items-center py-4">
                <button
                    onClick={() => navigate(`/${userRole}Dashboard`)}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800 bg-white px-3 py-1 rounded-md border border-blue-200 hover:border-blue-300"
                >
                    <FiChevronLeft className="mr-1" /> Back to Dashboard
                </button>

                <div className="flex space-x-2">
                    {!isEditing && userRole !== "technician" && (
                        <Button
                            onClick={() => setDeleteModal({
                                isOpen: true,
                                message: deleteMessage(data)
                            })}
                            variant="danger"
                            size="xs"
                        >
                            <FiTrash2 className="mr-1" /> Delete
                        </Button>
                    )}
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleSave}
                                className="flex items-center text-sm text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md border border-green-600 hover:border-green-700"
                            >
                                <FiSave className="mr-1" /> Save
                            </button>
                            <button
                                onClick={handleCancelEdit}
                                className="flex items-center text-sm text-gray-700 bg-white hover:bg-gray-50 px-3 py-1 rounded-md border border-gray-300 hover:border-gray-400"
                            >
                                <FiX className="mr-1" /> Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center text-sm text-blue-600 bg-white hover:bg-blue-50 px-3 py-1 rounded-md border border-blue-200 hover:border-blue-300"
                        >
                            <FiEdit2 className="mr-1" /> Edit
                        </button>
                    )}
                </div>
            </div>

            <Card
                title={`${titleKey} ${data[titleKey === 'user' ? 'name' : titleKey === 'job' ? 'job_number' : titleKey === 'device' ? 'model_number' : 'id']}`}
                headerClassName="flex items-center justify-between py-2"
                bodyClassName="space-y-4"
            >
                <div className="flex justify-between items-center">
                    {config.status && (
                        <div className="flex items-center text-sm">
                            {config.status.render(data, isEditing, handleInputChange)}
                        </div>
                    )}


                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {config.sections.map((section, index) => (
                        <div key={index} className="space-y-3">
                            <h3 className="text-sm font-medium text-gray-600 flex items-center">
                                <FiInfo className="mr-1" /> {section.title}
                            </h3>
                            <div className="space-y-2">
                                {section.fields.map((field, fieldIndex) => (
                                    <div key={fieldIndex} className="flex items-start text-sm">
                                        <p className="text-gray-500 w-1/3">{field.label}</p>
                                        <div className="w-2/3">
                                            {renderField(field)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {config.additionalSections?.map((section, index) => (
                    <div key={`additional-${index}`} className="mt-4">
                        <h3 className="text-sm font-medium text-gray-600 flex items-center">
                            <FiInfo className="mr-1" /> {section.title}
                        </h3>
                        <div className="mt-1">
                            {section.render(data, isEditing, handleInputChange)}
                        </div>
                    </div>
                ))}

                <div className="pt-4 mt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center text-gray-500">
                        <FiClock className="mr-1" />
                        <span className="w-1/3">Created</span>
                        <span className="text-gray-700">
                            {new Date(data.created_at).toLocaleString()}
                        </span>
                    </div>
                    <div className="flex items-center text-gray-500">
                        <FiCalendar className="mr-1" />
                        <span className="w-1/3">Updated</span>
                        <span className="text-gray-700">
                            {new Date(data.updated_at).toLocaleString()}
                        </span>
                    </div>
                </div>
            </Card>

            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, message: '' })}
                onConfirm={handleDelete}
                title={`Confirm ${titleKey} Deletion`}
                message={deleteModal.message}
                confirmText="Delete"
                confirmColor="red"
            />
        </div>
    );
};

export default ViewComponent;