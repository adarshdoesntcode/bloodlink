const User = require('../models/userModel');
const Request = require('../models/requestModel');
const Campaign = require('../models/campaignModel');

//for test
exports.getProfile = (req, res) => {
    res.status(200).json({
        data: "Profile has data"
    });
}


exports.getAllUsers = async(req, res) => {
    try {
        const users = await User.find({
            role: "donor",
        });

        const campaigns = await Campaign.find({});
        let pintCollectedCount = 0;
        for (let i = 0; i < campaigns.length; i++) {
            pintCollectedCount += campaigns[i].collectedPint;
        }

        const successfulRequest = await Request.find({
            status: "COMPLETED",
        });


        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const todaysRequest = await Request.find({
            createdAt: {
                $gte: today,
                $lt: tomorrow,
            },
        });


        res.status(200).json({
            activeDonorCount: users.length.toString(),
            pintCollectedCount: pintCollectedCount.toString(),
            successfulRequestCount: successfulRequest.length.toString(),
            todaysRequest: todaysRequest.length.toString(),
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
}