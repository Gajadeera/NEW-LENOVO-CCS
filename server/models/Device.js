const mongoose = require('mongoose');
const Schema = mongoose.Schema;  // Add this line to define Schema

const deviceSchema = new Schema({
    customer_id: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    device_type: {
        type: String,
        enum: ["Laptop", "Desktop", "Server", "Printer", "Network", "Storage", "Other"],
        required: true
    },
    manufacturer: { type: String, required: true },
    model_number: { type: String, required: true },
    serial_number: { type: String, required: true, unique: true },
    purchase_date: Date,
    warranty_expiry: Date,
    specifications: {
        cpu: String,
        ram: String,
        storage: String,
        os: String
    },
    photos: [String],
    notes: String,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

deviceSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

// Virtual for warranty status
deviceSchema.virtual('warranty_status').get(function () {
    if (!this.warranty_expiry) return 'Unknown';
    return this.warranty_expiry > new Date() ? 'Active' : 'Expired';
});

module.exports = mongoose.model('Device', deviceSchema);