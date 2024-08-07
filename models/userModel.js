const mongoose = require("mongoose");
const { BASE_URL } = require("../config");

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    activated: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      required: false,
      default: "",
    },
    avatar: {
      type: String,
      required: false,
      default: "",
      get: (avatar) => {
        if (avatar) {
          return `${BASE_URL}${avatar}`;
        }
        return avatar;
      },
    },
  },
  { timestamps: true, toJSON: { getters: true } }
);

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
