const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
    name: { type: String, required: true },
    contact_phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String
    },
    location_coordinates: [Number],
    customer_type: {
        type: String,
        enum: ["Residential", "Business", "Enterprise"],
        default: "Residential"
    },
    notes: String,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// Update the updated_at field before saving
customerSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model('Customer', customerSchema);
