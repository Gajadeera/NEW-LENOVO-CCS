import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    FiBriefcase,
    FiPlus,
    FiChevronRight,
    FiChevronLeft,
    FiAlertTriangle,
    FiClock,
    FiCheckCircle
} from 'react-icons/fi';
import ErrorMessage from '../../components/common/ErrorMessage';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import CreateJobModal from './CreateJobModal';


const JobCard = ({ job, onClick }) => {
    const getPriorityColor = () => {
        switch (job.priority) {
            case 'High':
            case 'Urgent':
                return 'bg-red-100 text-red-800';
            case 'Medium':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-green-100 text-green-800';
        }
    };

    const getStatusColor = () => {
        switch (job.status) {
            case 'Closed':
                return 'bg-green-100 text-green-800';
            case 'In Progress':
                return 'bg-blue-100 text-blue-800';
            case 'Assigned':
                return 'bg-yellow-100 text-yellow-800';
            case 'On Hold':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow mb-4"
            onClick={onClick}
        >
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {job.title || `Job #${job.job_number || job._id.slice(-6)}`}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor()}`}>
                            {job.priority}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{job.description?.substring(0, 100)}{job.description?.length > 100 ? '...' : ''}</p>
                    <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
                            {job.status}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center">
                            <FiClock className="mr-1" />
                            {new Date(job.created_at).toLocaleDateString()}
                        </span>
                        {job.assigned_to && (
                            <span className="text-sm text-gray-500">
                                Assigned to: {job.assigned_to.name}
                            </span>
                        )}
                    </div>
                </div>
                <FiChevronRight className="text-gray-400 ml-4" />
            </div>
        </div>
    );
};

const JobList = () => {
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalJobs: 0,
        activeJobs: 0,
        highPriority: 0,
        completedJobs: 0
    });
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        status: '',
        priority: ''
    });
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            setError('');

            const params = {
                page: filters.page,
                limit: filters.limit,
                sort: '-created_at'
            };
            if (filters.status) params.status = filters.status;
            if (filters.priority) params.priority = filters.priority;

            const response = await axios.get('http://localhost:5000/jobs', {
                params,
                headers: { Authorization: `Bearer ${currentUser.token}` }
            });

            const jobsData = response.data.jobs || response.data;
            setJobs(jobsData);
            updateStats(jobsData);

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch jobs');
            console.error('Jobs fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateStats = (jobsData) => {
        const activeCount = jobsData.filter(j =>
            ['Assigned', 'In Progress', 'On Hold'].includes(j.status)
        ).length;
        const highPriorityCount = jobsData.filter(j =>
            ['High', 'Urgent'].includes(j.priority)
        ).length;
        const completedCount = jobsData.filter(j =>
            j.status === 'Closed'
        ).length;

        setStats({
            totalJobs: jobsData.length,
            activeJobs: activeCount,
            highPriority: highPriorityCount,
            completedJobs: completedCount
        });
    };

    useEffect(() => {
        fetchJobs();
    }, [filters]);

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({ ...prev, [filterType]: value, page: 1 }));
    };

    const handleJobClick = (jobId) => {
        if (!jobId) {
            console.error('Job ID is undefined');
            return;
        }
        navigate(`/jobs/${jobId}`);
    };

    if (error) return <ErrorMessage message={error} onRetry={fetchJobs} />;

    return (
        <div className="container mx-auto px-4 py-8">
            <button
                onClick={() => navigate('/')}
                className="flex items-center text-blue-600 hover:text-blue-800"
            >
                <FiChevronLeft className="mr-1" /> Back to Home
            </button>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Job Management</h1>
                <p className="">View and manage all service jobs</p>
            </div>

            {/* Stats Cards and Add Job Button */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Jobs</p>
                            <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.totalJobs}</p>
                        </div>
                        <div className="p-3 rounded-full bg-blue-50 text-blue-500">
                            <FiBriefcase className="h-6 w-6" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Active Jobs</p>
                            <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.activeJobs}</p>
                        </div>
                        <div className="p-3 rounded-full bg-yellow-50 text-yellow-500">
                            <FiClock className="h-6 w-6" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">High Priority</p>
                            <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.highPriority}</p>
                        </div>
                        <div className="p-3 rounded-full bg-red-50 text-red-500">
                            <FiAlertTriangle className="h-6 w-6" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center">
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center px-6 py-3 text-black rounded-md transition-colors w-full justify-center"
                    >
                        <FiPlus className="mr-2" />
                        Create New Job
                    </button>
                    <CreateJobModal
                        isOpen={isCreateModalOpen}
                        onClose={() => setIsCreateModalOpen(false)}
                        onSuccess={() => {
                            setIsCreateModalOpen(false);
                            fetchJobs();
                        }}
                        currentUser={currentUser}
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex flex-wrap items-center gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm text-black"
                        >
                            <option value="">All Statuses</option>
                            <option value="Pending Assignment">Pending Assignment</option>
                            <option value="Assigned">Assigned</option>
                            <option value="In Progress">In Progress</option>
                            <option value="On Hold">On Hold</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <select
                            value={filters.priority}
                            onChange={(e) => handleFilterChange('priority', e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm text-black"
                        >
                            <option value="">All Priorities</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Urgent">Urgent</option>
                        </select>
                    </div>
                    <button
                        onClick={() => setFilters({ page: 1, limit: 10, status: '', priority: '' })}
                        className="mt-6 text-sm text-blue-600 hover:text-blue-800"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Jobs List */}
            {loading && jobs.length === 0 ? (
                <div className="p-8">
                    <LoadingSpinner />
                </div>
            ) : jobs.length === 0 ? (
                <p className="text-gray-500 py-8 text-center">No jobs found</p>
            ) : (
                <>
                    <div className="space-y-4 mb-8">
                        {jobs.map((job) => (
                            <JobCard
                                key={job._id}
                                job={job}
                                onClick={() => handleJobClick(job._id)}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center bg-white rounded-lg shadow px-6 py-4">
                        <button
                            onClick={() => handlePageChange(filters.page - 1)}
                            disabled={filters.page <= 1}
                            className={`px-4 py-2 rounded-md ${filters.page <= 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-700">
                            Page {filters.page}
                        </span>
                        <button
                            onClick={() => handlePageChange(filters.page + 1)}
                            disabled={jobs.length < filters.limit}
                            className={`px-4 py-2 rounded-md ${jobs.length < filters.limit ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default JobList;