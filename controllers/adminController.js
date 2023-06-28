const jwt = require("jsonwebtoken");
const { promisify } = require("util");


//IMPORT MODELS
const Admin = require("../models/adminModel");
const Campaign = require("../models/campaignModel");
const User = require("../models/userModel");
const Request = require("../models/requestModel");

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.EXPIRES_IN,
    });
};

//function to create and send token
const createSendToken = (admin, statuscode, res) => {
    const token = signToken(admin._id);

    const cookieOptions = {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
    };

    res.cookie("jwtToken", token, cookieOptions);
    // console.log(token);
    // console.log(admin);

    res.status(statuscode).json({
        status: "success",
        token,
        data: {
            admin: admin,
        },
    });
};

exports.home = async(req, res) => {
    res.render('adminLogin');
}

//signup for admin
exports.signup = async(req, res) => {
    //creating documents using the model
    const newAdmin = await Admin.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });

    //sending the response only
    res.status(200).json({
        status: "success",
        data: {
            admin: newAdmin,
        },
    });
};

//login for admin
exports.login = async(req, res, next) => {
    // console.log(req.body);
    //need to read the email and password from the req.body and we use destructuring of the object
    const { email, password } = req.body;

    //1.if the email and password is exist
    if (!email || !password) {
        // return next(new AppError('Please provide email & password',400));
        return res.status(400).json({
            status: "fail",
            message: "Please provide email & password",
        });
    }
    //2.if the user exists && password is correct

    //need to compare the user given password and database password
    //checking whether the user existst by checking for the email and password

    //here the provided password is in not encrpted but password stored in the database is encrypted so if the user exists with the provided email then password of that user is extracted then later on the password-provided----candidatePassword----and user.password that is extracted from the database is compared by the help of the function called-----correctPassword--------that is present in the------userModel.js----as we are making this function as instance method that will be available to all the document/collection
    const admin = await Admin.findOne({ email }).select("+password");

    //here correctPassword method is a instance method that is a method which is available to all the instance of the document collection
    //For the instance method it is more related to the document (model) so we put the method in userModel
    // so correctPassword() have to be in ---------userModel-----------
    if (!admin || !(await admin.correctPassword(password, admin.password))) {
        //   return next(new AppError('Incorrect Email or Incorrect password',400));
        return res.status(400).json({
            status: "fail",
            message: "Incorrect Email or Incorrect password",
        });
    }

    //3.if the everthing is okay then send token to the client
    createSendToken(admin, 200, res);
};


//---------------------------admin protect---------------------------
exports.protect = async(req, res, next) => {
    // read the token and check if it exists
    let token;
    let cookie;
    // console.log(token);
    // console.log('--------req.headers------');
    // console.log(req.headers);

    // console.log('--------req.headers.cookie------');
    // console.log(req.headers.cookie);
    if (req.headers.cookie) {
        token = req.headers.cookie.split("=")[1];
    }

    // console.log("--------token------");
    // console.log(token);
    // console.log("Token verification completed");

    //if token is not present then triger error
    if (!token) {
        // return next(new AppError("You are not logged In!!! Please log in again",401));
        return res.status(401).json({
            status: "fail",
            message: "You are not logged In as admin!!! Please log in again as admin",
        });
    }
    // console.log("------------------");
    // console.log("working");
    // console.log("------------------");
    // //verifying the token
    // //here the callback function is converted to the promise using the promisifying method that we have the util section as it is more easy to handle the promise rather than callback function which may lead to the callback hell condition so
    // console.log('expected error section');
    let decoded;
    try {
        decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    } catch (err) {
        console.log(err);
        return res.status(401).json({
            status: "fail",
            messsage: "JWT expires",
        });
    }

    // console.log(decoded);
    // console.log("expected error section end");

    //check whether the user exists
    const freshAdmin = await Admin.findById(decoded.id);
    // console.log(freshUser);

    if (!freshAdmin) {
        //  return next(new AppError('The user belonging to this token does no longer exists',401));
        return res.status(401).json({
            status: "fail",
            message: "The admin belonging to this token does no longer exists",
        });
    }

    //GRANT ACCESS  TO PROTECTED DATA
    req.admin = freshAdmin;
    next();
};

exports.adminPortal = (req, res) => {
    res.render("adminPortal", {
        admin: req.admin.name,
    });
};

exports.logout = (req, res) => {
    res.cookie("jwtToken", "Loggedout", {
        maxAge: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });

    res.status(200).redirect("/admin");
};



//---------------------list of unverified campaign------------------
exports.unverifiedCampaigns = async(req, res, next) => {
    try {
        const campaign = await Campaign.find({
            campaignStatus: "UNVERIFIED",
        });

        // console.log(campaign);
        return res.status(200).json({
            status: "success",
            results: campaign.length,
            data: {
                campaign,
            },
        });
    } catch (error) {
        return res.status(500).json({
            status: "Error",
            error: error.message,
        });
    }
};


//---------------------list of unverified Users------------------
exports.unverifiedUsers = async(req, res, next) => {
    try {
        const users = await User.find({
            status: "UNVERIFIED",
        });

        // console.log(users);
        return res.status(200).json({
            status: "success",
            results: users.length,
            data: {
                users,
            },
        });
    } catch (error) {
        return res.status(500).json({
            status: "Error",
            error: error.message,
        });
    }
};

exports.getUserById = async(req, res) => {
    const user = await User.findById(req.params.id);

    return res.status(200).json({
        status: "success",
        data: {
            user,
        },
    });
};


//GET ALL CAMPAIGNS
exports.getAllCampaigns = async(req, res) => {
    try {
        const campaigns = await Campaign.find({
            campaignStatus: "IN PROGRESS",
        });

        return res.status(201).json({
            status: "success",
            length: campaigns.length,
            data: {
                campaign: campaigns,
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

exports.getCampaignById = async(req, res) => {
    const campaign = await Campaign.findById(req.params.id);

    return res.status(200).json({
        status: "success",
        data: {
            campaign,
        },
    });
};




//-------------approves campaign--------------
exports.campaignApproves = async(req, res, next) => {
    const campaign = await Campaign.findById(req.params.id);

    const tempCampaign = {
        ...campaign,
    };

    if (!(tempCampaign["_doc"].campaignStatus = "VERIFIED")) {
        tempCampaign["_doc"].campaignStatus = "VERIFIED";
    }
    const updatedCampaign = await Campaign.findByIdAndUpdate(
        req.params.id,
        tempCampaign["_doc"]
    );

    if (updatedCampaign) {
        //   approveAlertEmail(campaign.contactEmail,campaign.campaignTitle,new Date())
        return res.redirect("/admin/adminPortal");
    } else {
        return res.status(404);
    }
};

exports.userApproves = async(req, res, next) => {
    const user = await User.findById(req.params.id);

    const tempUser = {
        ...user,
    };

    if (!(tempUser["_doc"].status === "VERIFIED")) {
        tempUser["_doc"].status = "VERIFIED";
        tempUser["_doc"].role = "donor";

    }
    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        tempUser["_doc"]
    );

    if (updatedUser) {
        //   approveAlertEmail(campaign.contactEmail,campaign.campaignTitle,new Date())
        return res.redirect("/admin/adminPortal");
    } else {
        return res.status(404);
    }
};

//-------------ends campaign--------------
exports.campaignEnds = async(req, res) => {
    const campaign = await Campaign.findById(req.params.id);

    const tempCampaign = {
        ...campaign,
    };

    if (!(tempCampaign["_doc"].campaignStatus = "DECLINED")) {
        tempCampaign["_doc"].campaignStatus = "DECLINED";
    }
    const updatedCampaign = await Campaign.findByIdAndUpdate(
        req.params.id,
        tempCampaign["_doc"]
    );

    if (updatedCampaign) {
        //   declineAlertEmail(campaign.contactEmail,campaign.campaignTitle,new Date())

        return res.redirect("/admin/adminPortal");
    } else {
        return res.status(404);
    }
};


//get active donar count
exports.getActiveDonarCount = async(req, res) => {
    try {
        let countAPositve = 0;
        let countBPositve = 0;
        let countABPositve = 0;
        let countOPositve = 0;
        let countANegative = 0;
        let countBNegative = 0;
        let countABNegative = 0;
        let countONegative = 0;

        const users = await User.find({});
        const bloodGroupList = users.map(element => element["bloodGroup"]);

        let totalCount = 0;

        // console.log(bloodGroupList);

        for (const item in bloodGroupList) {
            switch (bloodGroupList[item]) {
                case "A+":
                    countAPositve++;
                    break;
                case "B+":
                    countBPositve++;
                    break;
                case "AB+":
                    countABPositve++;
                    break;
                case "O+":
                    countOPositve++;
                    break;
                case "A-":
                    countANegative++;
                    break;
                case "B-":
                    countBNegative++;
                    break;
                case "AB-":
                    countABNegative++;
                    break;
                case "O-":
                    countONegative++;
                    break;
                default:
                    console.log("switch case value invalid");
                    break;
            }
            totalCount++;
        }

        // console.log(countAPositve, countBPositve, countABPositve, countOPositve);
        // console.log(countANegative, countBNegative, countABNegative, countONegative);


        return res.status(200).json({
            status: "Success",
            totalCount: totalCount,
            data: {
                "ap": countAPositve,
                "bp": countBPositve,
                "abp": countABPositve,
                "op": countOPositve,
                "an": countANegative,
                "bn": countBNegative,
                "abn": countABNegative,
                "on": countONegative,
            },
        });
    } catch (error) {
        return res.status(400).json({
            status: "Bad Request",
            message: error.message,
        });
    }
}

// Get ALL STATS
exports.getAllStatistics = async(req, res) => {
    try {
        const users = await User.find({});
        const campaings = await Campaign.find({});
        const requests = await Request.find({});

        //TODO: for total Successful Request finding request whose request is completed
        const successfulRequest = await Request.find({
            status: "COMPLETED",
        });

        //TODO: for total Donation getting sum of all the donation registered

        return res.status(200).json({
            status: "Success",
            data: {
                totalUserCount: users.length,
                totalCampaingCount: campaings.length,
                totalRequestCount: requests.length,
                totalSuccessfulRequest: successfulRequest.length,
                //totalDonation: donation,
            },
        });

    } catch (error) {
        return res.status(400).json({
            status: "Bad Request",
            message: error.message,
        });
    }
}