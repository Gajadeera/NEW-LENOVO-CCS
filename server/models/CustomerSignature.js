const mongoose = require('mongoose');
const { Schema } = mongoose;

const customerSignatureSchema = new Schema({
    job_id: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    signature_image_path: { type: String, required: true },
    signature_timestamp: { type: Date, default: Date.now },
    signed_by: { type: String, required: true },
    signing_method: {
        type: String,
        enum: ["digital", "photo"],
        required: true
    },
    signature_type: {
        type: String,
        enum: ["service_completion", "device_collection", "device_return", "other"],
        required: true
    }
});

module.exports = mongoose.model('CustomerSignature', customerSignatureSchema);