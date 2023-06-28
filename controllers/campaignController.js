const Campaign = require("../models/campaignModel");
const Admin = require('../models/adminModel');


//----------CREATE CAMPAIGN----------------
exports.createCampaign = async(req, res) => {
    try {
        // console.log("Inside createCampaign controller");

        const formData = {
            ...req.body,
            user: req.user._id,
        }

        //creating a new Campaign and passing data '----formData-----'
        //and will be saved automaticaly as we are using create() function
        const newCampaign = await Campaign.create(formData);

        return res.status(201).json({
            status: "success",
            data: {
                campaign: newCampaign,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            data: {
                message: err.message,
            },
        });
    }
};


//----------GET ALL CAMPAIGNS----------------
exports.getCampaigns = async(req, res) => {
    try {
        const campaigns = await Campaign.find({});

        return res.status(201).json({
            status: "success",
            results: campaigns.length,
            data: {
                campaigns,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            data: {
                message: err.message,
            },
        });
    }
};