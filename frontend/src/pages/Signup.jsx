import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Alert from '../components/common/Alert';

const Signup = ({ isOpen, onClose }) => {
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
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('Please fill in all required fields');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        try {
            setLoading(true);
            const userData = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                role: formData.role,
                skills: formData.skills
            };

            const storedUser = localStorage.getItem('user');
            const token = storedUser ? JSON.parse(storedUser).token : null;
            if (!token) {
                setError('You are not authorized to perform this action. Please log in.');
                setLoading(false);
                return;
            }

            await axios.post(
                'http://localhost:5000/users',
                userData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            // Clear form and close modal
            setFormData({
                name: '',
                email: '',
                phone: '',
                password: '',
                confirmPassword: '',
                role: 'technician',
                skills: []
            });
            onClose();
            navigate('/users');

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create user');
            console.error('Signup error:', err);
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
        <Modal isOpen={isOpen} onClose={onClose} title="Create New User" size="md">
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
                        label="Password*"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Confirm Password*"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
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
                                        ×
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
                        {loading ? 'Creating...' : 'Create User'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default Signup;