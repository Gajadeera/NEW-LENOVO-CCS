const mongoose = require('mongoose');
const { Schema } = mongoose;

const partsRequestSchema = new Schema({
    job_id: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    requested_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    part_id: { type: Schema.Types.ObjectId, ref: 'Inventory', required: true },
    quantity: { type: Number, min: 1, required: true },
    urgency: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium"
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected", "Fulfilled"],
        default: "Pending"
    },
    requested_at: { type: Date, default: Date.now },
    approved_by: { type: Schema.Types.ObjectId, ref: 'User' },
    approved_at: Date,
    rejection_reason: String,
    fulfillment_date: Date
});

module.exports = mongoose.model('PartsRequest', partsRequestSchema);