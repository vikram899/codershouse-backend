const Joi = require("joi");
const { OTPService, HashService } = require("../services");
const CustomErrorHandler = require("../services/customErrorHandler");

class AuthController {
  async sendOTP(req, res, next) {
    const { phone } = req.body;

    const registerSchema = Joi.object({
      phone: Joi.string()
        .pattern(/(^[0-9]+$)|(^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$)/)
        .required(),
    });

    const { error } = registerSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const generatedOTP = await OTPService.generateOTP();

    const ttl = 1000 * 60 * 2;
    const expiresAt = Date.now() + ttl;
    const data = `${phone}.${generatedOTP}.${expiresAt}`;
    const hashedData = await HashService.generateHash(data);

    try {
      await OTPService.sendSMS(phone, generatedOTP);
      res.json({ 
        phone, 
        hash: `${hashedData}.${expiresAt}` 
      });
    } catch (error) {
      return next(error);
    }
  }

  async vefiyOTP(req, res, next) {
    const { phone, hash, otp } = req.body;

    const verifySchema = Joi.object({
      phone: Joi.string()
        .pattern(/(^[0-9]+$)|(^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$)/)
        .required(),
      hash: Joi.string().required(),
      otp: Joi.number().required(),
    });

    const { error } = verifySchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const [hashedData, expiresAt] = hash.split(".");
    if (Date.now() > parseInt(expiresAt)) {
      return next(CustomErrorHandler.invalidOTP("OTP expired"));
    }

    const data = `${phone}.${otp}.${expiresAt}`;
    const isValid = await HashService.compareHash(data, hashedData);

    if (!isValid) {
      return next(CustomErrorHandler.invalidOTP());      
    }

    res.json({ message: "OTP verified successfully" });
  }
}

module.exports = new AuthController();
