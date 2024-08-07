const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    roomName: {
      type: String,
      required: true,
    },
    roomType: {
      type: String,
      required: true,
    },
    speakers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema, "rooms");

module.exports = Room;
