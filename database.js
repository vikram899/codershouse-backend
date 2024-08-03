const mongoose = require("mongoose");
const { DB_URL } = require("./config");

const DBCONNECT = () => {
  mongoose
    .connect(DB_URL, {

    })
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = DBCONNECT;