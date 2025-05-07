const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
const config = require('./config/config');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const customerRoutes = require('./routes/customerRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const jobRoutes = require('./routes/jobRoutes');
const jobUpdateRoutes = require('./routes/jobUpdateRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const counterRoutes = require('./routes/counterRoutes');
const NotificationsRoutes = require('./routes/notificationRoutes');
const partsRequestRoutes = require('./routes/partsRequestRoutes');
const serviceHistoryRoutes = require('./routes/serviceHistoryRoutes');
const signatureRoutes = require('./routes/signatureRoutes');
const workshoprepairRoutes = require('./routes/workshopRepairRoutes');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Home page of the backend');
})

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/customers', customerRoutes);
app.use('/devices', deviceRoutes);
app.use('/jobs', jobRoutes);
app.use('/job-updates', jobUpdateRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/feedback', feedbackRoutes);
app.use('/counters', counterRoutes);
app.use('/notifications', NotificationsRoutes);
app.use('/parts_requests', partsRequestRoutes);
app.use('/service-history', serviceHistoryRoutes);
app.use('/signature', signatureRoutes);
app.use('/workshop-repairs', workshoprepairRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// JWT config check
if (!config.jwt?.secret) {
    console.error('FATAL ERROR: JWT configuration is missing');
    process.exit(1);
}

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;
