import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext/';

const DashboardSidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');

    };

    return (
        <aside className="dashboard-sidebar">
            <div className="sidebar-header">
                <p>{user?.role} Dashboard</p>
            </div>
            <nav className="sidebar-nav">
                <ul>
                    {user?.role === 'admin' && (
                        <>
                            <li>
                                <NavLink to="/users/" className={({ isActive }) => isActive ? 'active' : ''}>
                                    User Management
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/dashboard/reports" className={({ isActive }) => isActive ? 'active' : ''}>
                                    Reports
                                </NavLink>
                            </li>
                        </>
                    )}
                    {user?.role === 'technician' && (
                        <li>
                            <NavLink to="/dashboard/assigned-tasks" className={({ isActive }) => isActive ? 'active' : ''}>
                                Assigned Tasks
                            </NavLink>
                        </li>
                    )}
                </ul>
            </nav>
            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-button">
                    Log Out
                </button>
            </div>
        </aside>
    );
};

export default DashboardSidebar;