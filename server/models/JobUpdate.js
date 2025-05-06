const mongoose = require('mongoose');
const { Schema } = mongoose;

const jobUpdateSchema = new Schema({
    job_id: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    updated_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    update_text: { type: String, required: true },
    photos: [String],
    time_spent: { type: Number, min: 0 },
    update_timestamp: { type: Date, default: Date.now },
    parts_used: [{
        part_id: { type: Schema.Types.ObjectId, ref: 'Inventory' },
        part_name: String,
        quantity: { type: Number, min: 1 }
    }]
});

module.exports = mongoose.model('JobUpdate', jobUpdateSchema);