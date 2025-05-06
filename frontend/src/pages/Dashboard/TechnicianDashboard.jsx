import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FiBriefcase, FiAlertCircle, FiPackage, FiCheckCircle } from 'react-icons/fi';
import DashboardStatsGrid from '../../components/Dashboard/DashboardStatsGrid';
import ErrorMessage from '../../components/common/ErrorMessage';
import DashboardHeader from '../../components/Dashboard/DashboardHeader';
import JobsTable from '../../components/Job/JobsTable'; // Import the new component

const TechnicianDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        assignedJobs: 0,
        overdueJobs: 0,
        pendingParts: 0,
        completedThisWeek: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [assignedJobs, setAssignedJobs] = useState([]);
    const [overdueJobs, setOverdueJobs] = useState([]);
    const [pendingParts, setPendingParts] = useState([]);
    const [completedJobs, setCompletedJobs] = useState([]);
    const [activeTable, setActiveTable] = useState(null);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError('');

            const [
                assignedJobsRes,
                overdueJobsRes,
                pendingPartsRes,
                completedJobsRes
            ] = await Promise.all([
                axios.get('http://localhost:5000/jobs', {
                    params: {
                        assigned_to: user._id,
                        status_ne: 'Closed'
                    },
                    headers: { Authorization: `Bearer ${user.token}` }
                }),
                axios.get('http://localhost:5000/jobs', {
                    params: {
                        assigned_to: user._id,
                        status: 'In Progress'
                    },
                    headers: { Authorization: `Bearer ${user.token}` }
                }),
                axios.get('http://localhost:5000/parts_requests', {
                    params: {
                        status: 'Pending',
                        requestedFor: user._id
                    },
                    headers: { Authorization: `Bearer ${user.token}` }
                }),
                axios.get('http://localhost:5000/jobs', {
                    params: {
                        assigned_to: user._id,
                        status: 'Closed'
                        // completed_after: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
                    },
                    headers: { Authorization: `Bearer ${user.token}` }
                })
            ]);

            // Set all job data
            setAssignedJobs(assignedJobsRes.data.jobs || assignedJobsRes.data || []);
            setOverdueJobs(overdueJobsRes.data.jobs || overdueJobsRes.data || []);
            setPendingParts(pendingPartsRes.data.partsRequests || pendingPartsRes.data || []);
            setCompletedJobs(completedJobsRes.data.jobs || completedJobsRes.data || []);

            // Calculate stats
            setStats({
                assignedJobs: assignedJobsRes.data.jobs.length,  // Now getting the length of the array
                overdueJobs: overdueJobsRes.data.jobs.length,
                pendingParts: pendingParts.length,
                completedThisWeek: completedJobsRes.data.jobs.length
            });

            console.log(completedJobs.length);
            // console.log(assignedJobs);

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch dashboard data');
            console.error('Dashboard error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [user._id]);

    const handleStatClick = (stat) => {
        setActiveTable(activeTable === stat.title ? null : stat.title);
    };

    const commonColumns = [
        {
            key: 'job_number',
            header: 'Job Number',
            render: (job) => job.job_number || job._id.substring(0, 8)
        },
        {
            key: 'description',
            header: 'Description',
            render: (job) => job.description || 'N/A'
        },
        {
            key: 'customer',
            header: 'Customer',
            render: (job) => job.customer_id?.name || 'N/A'
        },
        {
            key: 'scheduled_date',
            header: 'Due Date',
            render: (job) => job.scheduled_date ? new Date(job.scheduled_date).toLocaleDateString() : 'Not set'
        },
        {
            key: 'status',
            header: 'Status',
            render: (job) => (
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${job.status === 'Assigned' ? 'bg-blue-100 text-blue-800' :
                        job.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'}`}>
                    {job.status}
                </span>
            )
        }
    ];

    const partsColumns = [
        {
            key: 'part_name',
            header: 'Part Name'
        },
        {
            key: 'quantity',
            header: 'Quantity'
        },
        {
            key: 'requested_date',
            header: 'Requested Date',
            render: (part) => new Date(part.requested_date).toLocaleDateString()
        },
        {
            key: 'status',
            header: 'Status',
            render: (part) => (
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${part.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        part.status === 'Approved' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'}`}>
                    {part.status}
                </span>
            )
        }
    ];

    const statsData = [
        {
            title: 'Assigned Jobs',
            value: stats.assignedJobs,
            icon: <FiBriefcase className="h-6 w-6" />,
            trend: stats.assignedJobs > 5 ? 'up' : 'steady',
            className: 'bg-blue-50 text-blue-600'
        },
        {
            title: 'Overdue Jobs',
            value: stats.overdueJobs,
            icon: <FiAlertCircle className="h-6 w-6" />,
            trend: stats.overdueJobs > 0 ? 'up' : 'steady',
            className: 'bg-red-50 text-red-600'
        },
        {
            title: 'Pending Parts',
            value: stats.pendingParts,
            icon: <FiPackage className="h-6 w-6" />,
            trend: stats.pendingParts > 2 ? 'up' : 'steady',
            className: 'bg-yellow-50 text-yellow-600'
        },
        {
            title: 'Completed This Week',
            value: stats.completedThisWeek,
            icon: <FiCheckCircle className="h-6 w-6" />,
            trend: 'steady',
            className: 'bg-green-50 text-green-600'
        }
    ];

    if (error) return <ErrorMessage message={error} onRetry={fetchDashboardData} />;

    return (
        <div>
            <DashboardHeader />
            <div className="container mx-auto px-20 py-8">
                <DashboardStatsGrid stats={statsData} onStatClick={handleStatClick} />

                {activeTable === 'Assigned Jobs' && (
                    <JobsTable
                        jobs={assignedJobs}
                        title="Your Assigned Jobs"
                        columns={commonColumns}
                    />
                )}

                {activeTable === 'Overdue Jobs' && (
                    <JobsTable
                        jobs={overdueJobs}
                        title="Your Overdue Jobs"
                        columns={commonColumns}
                    />
                )}

                {activeTable === 'Pending Parts' && (
                    <JobsTable
                        jobs={pendingParts}
                        title="Your Pending Parts Requests"
                        columns={partsColumns}
                        emptyMessage="No pending parts requests found"
                    />
                )}

                {activeTable === 'Completed This Week' && (
                    <JobsTable
                        jobs={completedJobs}
                        title="Jobs Completed This Week"
                        columns={commonColumns}
                        emptyMessage="No jobs completed this week"
                    />
                )}
            </div>
        </div>
    );
};

export default TechnicianDashboard;