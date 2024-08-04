const mongoose = require("mongoose");

const refTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const RefToken = mongoose.model("RefToken", refTokenSchema, "tokens");

module.exports = RefToken;
