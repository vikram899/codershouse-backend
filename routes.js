const express = require("express");
const { AuthController } = require("./controllers");
const router = express.Router();


router.post("/send-otp", AuthController.sendOTP);
router.post("/verify-otp", AuthController.vefiyOTP);

module.exports = router;
