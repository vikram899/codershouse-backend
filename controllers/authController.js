const Joi = require("joi");
const {
  OTPService,
  HashService,
  UserService,
  TokenService,
  CustomErrorHandler,
} = require("../services");
const { OTP_EXPIRY } = require("../config");

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

    const ttl = 1000 * 60 * parseInt(OTP_EXPIRY);

    const expiresAt = Date.now() + ttl;
    const data = `${phone}.${generatedOTP}.${expiresAt}`;
    const hashedData = await HashService.generateHash(data);

    try {
      await OTPService.sendSMS(phone, generatedOTP);
      res.json({
        phone,
        hash: `${hashedData}.${expiresAt}`,
      });
    } catch (error) {
      return next(error);
    }
  }

  async vefiyOTP(req, res, next) {
    const { phone, hash, otp } = req.body;

    //Validation of req body
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

    //OTP verification logic
    const [hashedData, expiresAt] = hash.split(".");
    if (Date.now() > parseInt(expiresAt)) {
      return next(CustomErrorHandler.invalidOTP("OTP expired"));
    }

    const data = `${phone}.${otp}.${expiresAt}`;
    const isValid = await HashService.compareHash(data, hashedData);

    if (!isValid) {
      return next(CustomErrorHandler.invalidOTP());
    }

    let user;
    //Check if user exists or not and create if not
    try {
      user = await UserService.getUser({ phone });
      if (!user) {
        user = await UserService.createUser({ phone });
      }
    } catch (err) {
      return next(CustomErrorHandler.serverError("DB Error"));
    }

    //Generate JWT token
    const { _id, activated } = user;
    const { accessToken, refreshToken } = await TokenService.generateToken({
      _id,
      activated,
    });

    res.cookie("refreshT  oken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });

    res.json({ accessToken });
  }
}

module.exports = new AuthController();
