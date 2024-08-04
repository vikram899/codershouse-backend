const express = require("express");
const { AuthController, ActivateController } = require("./controllers");
const router = express.Router();
const {authMiddleware} = require("./middleware");

router.post("/send-otp", AuthController.sendOTP);
router.post("/verify-otp", AuthController.vefiyOTP);
router.post("/activate", authMiddleware ,ActivateController.activate);

module.exports = router;
