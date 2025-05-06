// components/ProfileModal.js
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiMail, FiPhone, FiLogOut } from 'react-icons/fi';
import Button from '../../components/common/Button';

const ProfileModal = ({ user, onClose, onLogout }) => {
    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div className="flex items-center">
                    <div className="h-16 w-16 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-2xl mr-4">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
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
            </div>

            <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center">
                    <FiMail className="text-gray-400 mr-3" />
                    <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{user.email}</p>
                    </div>
                </div>

                <div className="flex items-center">
                    <FiPhone className="text-gray-400 mr-3" />
                    <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{user.phone || 'Not provided'}</p>
                    </div>
                </div>

                <div className="flex items-center">
                    <FiUser className="text-gray-400 mr-3" />
                    <div>
                        <p className="text-sm text-gray-500">Role</p>
                        <p className="font-medium capitalize">{user.role.replace('_', ' ')}</p>
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
                <Button
                    onClick={onLogout}
                    variant="danger"
                    className="w-full"
                >
                    <FiLogOut className="mr-2" />
                    Log Out
                </Button>
            </div>
        </div>
    );
};

export default ProfileModal;