import ViewComponent from '../../components/Dashboard/ViewSinglePage';
import axios from 'axios';
import { FiCalendar, FiClock, FiUser, FiTool, FiAlertTriangle, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const jobConfig = {
    status: {
        render: (job) => {
            const priorityColors = {
                'Low': 'bg-green-100 text-green-800',
                'Medium': 'bg-yellow-100 text-yellow-800',
                'High': 'bg-orange-100 text-orange-800',
                'Critical': 'bg-red-100 text-red-800'
            };

            const statusIcons = {
                'Pending Assignment': <FiClock className="text-yellow-500 mr-1" />,
                'Assigned': <FiUser className="text-blue-500 mr-1" />,
                'In Progress': <FiTool className="text-orange-500 mr-1" />,
                'On Hold': <FiAlertTriangle className="text-red-500 mr-1" />,
                'Completed': <FiCheckCircle className="text-green-500 mr-1" />,
                'Cancelled': <FiXCircle className="text-gray-500 mr-1" />
            };

            return (
                <div className="flex items-center text-black">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[job.priority]}`}>
                        {job.priority} Priority
                    </span>
                    <span className="ml-2 flex items-center">
                        {statusIcons[job.status]}
                        <span className="text-xs font-medium">{job.status}</span>
                    </span>
                </div>
            );
        }
    },
    sections: [
        {
            title: 'Job Details',
            fields: [
                { name: 'description', label: 'Description', type: 'textarea' },
                {
                    name: 'status',
                    label: 'Status',
                    type: 'select',
                    options: [
                        { value: 'Pending Assignment', label: 'Pending Assignment' },
                        { value: 'Assigned', label: 'Assigned' },
                        { value: 'In Progress', label: 'In Progress' },
                        { value: 'On Hold', label: 'On Hold' },
                        { value: 'Device Collected', label: 'Device Collected' },
                        { value: 'Awaiting Workshop Repair', label: 'Awaiting Workshop Repair' },
                        { value: 'Ready to Close', label: 'Ready to Close' },
                        { value: 'Pending Closure', label: 'Pending Closure' },
                        { value: 'Closed', label: 'Closed' },
                        { value: 'Reopened', label: 'Reopened' },
                        { value: 'Cancelled', label: 'Cancelled' }
                    ],
                },
                {
                    name: 'priority',
                    label: 'Priority',
                    type: 'select',
                    options: [
                        { value: 'Low', label: 'Low' },
                        { value: 'Medium', label: 'Medium' },
                        { value: 'High', label: 'High' },
                        { value: 'Urgent', label: 'Urgent' }
                    ]
                }
            ]
        },
        {
            title: 'Assignment',
            fields: [
                {
                    name: 'assigned_to',
                    label: 'Assigned Technician',
                    type: 'select',
                    options: (job) => job.techniciansList?.map(tech => ({
                        value: tech._id,
                        label: `${tech.name} (${tech.email})`
                    })) || []
                }
            ]
        }
    ],
    additionalSections: [
        {
            title: 'Scheduling',
            render: (job, isEditing, onChange) => (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                        <FiCalendar className="text-gray-400 mr-3" />
                        <div>
                            <p className="text-sm text-gray-500">Scheduled Date</p>
                            {isEditing ? (
                                <input
                                    type="datetime-local"
                                    name="scheduled_date"
                                    value={job.scheduled_date ? new Date(job.scheduled_date).toISOString().slice(0, 16) : ''}
                                    onChange={onChange}
                                    className="w-full border-b border-gray-300 focus:border-blue-500 outline-none"
                                />
                            ) : (
                                <p className="font-medium">
                                    {job.scheduled_date ? new Date(job.scheduled_date).toLocaleString() : 'Not scheduled'}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center">
                        <FiClock className="text-gray-400 mr-3" />
                        <div>
                            <p className="text-sm text-gray-500">SLA Deadline</p>
                            <p className="font-medium">
                                {job.sla_deadline ? new Date(job.sla_deadline).toLocaleString() : 'No deadline'}
                            </p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: 'Customer Information',
            render: (job) => (
                job.customer_id ? (
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full">
                            <FiUser className="text-blue-600" />
                        </div>
                        <div>
                            <p className="font-medium">{job.customer_id.name}</p>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                                <FiUser className="mr-1" />
                                <span>{job.customer_id.contact_phone || 'No phone'}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                                <FiUser className="mr-1" />
                                <span>{job.customer_id.email || 'No email'}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="font-medium">No customer assigned</p>
                )
            )
        },
        {
            title: 'Device Information',
            render: (job) => (
                job.device_id ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Device Type</p>
                            <p className="font-medium">{job.device_id.device_type || 'Unknown'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Serial Number</p>
                            <p className="font-medium">{job.device_id.serial_number || 'Unknown'}</p>
                        </div>
                    </div>
                ) : (
                    <p className="font-medium">No device assigned</p>
                )
            )
        },
        {
            title: 'Required Skills',
            render: (job) => (
                job.required_skill_set?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {job.required_skill_set.map((skill, i) => (
                            <span key={i} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                                {skill}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="font-medium">No specific skills required</p>
                )
            )
        }
    ],
    fetchAdditionalData: async (apiPath, id, token) => {
        try {
            // Fetch job with populated fields
            const jobResponse = await axios.get(`${apiPath}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Fetch technicians for assignment dropdown
            const techResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASED_URL}/users?role=technician`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // console.log(jobResponse.data)
            return {
                ...jobResponse.data,
                techniciansList: techResponse.data || []
            };
            console.log(techResponse);
        } catch (err) {
            console.error('Error fetching job data:', err);
            throw err;
        }
    },
    prepareDataForSubmission: (data) => ({
        ...data,
        assigned_to: data.assigned_to?._id || data.assigned_to || null,
        device_id: data.device_id?._id || data.device_id || null,
        customer_id: data.customer_id?._id || data.customer_id || null
    })
};

const ViewJob = () => (
    <ViewComponent
        backRoute="/jobs"
        apiPath={`${import.meta.env.VITE_REACT_APP_BACKEND_BASED_URL}/jobs`}
        config={jobConfig}
        titleKey="job"
        deleteMessage={(job) => `Are you sure you want to delete Job #${job.job_number}? This action cannot be undone.`}
    />
);

export default ViewJob;