import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiBriefcase, FiClock, FiTruck, FiAlertTriangle, FiPackage } from 'react-icons/fi';
import DashboardStatsGrid from '../../components/Dashboard/DashboardStatsGrid';
import ErrorMessage from '../../components/common/ErrorMessage';
import DashboardHeader from '../../components/Dashboard/DashboardHeader';

const CoordinatorDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        activeJobs: 0,
        unassignedJobs: 0,
        pendingPartsRequests: 0,
        overdueJobs: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError('');

            const [jobsRes, partsRequestsRes] = await Promise.all([
                axios.get('http://localhost:5000/jobs', {
                    params: {
                        status: ['New', 'Assigned', 'In Progress', 'On Hold']
                    },
                    headers: { Authorization: `Bearer ${user.token}` }
                }),
                axios.get('http://localhost:5000/parts_requests', {
                    params: {
                        status: 'Pending'
                    },
                    headers: { Authorization: `Bearer ${user.token}` }
                })
            ]);

            const jobs = jobsRes.data.jobs || jobsRes.data || [];
            const partsRequests = partsRequestsRes.data.partsRequests || partsRequestsRes.data || [];

            // Calculate stats
            const activeJobs = jobs.length;
            const unassignedJobs = jobs.filter(job => !job.assignedTo).length;
            const pendingPartsRequests = partsRequests.length;
            const overdueJobs = jobs.filter(job =>
                job.due_date && new Date(job.due_date) < new Date() &&
                !['Closed', 'Cancelled'].includes(job.status)
            ).length;

            setStats({
                activeJobs,
                unassignedJobs,
                pendingPartsRequests,
                overdueJobs
            });

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch dashboard data');
            console.error('Dashboard error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleStatClick = (stat) => {
        if (stat.path) {
            navigate(stat.path);
        }
    };

    const statsData = [
        {
            title: 'Active Jobs',
            value: stats.activeJobs,
            icon: <FiBriefcase className="h-6 w-6" />,
            trend: stats.activeJobs > 10 ? 'up' : 'steady',
            className: 'bg-blue-50 text-blue-600',
            path: '/jobs'
        },
        {
            title: 'Unassigned Jobs',
            value: stats.unassignedJobs,
            icon: <FiAlertTriangle className="h-6 w-6" />,
            trend: stats.unassignedJobs > 3 ? 'up' : 'steady',
            className: 'bg-yellow-50 text-yellow-600',
            path: '/jobs?status=New'
        },
        {
            title: 'Pending Parts Requests',
            value: stats.pendingPartsRequests,
            icon: <FiPackage className="h-6 w-6" />,
            trend: stats.pendingPartsRequests > 5 ? 'up' : 'steady',
            className: 'bg-red-50 text-red-600',
            path: '/parts-requests?status=Pending'
        },
        {
            title: 'Overdue Jobs',
            value: stats.overdueJobs,
            icon: <FiClock className="h-6 w-6" />,
            trend: stats.overdueJobs > 0 ? 'up' : 'steady',
            className: 'bg-purple-50 text-purple-600',
            path: '/jobs?overdue=true'
        }
    ];

    if (error) return <ErrorMessage message={error} onRetry={fetchDashboardData} />;

    return (
        <div>
            <DashboardHeader />
            <div className="container mx-auto px-20 py-8">
                <DashboardStatsGrid stats={statsData} onStatClick={handleStatClick} />
            </div>
        </div>
    );
};

export default CoordinatorDashboard;