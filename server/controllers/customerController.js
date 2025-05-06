const httpStatus = require('http-status');
const Customer = require('../models/Customer');
const ApiError = require('../utils/apiError');

const getAllCustomers = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search = '', sort = '-created_at', customer_type } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { contact_phone: { $regex: search, $options: 'i' } }
            ];
        }

        if (customer_type) query.customer_type = customer_type;

        const customers = await Customer.find(query)
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Customer.countDocuments(query);

        res.send({
            customers,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        next(error);
    }
};

const getCustomer = async (req, res, next) => {
    try {
        const customer = await Customer.findById(req.params.customerId);
        if (!customer) throw new ApiError(httpStatus.NOT_FOUND, 'Customer not found');
        res.send(customer);
    } catch (error) {
        next(error);
    }
};

const createCustomer = async (req, res, next) => {
    try {
        const { name, contact_phone, email } = req.body;
        if (!name || !contact_phone || !email) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Name, phone and email are required');
        }

        if (await Customer.findOne({ email })) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Email already in use');
        }

        const customer = await Customer.create(req.body);
        res.status(httpStatus.CREATED).send(customer);
    } catch (error) {
        next(error);
    }
};

const updateCustomer = async (req, res, next) => {
    try {
        const customer = await Customer.findById(req.params.customerId);
        if (!customer) throw new ApiError(httpStatus.NOT_FOUND, 'Customer not found');

        if (req.body.email && req.body.email !== customer.email) {
            if (await Customer.findOne({ email: req.body.email })) {
                throw new ApiError(httpStatus.BAD_REQUEST, 'Email already in use');
            }
        }

        Object.assign(customer, req.body);
        await customer.save();
        res.send(customer);
    } catch (error) {
        next(error);
    }
};

const deleteCustomer = async (req, res, next) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.customerId);
        if (!customer) throw new ApiError(httpStatus.NOT_FOUND, 'Customer not found');
        res.send({ message: 'Customer deleted successfully' });
    } catch (error) {
        next(error);
    }
};

const getCustomersByLocation = async (req, res, next) => {
    try {
        const { location } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const query = {
            $or: [
                { 'address.city': { $regex: location, $options: 'i' } },
                { 'address.state': { $regex: location, $options: 'i' } }
            ]
        };

        const customers = await Customer.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Customer.countDocuments(query);

        res.send({
            customers,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomersByLocation
};