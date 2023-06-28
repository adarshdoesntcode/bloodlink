const mongoose = require("mongoose");
const User = require('../models/userModel');


//campaing schema (defining model)
const campaignSchema = new mongoose.Schema({
    campaignTitle: {
        type: String,
        trim: true,
        required: [true, "A campaign must have a title"],
    },
    description: {
        type: String,
        trim: true,
        required: [true, "A campaign must have a description"],
        // descriptionLength: optionalWidthLength(40, 100),
    },
    campaignStartDate: {
        type: Date,
        required: [true, "A campaign must have  start date"],
    },
    campaignEndDate: {
        type: Date,
        required: [true, "A campaign must have end date"],
    },
    campaignAddress: {
        type: String,
        required: [true, "A campaign must have a valid address"],
    },
    goalPint: {
        type: Number,
        default: 0,
        required: [true, "A campaign must have a pint amount"],
    },
    collectedPint: {
        type: Number,
        default: 0,
    },
    campaignImage: {
        type: String,
        // required: [true, "A camapign must have an image"],
    },
    timeStamps: {
        type: Date,
        timestamps: true,
    },
    campaignStatus: {
        type: String,
        default: "UNVERIFIED",
        enum: ["UNVERIFIED", "IN PROGRESS", "COMPLETE", "ENDED"],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        require: [true, "A Campaign must belong to a user"]
    },
}, {
    timestamps: true,
});

//making a campaign model
const Campaign = mongoose.model("Campaign", campaignSchema);

module.exports = Campaign;