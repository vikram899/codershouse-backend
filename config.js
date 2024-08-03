require("dotenv").config();
const { PORT, DEBUG_MODE, SECRET_KEY, SMS_SID, SMS_TOKEN,SMS_FROM } = process.env;

module.exports = {
  PORT,
  DEBUG_MODE,
  SECRET_KEY,
  SMS_SID,
  SMS_TOKEN,
  SMS_FROM
};
