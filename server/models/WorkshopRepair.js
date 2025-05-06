const mongoose = require('mongoose');
const { Schema } = mongoose;

const workshopRepairSchema = new Schema({
    job_id: { type: Schema.Types.ObjectId, ref: 'Job', required: true, unique: true },
    device_id: { type: Schema.Types.ObjectId, ref: 'Device', required: true },
    received_date: { type: Date, default: Date.now },
    diagnosed_by: { type: Schema.Types.ObjectId, ref: 'User' },
    diagnosis: String,
    estimated_repair_days: { type: Number, min: 0 },
    actual_completion_date: Date,
    parts_used: [{
        part_id: { type: Schema.Types.ObjectId, ref: 'Inventory' },
        part_name: String,
        quantity: { type: Number, min: 1 }
    }],
    repair_notes: String,
    repair_photos: [String],
    status: {
        type: String,
        enum: ["Received", "In Diagnosis", "In Repair", "Quality Check", "Ready for Return", "Returned"],
        default: "Received"
    }
});

module.exports = mongoose.model('WorkshopRepair', workshopRepairSchema);