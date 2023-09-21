const async = require("hbs/lib/async");
const Request = require("../models/requestModel");


exports.createRequest = async(req, res) => {
    try {
        console.log(req.body);
        // console.log(req.body.recipientName);
        const newRequest = await Request.create({
            recipientName: req.body.recipientName,
            recipientBloodGroup: req.body.recipientBloodGroup,
            email: req.body.email,
            location: req.body.location,
            bloodRequiredDate: req.body.bloodRequiredDate,
            comment: req.body.comment,
        });

        


        res.status(200).json({
            status: "success",
            request: req.body,
        });

    } catch (error) {
        return res.status(400).json({
            status: "Bad Request",
            message: error.message,
        });
    }
}


exports.getAllRequest = async(req, res) => {
    try {

        const requests = await Request.find({});
        res.status(200).json({
            status: "success",
            results: requests.length,
            request: requests,
        });

    } catch (error) {
        return res.status(400).json({
            status: "Bad Request",
            message: error.message,
        });
    }
}