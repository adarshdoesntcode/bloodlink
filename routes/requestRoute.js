const express = require("express");
const Request = require("../models/requestModel");
const requestController = require("../controllers/requestController");


const router = express.Router();

//create request route
router.route("/createRequest").post(requestController.createRequest);

router.route("/getAllRequest").get(requestController.getAllRequest);

module.exports = router;