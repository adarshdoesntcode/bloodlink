const express = require("express");
const adminController = require("../controllers/adminController");

//Analogy can be : think as chaining method
const router = express.Router();

router.route("/").get(adminController.home);
router.route("/signup").post(adminController.signup);
router.route("/login").post(adminController.login);
router.route("/logout").get(adminController.protect, adminController.logout);
router.route("/adminPortal").get(adminController.protect, adminController.adminPortal);
router.route("/getusers").get(adminController.protect, adminController.getAllUsers);


//route for campaign information

router
    .route("/adminPortal/campaign/:id")
    .get(adminController.protect, adminController.getCampaignById);

router
    .route("/adminPortal/user/:id")
    .get(adminController.protect, adminController.getUserById);


//get unverified campaigns
router
    .route("/unverifiedCampaigns")
    .get(adminController.protect, adminController.unverifiedCampaigns);

//get all campaings
// router
//     .route("/allCampaigns")
//     .get(adminController.protect, adminController.getAllCampaigns);

//route for user information
router
    .route("/unverifiedUsers")
    .get(adminController.protect, adminController.unverifiedUsers);


//route that approves and end the campaign
router
    .route("/adminPortal/campaignApproves/:id")
    .get(adminController.protect, adminController.campaignApproves);

router
    .route("/adminPortal/userApproves/:id")
    .get(adminController.protect, adminController.userApproves);



router
    .route("/adminPortal/campaignEnds/:id")
    .get(adminController.protect, adminController.campaignEnds);

//get active donr count
router
    .route("/adminPortal/activeDonarCount")
    .get(adminController.protect,adminController.getActiveDonarCount);

//get all statistics
router
    .route("/adminPortal/getAllStats")
    .get(adminController.protect,adminController.getAllStatistics);




module.exports = router;