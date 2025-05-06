const mongoose = require('mongoose');
const { Schema } = mongoose;
const inventorySchema = new Schema({
    part_number: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: String,
    current_quantity: { type: Number, min: 0, default: 0 },
    minimum_quantity: { type: Number, min: 0, default: 0 },
    unit_price: { type: Number, min: 0 },
    location: String,
    supplier_info: String,
    compatible_devices: [String],
    notes: String,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

inventorySchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

// Virtual for stock status
inventorySchema.virtual('stock_status').get(function () {
    if (this.current_quantity === 0) return 'Out of Stock';
    if (this.current_quantity <= this.minimum_quantity) return 'Low Stock';
    return 'In Stock';
});

module.exports = mongoose.model('Inventory', inventorySchema);