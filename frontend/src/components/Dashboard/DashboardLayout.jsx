import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import './Dashboard.css';

const DashboardLayout = ({ children }) => {
    return (
        <>
            <DashboardHeader />
            <div className="dashboard-container">
                <DashboardSidebar />
                <div className="dashboard-content">
                    <Outlet />
                    {children}
                </div>
            </div>
        </>
    );
};

export default DashboardLayout;