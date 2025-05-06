import ViewComponent from '../../components/Dashboard/ViewSinglePage';
import axios from 'axios';

const deviceConfig = {
    status: {
        render: (device) => (
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${device?.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {device?.isActive ? 'Active' : 'Inactive'}
            </span>
        )
    },
    sections: [
        {
            title: 'Device Information',
            fields: [
                { name: 'serial_number', label: 'Serial Number', type: 'text' },
                {
                    name: 'device_type',
                    label: 'Device Type',
                    type: 'select',
                    options: [
                        { value: 'Laptop', label: 'Laptop' },
                        { value: 'Desktop', label: 'Desktop' },
                        { value: 'Server', label: 'Server' },
                        { value: 'Printer', label: 'Printer' },
                        { value: 'Network', label: 'Network' },
                        { value: 'Storage', label: 'Storage' },
                        { value: 'Other', label: 'Other' }
                    ]
                },
                { name: 'manufacturer', label: 'Manufacturer', type: 'text' },
                { name: 'model_number', label: 'Model Number', type: 'text' }
            ]
        },
        {
            title: 'Purchase Details',
            fields: [
                { name: 'purchase_date', label: 'Purchase Date', type: 'date' },
                { name: 'warranty_expiry', label: 'Warranty Expiry', type: 'date' }
            ]
        }
    ],
    additionalSections: [
        {
            title: 'Specifications',
            render: (device, isEditing, onChange) => (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">CPU</p>
                        {isEditing ? (
                            <input
                                type="text"
                                name="specifications.cpu"
                                value={device.specifications?.cpu || ''}
                                onChange={onChange}
                                className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 outline-none"
                            />
                        ) : (
                            <p className="font-medium">{device.specifications?.cpu || 'Unknown'}</p>
                        )}
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">RAM</p>
                        {isEditing ? (
                            <input
                                type="text"
                                name="specifications.ram"
                                value={device.specifications?.ram || ''}
                                onChange={onChange}
                                className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 outline-none"
                            />
                        ) : (
                            <p className="font-medium">{device.specifications?.ram || 'Unknown'}</p>
                        )}
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Storage</p>
                        {isEditing ? (
                            <input
                                type="text"
                                name="specifications.storage"
                                value={device.specifications?.storage || ''}
                                onChange={onChange}
                                className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 outline-none"
                            />
                        ) : (
                            <p className="font-medium">{device.specifications?.storage || 'Unknown'}</p>
                        )}
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">OS</p>
                        {isEditing ? (
                            <input
                                type="text"
                                name="specifications.os"
                                value={device.specifications?.os || ''}
                                onChange={onChange}
                                className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 outline-none"
                            />
                        ) : (
                            <p className="font-medium">{device.specifications?.os || 'Unknown'}</p>
                        )}
                    </div>
                </div>
            )
        },
        {
            title: 'Assigned Customer',
            render: (device, isEditing, onChange) => {
                if (isEditing) {
                    return (
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Customer</p>
                            <select
                                name="customer_id"
                                value={device.customer_id?._id || device.customer_id || ''}
                                onChange={onChange}
                                className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 outline-none"
                            >
                                <option value="">Unassigned</option>
                                {/* Customers will be fetched in ViewComponent */}
                                {device.customersList?.map(customer => (
                                    <option key={customer._id} value={customer._id}>
                                        {customer.name} ({customer.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                    );
                }

                return device.customer_id ? (
                    <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-medium">{device.customer_id.name}</p>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>{device.customer_id.email || 'No email'}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="font-medium">Unassigned</p>
                );
            }
        },
        {
            title: 'Notes',
            render: (device, isEditing, onChange) => (
                isEditing ? (
                    <textarea
                        name="notes"
                        value={device.notes || ''}
                        onChange={onChange}
                        className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 outline-none"
                        rows="3"
                    />
                ) : (
                    <p className="font-medium whitespace-pre-line">{device.notes || 'No notes'}</p>
                )
            )
        }
    ],
    // Custom data fetcher to get both device and customers
    fetchAdditionalData: async (apiPath, id, token) => {
        try {
            // console.log('Fetching device with ID:', id); // Debug log
            const deviceResponse = await axios.get(`${apiPath}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const customersResponse = await axios.get('http://localhost:5000/customers', {
                headers: { Authorization: `Bearer ${token}` }
            });

            return {
                ...deviceResponse.data,
                customersList: customersResponse.data.customers || []
            };
        } catch (err) {
            console.error('Error fetching device data:', err);
            throw err;
        }
    },

    prepareDataForSubmission: (data) => ({
        ...data,
        customer_id: data.customer_id?._id || data.customer_id || null,
        specifications: data.specifications || {}
    })
};

const ViewDevice = () => (
    <ViewComponent
        backRoute="/devices"
        apiPath="/devices"
        config={deviceConfig}
        titleKey="device"
        deleteMessage={(device) => `Are you sure you want to delete this device (${device.manufacturer} ${device.model_number})? This action cannot be undone.`}
    />
);

export default ViewDevice;