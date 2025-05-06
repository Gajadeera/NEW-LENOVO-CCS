const mongoose = require('mongoose');
const { Schema } = mongoose;
const customerFeedbackSchema = new Schema({
    job_id: { type: Schema.Types.ObjectId, ref: 'Job', required: true, unique: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comments: String,
    feedback_date: { type: Date, default: Date.now },
    follow_up_required: { type: Boolean, default: false },
    follow_up_notes: String,
    technician_rating: { type: Number, min: 1, max: 5 }
});

module.exports = mongoose.model('CustomerFeedback', customerFeedbackSchema);