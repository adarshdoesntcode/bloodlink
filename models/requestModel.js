const mongoose = require('mongoose');
const validator = require('validator');
const User = require('../models/userModel');

const requestSchema = new mongoose.Schema({
    recipientName: {
        type: String,
        required: [true, "Please tell us your name!"],
    },
    recipientBloodGroup: {
        type: String,
        required: [true, "Please enter your blood group!"],
    },

    email: {
        type: String,
        required: [true, "Please your calid email address!"],
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email!!!'],
    },
    location: {
        type: String,
        required: [true, "Please enter your location!"],
    },
    bloodRequiredDate: {
        type: Date,
        required: [true, "Please enter the date whithin which blood is required!"],
    },
    comment: {
        type: String,
    },
    status: {
        type: String,
        default: "ON GOING",
        enum: ["ON GOING", "COMPLETED"],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        require: [true, "A Request must belong to a user"]
    },
    timeStamps: {
        type: Date,
        timestamps: true,
    },
}, {
    timestamps: true,
});


//creating model
const Request = mongoose.model('Request', requestSchema);

module.exports = Request;