const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('./config/config'); // Adjust path as needed

// Connect to MongoDB
mongoose.connect(config.mongoose.url, config.mongoose.options)
    .then(() => console.log('Connected to MongoDB for seeding'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define all schemas
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'coordinator', 'technician', 'manager', 'parts_team']
    },
    skills: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now }
});

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contact_phone: { type: String, required: true },
    email: { type: String },
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        zip: { type: String },
        country: { type: String }
    },
    location_coordinates: { type: [Number] },
    customer_type: {
        type: String,
        enum: ["Residential", "Business", "Enterprise"]
    },
    notes: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const deviceSchema = new mongoose.Schema({
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    device_type: {
        type: String,
        enum: ["Laptop", "Desktop", "Server", "Printer", "Network", "Storage", "Other"]
    },
    manufacturer: { type: String },
    model_number: { type: String },
    serial_number: { type: String },
    purchase_date: { type: Date },
    warranty_expiry: { type: Date },
    specifications: {
        cpu: { type: String },
        ram: { type: String },
        storage: { type: String },
        os: { type: String }
    },
    photos: { type: [String] },
    notes: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const jobSchema = new mongoose.Schema({
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    device_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High", "Urgent"]
    },
    required_skill_set: { type: [String] },
    status: {
        type: String,
        enum: [
            "Pending Assignment",
            "Assigned",
            "In Progress",
            "On Hold",
            "Device Collected",
            "Awaiting Workshop Repair",
            "Ready to Close",
            "Pending Closure",
            "Closed",
            "Reopened"
        ]
    },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    scheduled_date: { type: Date },
    completed_date: { type: Date },
    sla_deadline: { type: Date },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// Create models
const User = mongoose.model('User', userSchema);
const Customer = mongoose.model('Customer', customerSchema);
const Device = mongoose.model('Device', deviceSchema);
const Job = mongoose.model('Job', jobSchema);

// Sample data
const sampleUsers = [
    // Dayan - Only Admin
    {
        name: 'Dayan Gajadeera',
        email: 'dayan@gmail.com',
        phone: '0712345678',
        password: 'Admin@Dayan123',
        role: 'admin',
        skills: ['system administration', 'user management']
    },
    // Managers
    {
        name: 'Dilantha de Silva',
        email: 'dilantha@gmail.com',
        phone: '0723456789',
        password: 'Manager@Dil456',
        role: 'manager',
        skills: ['overall management']
    },
    {
        name: 'Veronica Perera',
        email: 'veronica@gmail.com',
        phone: '0712345679',
        password: 'Vero@Manager789',
        role: 'manager',
        skills: ['team leadership']
    },
    // Coordinators
    {
        name: 'Nadeesha Fernando',
        email: 'nadeesha@gmail.com',
        phone: '0752345678',
        password: 'Nadee@Coord101',
        role: 'coordinator',
        skills: ['client communication']
    },
    {
        name: 'Chathura Rodrigo',
        email: 'chathura@gmail.com',
        phone: '0768901234',
        password: 'Chat@Coord202',
        role: 'coordinator',
        skills: ['scheduling']
    },
    // Technicians
    {
        name: 'Kasun Perera',
        email: 'kasunp@gmail.com',
        phone: '0771234567',
        password: 'Tech@Kasun303',
        role: 'technician',
        skills: ['hardware repair']
    },
    {
        name: 'Dineth Samaraweera',
        email: 'dineth@gmail.com',
        phone: '0757890123',
        password: 'Tech@Dineth404',
        role: 'technician',
        skills: ['software troubleshooting']
    },
    {
        name: 'Samantha Rathnayake',
        email: 'samantha@gmail.com',
        phone: '0711123456',
        password: 'Tech@Sam505',
        role: 'technician',
        skills: ['mobile repairs']
    },
    // Parts Team
    {
        name: 'Ishara Gunasekara',
        email: 'isharag@gmail.com',
        phone: '0764567890',
        password: 'Parts@Ish606',
        role: 'parts_team',
        skills: ['inventory']
    },
    {
        name: 'Priyanka Jayawardena',
        email: 'priyanka@gmail.com',
        phone: '0733345678',
        password: 'Parts@Pri707',
        role: 'parts_team',
        skills: ['ordering']
    },
    // More Technicians
    {
        name: 'Damith Silva',
        email: 'damith@gmail.com',
        phone: '0744456789',
        password: 'Tech@Dam808',
        role: 'technician',
        skills: ['networking']
    },
    {
        name: 'Eshan Perera',
        email: 'eshan@gmail.com',
        phone: '0788890123',
        password: 'Tech@Esh909',
        role: 'technician',
        skills: ['AV systems']
    },
    // More Coordinators
    {
        name: 'Rajiv Bandara',
        email: 'rajiv@gmail.com',
        phone: '0722234567',
        password: 'Coord@Raj101',
        role: 'coordinator',
        skills: ['quality control']
    },
    {
        name: 'Chamari Fernando',
        email: 'chamari@gmail.com',
        phone: '0777789012',
        password: 'Coord@Cham202',
        role: 'coordinator',
        skills: ['customer service']
    },
    // More Managers
    {
        name: 'Bhanuka Rajapakse',
        email: 'bhanuka@gmail.com',
        phone: '0766678901',
        password: 'Manager@Bhan303',
        role: 'manager',
        skills: ['strategic planning']
    },
    {
        name: 'Ruwani Senanayake',
        email: 'ruwani@gmail.com',
        phone: '0775678901',
        password: 'Manager@Ruw404',
        role: 'manager',
        skills: ['budgeting']
    },
    // Parts Team
    {
        name: 'Fathima Zahrin',
        email: 'fathima@gmail.com',
        phone: '0799901234',
        password: 'Parts@Fat505',
        role: 'parts_team',
        skills: ['logistics']
    },
    // Technicians
    {
        name: 'Gayan Gamage',
        email: 'gayan@gmail.com',
        phone: '0700012345',
        password: 'Tech@Gay606',
        role: 'technician',
        skills: ['data recovery']
    },
    {
        name: 'Nimasha Dissanayake',
        email: 'nimasha@gmail.com',
        phone: '0746789012',
        password: 'Tech@Nim707',
        role: 'technician',
        skills: ['preventive maintenance']
    },
    {
        name: 'Thilina Jayasooriya',
        email: 'thilina@gmail.com',
        phone: '0783456789',
        password: 'Tech@Thi808',
        role: 'technician',
        skills: ['diagnostics']
    }
];

const sampleCustomers = [
    {
        name: "Tech Solutions Inc.",
        contact_phone: "+1 (555) 123-4567",
        email: "contact@techsolutions.com",
        address: {
            street: "123 Tech Street",
            city: "San Francisco",
            state: "CA",
            zip: "94105",
            country: "USA"
        },
        location_coordinates: [-122.399, 37.788],
        customer_type: "Enterprise",
        notes: "Premium support contract"
    },
    {
        name: "Sarah Johnson",
        contact_phone: "+1 (555) 987-6543",
        email: "sarah.johnson@email.com",
        address: {
            street: "456 Home Lane",
            city: "Austin",
            state: "TX",
            zip: "78701",
            country: "USA"
        },
        location_coordinates: [-97.743, 30.267],
        customer_type: "Residential",
        notes: "Frequent laptop issues"
    },
    {
        name: "Creative Marketing LLC",
        contact_phone: "+1 (555) 456-7890",
        email: "it@creativemarketing.com",
        address: {
            street: "789 Business Ave",
            city: "New York",
            state: "NY",
            zip: "10001",
            country: "USA"
        },
        location_coordinates: [-74.006, 40.712],
        customer_type: "Business",
        notes: "10 workstations under contract"
    },
    {
        name: "Robert Chen",
        contact_phone: "+1 (555) 234-5678",
        email: "robert.chen@email.com",
        address: {
            street: "321 Personal Drive",
            city: "Seattle",
            state: "WA",
            zip: "98101",
            country: "USA"
        },
        location_coordinates: [-122.332, 47.606],
        customer_type: "Residential",
        notes: "Gaming PC enthusiast"
    },
    {
        name: "Global Finance Corp",
        contact_phone: "+1 (555) 876-5432",
        email: "support@globalfinance.com",
        address: {
            street: "999 Corporate Blvd",
            city: "Chicago",
            state: "IL",
            zip: "60601",
            country: "USA"
        },
        location_coordinates: [-87.629, 41.878],
        customer_type: "Enterprise",
        notes: "Multi-site support agreement"
    }
];

const sampleDevices = [
    {
        device_type: "Laptop",
        manufacturer: "Lenovo",
        model_number: "ThinkPad X1 Carbon",
        serial_number: "LX12345678",
        purchase_date: new Date("2022-05-15"),
        warranty_expiry: new Date("2024-05-15"),
        specifications: {
            cpu: "Intel Core i7-1165G7",
            ram: "16GB",
            storage: "512GB SSD",
            os: "Windows 11 Pro"
        },
        photos: ["photo1.jpg", "photo2.jpg"],
        notes: "CEO's laptop"
    },
    {
        device_type: "Laptop",
        manufacturer: "Lenovo",
        model_number: "Yoga 9i",
        serial_number: "LY98765432",
        purchase_date: new Date("2021-11-20"),
        warranty_expiry: new Date("2023-11-20"),
        specifications: {
            cpu: "Intel Core i5-1135G7",
            ram: "8GB",
            storage: "256GB SSD",
            os: "Windows 11 Home"
        },
        photos: ["photo3.jpg"],
        notes: "Screen flickering issue"
    },
    {
        device_type: "Desktop",
        manufacturer: "Lenovo",
        model_number: "ThinkCentre M75q",
        serial_number: "DT45612378",
        purchase_date: new Date("2022-08-10"),
        warranty_expiry: new Date("2024-08-10"),
        specifications: {
            cpu: "AMD Ryzen 5 PRO 5650GE",
            ram: "16GB",
            storage: "1TB SSD",
            os: "Windows 10 Pro"
        },
        photos: ["photo4.jpg", "photo5.jpg"],
        notes: "Marketing workstation #3"
    },
    {
        device_type: "Desktop",
        manufacturer: "Custom Build",
        model_number: "Gaming PC",
        serial_number: "CUSTOM12345",
        purchase_date: new Date("2021-03-15"),
        warranty_expiry: new Date("2023-03-15"),
        specifications: {
            cpu: "AMD Ryzen 9 5900X",
            ram: "32GB",
            storage: "2TB NVMe SSD",
            os: "Windows 11 Pro"
        },
        photos: ["photo6.jpg"],
        notes: "Overheating issues"
    },
    {
        device_type: "Server",
        manufacturer: "Lenovo",
        model_number: "ThinkSystem SR650",
        serial_number: "SR78901234",
        purchase_date: new Date("2020-12-01"),
        warranty_expiry: new Date("2023-12-01"),
        specifications: {
            cpu: "2x Intel Xeon Silver 4210",
            ram: "64GB",
            storage: "4x 480GB SSD RAID 10",
            os: "Windows Server 2019"
        },
        photos: ["photo7.jpg", "photo8.jpg"],
        notes: "Primary database server"
    }
];

const sampleJobs = [
    {
        title: "Keyboard replacement",
        description: "Several keys not working properly on ThinkPad X1 Carbon",
        priority: "High",
        required_skill_set: ["Laptop repair", "Hardware replacement"],
        status: "Closed",
        scheduled_date: new Date("2023-06-10"),
        completed_date: new Date("2023-06-11"),
        sla_deadline: new Date("2023-06-15")
    },
    {
        title: "Screen flickering issue",
        description: "Display intermittently flickers and goes blank",
        priority: "Medium",
        required_skill_set: ["Laptop repair", "Display diagnostics"],
        status: "In Progress",
        scheduled_date: new Date("2023-08-20"),
        sla_deadline: new Date("2023-08-30")
    },
    {
        title: "OS upgrade and data migration",
        description: "Upgrade from Windows 10 to Windows 11 with all user data preserved",
        priority: "Medium",
        required_skill_set: ["OS installation", "Data migration"],
        status: "Assigned",
        scheduled_date: new Date("2023-09-05"),
        sla_deadline: new Date("2023-09-10")
    },
    {
        title: "Cooling system diagnostics",
        description: "PC shuts down during heavy gaming sessions, suspected cooling issue",
        priority: "High",
        required_skill_set: ["Desktop repair", "Thermal management"],
        status: "Pending Assignment",
        sla_deadline: new Date("2023-09-15")
    },
    {
        title: "Server performance optimization",
        description: "Database server running slow during peak hours, needs tuning",
        priority: "Urgent",
        required_skill_set: ["Server administration", "Performance tuning"],
        status: "Awaiting Workshop Repair",
        scheduled_date: new Date("2023-09-10"),
        sla_deadline: new Date("2023-09-12")
    }
];

// Seed function
const seedDatabase = async () => {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Customer.deleteMany({});
        await Device.deleteMany({});
        await Job.deleteMany({});
        console.log('Cleared existing data');

        // Hash passwords and insert users
        const usersWithHashedPasswords = await Promise.all(
            sampleUsers.map(async user => {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                return { ...user, password: hashedPassword };
            })
        );
        const insertedUsers = await User.insertMany(usersWithHashedPasswords);
        console.log(`Inserted ${insertedUsers.length} users`);

        // Insert customers
        const insertedCustomers = await Customer.insertMany(sampleCustomers);
        console.log(`Inserted ${insertedCustomers.length} customers`);

        // Insert devices with customer references
        const devicesWithCustomers = sampleDevices.map((device, index) => ({
            ...device,
            customer_id: insertedCustomers[index % insertedCustomers.length]._id
        }));
        const insertedDevices = await Device.insertMany(devicesWithCustomers);
        console.log(`Inserted ${insertedDevices.length} devices`);

        // Insert jobs with proper references
        const jobsWithReferences = sampleJobs.map((job, index) => {
            const customerIndex = index % insertedCustomers.length;
            const deviceIndex = index % insertedDevices.length;
            const createdBy = insertedUsers.find(u => u.role === 'coordinator')?._id || insertedUsers[0]._id;

            // Assign to appropriate technician based on skills
            let assignedTo = null;
            if (job.status !== "Pending Assignment") {
                assignedTo = insertedUsers.find(u =>
                    u.role === 'technician' &&
                    job.required_skill_set.some(skill => u.skills.includes(skill.toLowerCase()))
                )?._id || insertedUsers.find(u => u.role === 'technician')?._id;
            }

            return {
                ...job,
                customer_id: insertedCustomers[customerIndex]._id,
                device_id: insertedDevices[deviceIndex]._id,
                created_by: createdBy,
                assigned_to: assignedTo
            };
        });

        const insertedJobs = await Job.insertMany(jobsWithReferences);
        console.log(`Inserted ${insertedJobs.length} jobs`);

        console.log('\nDatabase seeded successfully!');
        console.log('========================================');
        console.log('User Credentials:');
        console.log('----------------------------------------');
        console.log('| Role        | Email                | Password      |');
        console.log('|-------------|----------------------|---------------|');
        sampleUsers.forEach(user => {
            console.log(`| ${user.role.padEnd(11)} | ${user.email.padEnd(20)} | ${user.password.padEnd(13)} |`);
        });
        console.log('========================================');
        console.log('\nNOTE: Dayan is the only admin user');

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

// Execute the seeding function
seedDatabase();