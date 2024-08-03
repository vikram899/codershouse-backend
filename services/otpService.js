const crypto = require("crypto");
const { SMS_SID, SMS_TOKEN, SMS_FROM } = require("../config");

const twilio = require("twilio")(SMS_SID, SMS_TOKEN, {
  lazyLoading: true,
});

class OTPService {
  async generateOTP() {
    return crypto.randomInt(1000, 9999);
  }

  async sendSMS(phone, otp) {
    try {
      return await twilio.messages.create({
        body: `Your OTP is ${otp}`,
        from: SMS_FROM,
        to: phone,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = new OTPService();
