import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiMail, FiPhone, FiEdit2, FiTrash2, FiSave, FiX, FiChevronLeft } from 'react-icons/fi';
import ErrorMessage from '../../components/common/ErrorMessage';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import Button from '../../components/common/Button';

const ProfileCard = ({ user, isEditing, onEdit, onSave, onCancel, onChange }) => {
    return (
        <div className="bg-white text-black rounded-lg shadow p-6 mb-4">
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center">
                    <div className="h-16 w-16 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-2xl mr-4">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        {isEditing ? (
                            <input
                                type="text"
                                name="name"
                                value={user.name}
                                onChange={onChange}
                                className="text-xl font-semibold border-b border-gray-300 focus:border-blue-500 outline-none"
                            />
                        ) : (
                            <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
                        )}
                        <div className="flex items-center mt-1">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${user.isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {user.isOnline ? 'Online' : 'Offline'}
                            </span>
                        </div>
                    </div>
                </div>

                {isEditing ? (
                    <div className="flex space-x-2">
                        <Button onClick={onSave} variant="primary" size="sm">
                            <FiSave className="mr-1" /> Save
                        </Button>
                        <Button onClick={onCancel} variant="outline" size="sm">
                            <FiX className="mr-1" /> Cancel
                        </Button>
                    </div>
                ) : (
                    <Button onClick={onEdit} variant="outline" size="sm">
                        <FiEdit2 className="mr-1" /> Edit
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="flex items-center">
                        <FiMail className="text-gray-400 mr-3" />
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            {isEditing ? (
                                <input
                                    type="email"
                                    name="email"
                                    value={user.email}
                                    onChange={onChange}
                                    className="w-full border-b border-gray-300 focus:border-blue-500 outline-none"
                                />
                            ) : (
                                <p className="font-medium">{user.email}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center">
                        <FiPhone className="text-gray-400 mr-3" />
                        <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    name="phone"
                                    value={user.phone || ''}
                                    onChange={onChange}
                                    className="w-full border-b border-gray-300 focus:border-blue-500 outline-none"
                                />
                            ) : (
                                <p className="font-medium">{user.phone || 'Not provided'}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Role</p>
                        {isEditing ? (
                            <select
                                name="role"
                                value={user.role}
                                onChange={onChange}
                                className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 outline-none"
                            >
                                <option value="coordinator">Coordinator</option>
                                <option value="technician">Technician</option>
                                <option value="manager">Manager</option>
                                <option value="parts_team">Tarts_team</option>
                                <option value="admin">Admin</option>
                            </select>
                        ) : (
                            <p className="font-medium capitalize">{user.role.replace('_', ' ')}</p>
                        )}
                    </div>

                    <div>
                        <p className="text-sm text-gray-500 mb-1">Status</p>
                        {isEditing ? (
                            <select
                                name="isActive"
                                value={user.isActive ? 'true' : 'false'}
                                onChange={(e) => onChange({
                                    target: {
                                        name: 'isActive',
                                        value: e.target.value === 'true'
                                    }
                                })}
                                className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 outline-none"
                            >
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        ) : (
                            <p className="font-medium">{user.isActive ? 'Active' : 'Inactive'}</p>
                        )}
                    </div>
                </div>
            </div>

            {user.skills?.length > 0 && (
                <div className="mt-6">
                    <p className="text-sm text-gray-500 mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                        {user.skills.map((skill, i) => (
                            <span
                                key={i}
                                className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">Last Login</p>
                <p className="font-medium">
                    {user.last_login ? new Date(user.last_login).toLocaleString() : 'Never logged in'}
                </p>
            </div>
        </div>
    );
};

const UserProfile = () => {
    const { userId } = useParams();
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        message: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError('');

                // Add validation for the ID
                if (!userId || userId === 'undefined') {
                    throw new Error('Invalid user ID');
                    console.error('Invalid user ID:', id);
                }

                const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASED_URL}/users/${userId}`, {
                    headers: { Authorization: `Bearer ${currentUser.token}` }
                });

                setProfile(response.data);
                setEditData(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch profile');
                console.error('Profile fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId, currentUser.token]);

    if (!userId || userId === 'undefined') return <p className="text-center py-8">Loading user data...</p>;
    if (loading && !profile) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;
    if (!profile) return <p className="text-center py-8">User not found</p>;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            setLoading(true);

            const response = await axios.put(
                `${import.meta.env.VITE_REACT_APP_BACKEND_BASED_URL}/users/${userId}`,
                editData,
                { headers: { Authorization: `Bearer ${currentUser.token}` } }
            );

            setProfile(response.data);
            setIsEditing(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
            console.error('Profile update error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_BASED_URL}/users/${userId}`, {
                headers: { Authorization: `Bearer ${currentUser.token}` }
            });
            navigate('/users');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete user');
            console.error('User delete error:', err);
        }
    };

    const handleCancelEdit = () => {
        setEditData(profile);
        setIsEditing(false);
    };

    if (loading && !profile) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;
    if (!profile) return <p className="text-center py-8">User not found</p>;

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => navigate('/users')}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                >
                    <FiChevronLeft className="mr-1" /> Back to Users
                </button>

                {!isEditing && currentUser._id !== userId && (
                    <Button
                        onClick={() => setDeleteModal({
                            isOpen: true,
                            message: `Are you sure you want to delete ${profile.name}'s account? This action cannot be undone.`
                        })}
                        variant="danger"
                        size="sm"
                    >
                        <FiTrash2 className="mr-1" /> Delete User
                    </Button>
                )}
            </div>

            <ProfileCard
                user={isEditing ? editData : profile}
                isEditing={isEditing}
                onEdit={() => setIsEditing(true)}
                onSave={handleSave}
                onCancel={handleCancelEdit}
                onChange={handleInputChange}
            />

            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, message: '' })}
                onConfirm={handleDelete}
                title="Confirm Deletion"
                message={deleteModal.message}
                confirmText="Delete"
                confirmColor="red"
            />
        </div>
    );
};

export default UserProfile;