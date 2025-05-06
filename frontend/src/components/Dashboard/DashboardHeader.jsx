// DashboardHeader.js
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/common/Modal';
import ProfileModal from '../../components/Profile/ProfileModal';
import './Dashboard.css';

const DashboardHeader = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsProfileModalOpen(false);
    };

    return (
        <header className="dashboard-header">
            <div className="header-search">
                <input type="text" placeholder="Search..." />
            </div>
            <div className="header-user">
                <span className="user-greeting">Hello, {user?.name}</span>
                <div
                    className="user-avatar-container"
                    onClick={() => setIsProfileModalOpen(true)}
                >
                    <div className="user-avatar">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                title="Profile"
                size="sm"
            >
                <ProfileModal
                    user={user}
                    onClose={() => setIsProfileModalOpen(false)}
                    onLogout={handleLogout}
                />
            </Modal>
        </header>
    );
};

export default DashboardHeader;