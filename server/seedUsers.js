const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('./config/config'); // Adjust path as needed

// User Schema
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

// Create User model
const User = mongoose.model('User', userSchema);

// Sample Users Data (20 users with Dayan as only admin)
const sampleUsers = [
    // Dayan - Only Admin
    {
        name: 'Dayan Gajadeera',
        email: 'dayan@gmail.com',
        phone: '0712345678',
        password: 'Hello@123',
        role: 'admin',
        skills: ['system administration', 'user management']
    },
    // Managers
    {
        name: 'Dilantha de Silva',
        email: 'dilantha@gmail.com',
        phone: '0723456789',
        password: 'PasswDil@123',
        role: 'manager',
        skills: ['overall management']
    },
    {
        name: 'Veronica Perera',
        email: 'veronica@gmail.com',
        phone: '0712345679',
        password: 'Passwver@123',
        role: 'manager',
        skills: ['team leadership']
    },
    // Coordinators
    {
        name: 'Nadeesha Fernando',
        email: 'nadeesha@gmail.com',
        phone: '0752345678',
        password: 'Nadee@123',
        role: 'coordinator',
        skills: ['client communication']
    },
    {
        name: 'Chathura Rodrigo',
        email: 'chathura@gmail.com',
        phone: '0768901234',
        password: 'Chathu@123',
        role: 'coordinator',
        skills: ['scheduling']
    },
    // Technicians
    {
        name: 'Kasun Perera',
        email: 'kasunp@gmail.com',
        phone: '0771234567',
        password: 'Kasun@123',
        role: 'technician',
        skills: ['hardware repair']
    },
    {
        name: 'Dineth Samaraweera',
        email: 'dineth@gmail.com',
        phone: '0757890123',
        password: 'Dineth@123',
        role: 'technician',
        skills: ['software troubleshooting']
    },
    {
        name: 'Samantha Rathnayake',
        email: 'samantha@gmail.com',
        phone: '0711123456',
        password: 'Sam@12345',
        role: 'technician',
        skills: ['mobile repairs']
    },
    // Parts Team
    {
        name: 'Ishara Gunasekara',
        email: 'isharag@gmail.com',
        phone: '0764567890',
        password: 'Ishara@123',
        role: 'parts_team',
        skills: ['inventory']
    },
    {
        name: 'Priyanka Jayawardena',
        email: 'priyanka@gmail.com',
        phone: '0733345678',
        password: 'Priya#123',
        role: 'parts_team',
        skills: ['ordering']
    },
    // More Technicians
    {
        name: 'Damith Silva',
        email: 'damith@gmail.com',
        phone: '0744456789',
        password: 'Damith$99',
        role: 'technician',
        skills: ['networking']
    },
    {
        name: 'Eshan Perera',
        email: 'eshan@gmail.com',
        phone: '0788890123',
        password: 'EshanP@12',
        role: 'technician',
        skills: ['AV systems']
    },
    // More Coordinators
    {
        name: 'Rajiv Bandara',
        email: 'rajiv@gmail.com',
        phone: '0722234567',
        password: 'Rajiv@2023',
        role: 'coordinator',
        skills: ['quality control']
    },
    {
        name: 'Chamari Fernando',
        email: 'chamari@gmail.com',
        phone: '0777789012',
        password: 'Chamari@1',
        role: 'coordinator',
        skills: ['customer service']
    },
    // More Managers
    {
        name: 'Bhanuka Rajapakse',
        email: 'bhanuka@gmail.com',
        phone: '0766678901',
        password: 'Bhanu*123',
        role: 'manager',
        skills: ['strategic planning']
    },
    {
        name: 'Ruwani Senanayake',
        email: 'ruwani@gmail.com',
        phone: '0775678901',
        password: 'Ruwani@123',
        role: 'manager',
        skills: ['budgeting']
    },
    // Parts Team
    {
        name: 'Fathima Zahrin',
        email: 'fathima@gmail.com',
        phone: '0799901234',
        password: 'Fathima#1',
        role: 'parts_team',
        skills: ['logistics']
    },
    // Technicians
    {
        name: 'Gayan Gamage',
        email: 'gayan@gmail.com',
        phone: '0700012345',
        password: 'GayanG@1',
        role: 'technician',
        skills: ['data recovery']
    },
    {
        name: 'Nimasha Dissanayake',
        email: 'nimasha@gmail.com',
        phone: '0746789012',
        password: 'Nimasha@123',
        role: 'technician',
        skills: ['preventive maintenance']
    },
    {
        name: 'Thilina Jayasooriya',
        email: 'thilina@gmail.com',
        phone: '0783456789',
        password: 'Thili@123',
        role: 'technician',
        skills: ['diagnostics']
    }
];

// Seed Users Function
const seedUsers = async () => {
    try {
        console.log('Starting user seeding process...');

        // Connect to MongoDB
        await mongoose.connect(config.mongoose.url, config.mongoose.options);
        console.log('Connected to MongoDB');

        // Hash passwords
        console.log('Hashing passwords...');
        const usersWithHashedPasswords = await Promise.all(
            sampleUsers.map(async user => {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                return { ...user, password: hashedPassword };
            })
        );

        // Clear existing users
        await User.deleteMany({});
        console.log('Cleared existing users');

        // Insert new users
        const result = await User.insertMany(usersWithHashedPasswords);
        console.log(`Successfully seeded ${result.length} users`);

        // Display login information
        console.log('\nUser Credentials:');
        console.log('========================================');
        console.log('| Role        | Email                | Password      |');
        console.log('|-------------|----------------------|---------------|');
        sampleUsers.forEach(user => {
            console.log(`| ${user.role.padEnd(11)} | ${user.email.padEnd(20)} | ${user.password.padEnd(13)} |`);
        });
        console.log('========================================');
        console.log('\nNOTE: Dayan is the only admin user');

    } catch (error) {
        console.error('Error during seeding:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    }
};

// Execute the seeding function
seedUsers();