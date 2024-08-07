const express = require("express");
const {
  AuthController,
  ActivateController,
  RoomController,
} = require("./controllers");
const router = express.Router();
const { authMiddleware } = require("./middleware");

router.post("/send-otp", AuthController.sendOTP);
router.post("/verify-otp", AuthController.vefiyOTP);
router.get("/refresh", AuthController.refreshToken);
router.post("/logout", authMiddleware, AuthController.logout);

router.post("/activate", authMiddleware, ActivateController.activate);

router.post("/room", authMiddleware, RoomController.create);
router.get("/rooms", authMiddleware, RoomController.getRooms);

module.exports = router;
