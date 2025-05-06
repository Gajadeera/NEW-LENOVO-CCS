const httpStatus = require('http-status');
const Inventory = require('../models/Inventory');
const ApiError = require('../utils/apiError');

const getAllInventory = async (req, res, next) => {
    try {
        const { search, category, sort = '-updated_at' } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { part_number: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        if (category) query.category = category;

        const items = await Inventory.find(query).sort(sort);
        res.send(items);
    } catch (error) {
        next(error);
    }
};

const getLowStockItems = async (req, res, next) => {
    try {
        const items = await Inventory.find({
            $expr: { $lte: ['$current_quantity', '$minimum_quantity'] }
        }).sort('-updated_at');
        res.send(items);
    } catch (error) {
        next(error);
    }
};

const getInventoryItem = async (req, res, next) => {
    try {
        const item = await Inventory.findById(req.params.id);
        if (!item) throw new ApiError(httpStatus.NOT_FOUND, 'Inventory item not found');
        res.send(item);
    } catch (error) {
        next(error);
    }
};

const createInventoryItem = async (req, res, next) => {
    try {
        const { part_number } = req.body;

        // Check if part number already exists
        const existingItem = await Inventory.findOne({ part_number });
        if (existingItem) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Part number already exists');
        }

        const item = await Inventory.create(req.body);
        res.status(httpStatus.CREATED).send(item);
    } catch (error) {
        next(error);
    }
};

const updateInventoryItem = async (req, res, next) => {
    try {
        const item = await Inventory.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!item) throw new ApiError(httpStatus.NOT_FOUND, 'Inventory item not found');
        res.send(item);
    } catch (error) {
        next(error);
    }
};

const updateStockLevel = async (req, res, next) => {
    try {
        const { adjustment } = req.body;
        if (!adjustment || typeof adjustment !== 'number') {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Valid adjustment value required');
        }

        const item = await Inventory.findById(req.params.id);
        if (!item) throw new ApiError(httpStatus.NOT_FOUND, 'Inventory item not found');

        const newQuantity = item.current_quantity + adjustment;
        if (newQuantity < 0) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Stock cannot be negative');
        }

        item.current_quantity = newQuantity;
        await item.save();
        res.send(item);
    } catch (error) {
        next(error);
    }
};

const deleteInventoryItem = async (req, res, next) => {
    try {
        const item = await Inventory.findByIdAndDelete(req.params.id);
        if (!item) throw new ApiError(httpStatus.NOT_FOUND, 'Inventory item not found');
        res.send({ message: 'Inventory item deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllInventory,
    getLowStockItems,
    getInventoryItem,
    createInventoryItem,
    updateInventoryItem,
    updateStockLevel,
    deleteInventoryItem
};