// models/Job.js
const mongoose = require('mongoose');
const Counter = require('./Counter');
const User = require('./User');
const Device = require('./Device');
const Customer = require('./Customer');

const JobSchema = new mongoose.Schema({
    job_number: { type: String, unique: true },
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: Customer, required: true },
    device_id: { type: mongoose.Schema.Types.ObjectId, ref: Device, required: true },
    description: { type: String },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Urgent'],
        default: 'Medium'
    },
    required_skill_set: [{ type: String }],
    status: {
        type: String,
        enum: [
            'Pending Assignment',
            'Assigned',
            'In Progress',
            'On Hold',
            'Device Collected',
            'Awaiting Workshop Repair',
            'Ready to Close',
            'Pending Closure',
            'Closed',
            'Reopened'
        ],
        default: 'Pending Assignment'
    },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
    assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: User },
    scheduled_date: { type: Date },
    completed_date: { type: Date },
    sla_deadline: { type: Date },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// Pre-save hook to auto-increment job_number
JobSchema.pre('save', async function (next) {
    if (!this.isNew) {
        this.updated_at = Date.now();
        return next();
    }

    try {
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'job_number' },
            { $inc: { sequence_value: 1 } },
            { new: true, upsert: true }
        );

        this.job_number = `T${counter.sequence_value.toString().padStart(4, '0')}`;
        next();
    } catch (err) {
        next(err);
    }
});

// Middleware to update the updated_at field before update operations
JobSchema.pre('findOneAndUpdate', function (next) {
    this.set({ updated_at: Date.now() });
    next();
});

module.exports = mongoose.model('Job', JobSchema);