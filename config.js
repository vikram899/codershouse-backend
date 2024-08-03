require("dotenv").config();
const {
  PORT,
  DEBUG_MODE,
  SECRET_KEY,
  SMS_SID,
  SMS_TOKEN,
  SMS_FROM,
  DB_URL,
  JWT_ACCESS_KEY,
  JWT_REFRESH_KEY,
  OTP_EXPIRY,
} = process.env;

module.exports = {
  PORT,
  DEBUG_MODE,
  SECRET_KEY,
  SMS_SID,
  SMS_TOKEN,
  SMS_FROM,
  DB_URL,
  JWT_ACCESS_KEY,
  JWT_REFRESH_KEY,
  OTP_EXPIRY,
};
