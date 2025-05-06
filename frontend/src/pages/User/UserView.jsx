import ViewComponent from '../../components/Dashboard/ViewSinglePage';

const userConfig = {
    status: {
        render: (user, isEditing, onChange) => (
            <>
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${user?.isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user?.isOnline ? 'Online' : 'Offline'}
                </span>
            </>
        )
    },
    sections: [
        {
            title: 'Personal Information',
            fields: [
                { name: 'name', label: 'Name', type: 'text' },
                { name: 'email', label: 'Email', type: 'email' },
                { name: 'phone', label: 'Phone', type: 'tel' }
            ]
        },
        {
            title: 'Account Information',
            fields: [
                {
                    name: 'role',
                    label: 'Role',
                    type: 'select',
                    options: [
                        { value: 'coordinator', label: 'Coordinator' },
                        { value: 'technician', label: 'Technician' },
                        { value: 'manager', label: 'Manager' },
                        { value: 'parts_team', label: 'Parts Team' },
                        { value: 'admin', label: 'Admin' }
                    ]
                }

            ]
        }
    ],
    additionalSections: [
        {
            title: 'Skills',
            render: (user) => (
                <div className="flex flex-wrap gap-2">
                    {user.skills?.map((skill, i) => (
                        <span key={i} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                            {skill}
                        </span>
                    ))}
                </div>
            )
        }
    ]
};

const UserView = ({ userRole }) => (
    <ViewComponent
        apiPath={`${import.meta.env.VITE_REACT_APP_BACKEND_BASED_URL}/users`}
        config={userConfig}
        titleKey="user"
        deleteMessage={(user) => `Are you sure you want to delete ${user?.name || 'this user'}'s account? This action cannot be undone.`}
    />
);

export default UserView;