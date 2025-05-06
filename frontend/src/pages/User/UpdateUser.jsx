import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { XMarkIcon } from '@heroicons/react/24/outline';

const UpdateUser = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const { userId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'technician',
        skills: []
    });
    const [currentSkill, setCurrentSkill] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASED_URL}/users/${userId}`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });

                const resUser = response.data;
                if (!resUser) {
                    setError('User not found');
                    return;
                }

                setFormData({
                    name: resUser.name,
                    email: resUser.email,
                    phone: resUser.phone || '',
                    password: '',
                    confirmPassword: '',
                    role: resUser.role,
                    skills: resUser.skills || []
                });

            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch user');
                console.error('Fetch user error:', err);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen && userId) {
            fetchUser();
        }
    }, [userId, user.token, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddSkill = () => {
        if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, currentSkill.trim()]
            }));
            setCurrentSkill('');
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.name || !formData.email || !formData.role) {
            setError('Please fill in all required fields');
            return;
        }

        if (formData.password && formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password && formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        try {
            setLoading(true);
            const userData = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                role: formData.role,
                skills: formData.skills
            };

            // Only include password if it was changed
            if (formData.password) {
                userData.password = formData.password;
            }

            await axios.put(
                `${import.meta.env.VITE_REACT_APP_BACKEND_BASED_URL}/users/${userId}`,
                userData,
                {
                    headers: { Authorization: `Bearer ${user.token}` }
                }
            );
            onClose();
            navigate('/users');

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update user');
            console.error('Update user error:', err);
        } finally {
            setLoading(false);
        }
    };

    const roleOptions = [
        { value: 'technician', label: 'Technician' },
        { value: 'coordinator', label: 'Coordinator' },
        { value: 'manager', label: 'Manager' },
        { value: 'parts_team', label: 'Parts Team' },
        { value: 'admin', label: 'Admin' }
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit User" size="md">
            {error && (
                <Alert type="error" message={error} className="mb-4" />
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input
                        label="Name*"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Email*"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                    <Select
                        label="Role*"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        options={roleOptions}
                        required
                    />
                    <Input
                        label="New Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Leave blank to keep current"
                    />
                    <Input
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Leave blank to keep current"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                    <div className="flex gap-2 mb-2">
                        <Input
                            value={currentSkill}
                            onChange={(e) => setCurrentSkill(e.target.value)}
                            placeholder="Add a skill"
                            className="flex-1"
                            noLabel
                        />
                        <Button
                            type="button"
                            onClick={handleAddSkill}
                            variant="secondary"
                            size="sm"
                        >
                            Add
                        </Button>
                    </div>
                    {formData.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {formData.skills.map((skill, index) => (
                                <Badge
                                    key={index}
                                    variant="secondary"
                                    className="flex items-center"
                                >
                                    {skill}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSkill(skill)}
                                        className="ml-1 text-gray-600 hover:text-gray-800"
                                    >
                                        <XMarkIcon className="h-4 w-4" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <Button
                        type="button"
                        onClick={onClose}
                        variant="outline"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        loading={loading}
                    >
                        {loading ? 'Updating...' : 'Update User'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default UpdateUser;