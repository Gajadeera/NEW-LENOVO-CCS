const mongoose = require('mongoose');
const { Schema } = mongoose;

const deviceServiceHistorySchema = new Schema({
    device_id: { type: Schema.Types.ObjectId, ref: 'Device', required: true },
    job_id: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    service_date: { type: Date, default: Date.now },
    service_type: String,
    technician_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    problems_reported: String,
    work_performed: String,
    parts_replaced: [{
        part_id: { type: Schema.Types.ObjectId, ref: 'Inventory' },
        part_name: String,
        quantity: { type: Number, min: 1 }
    }],
    next_service_due: Date,
    notes: String,
    is_warranty_covered: Boolean
});

module.exports = mongoose.model('DeviceServiceHistory', deviceServiceHistorySchema);