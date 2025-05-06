const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    notification_type: {
        type: String,
        enum: [
            "New Assignment",
            "Parts Request Update",
            "SLA Breach",
            "Device Collected",
            "Workshop Diagnosis Complete",
            "Job Closure Approval",
            "Feedback Received",
            "System Alert"
        ],
        required: true
    },
    is_read: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    action_url: String,
    related_job_id: { type: Schema.Types.ObjectId, ref: 'Job' }
});

// Method to mark as read
notificationSchema.methods.markAsRead = function () {
    this.is_read = true;
    return this.save();
};

module.exports = mongoose.model('Notification', notificationSchema);