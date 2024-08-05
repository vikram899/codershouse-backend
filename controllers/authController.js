const Joi = require("joi");
const {
  OTPService,
  HashService,
  UserService,
  TokenService,
  CustomErrorHandler,
} = require("../services");
const { OTP_EXPIRY } = require("../config");
const userDTO = require("../dtos/userDTO");

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
      //await OTPService.sendSMS(phone, generatedOTP);
      res.json({
        phone,
        hash: `${hashedData}.${expiresAt}`,
        otp: generatedOTP,
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

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });

    try {
      await TokenService.storeRefreshToken(_id, refreshToken);
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }

    const newUser = new userDTO(user);
    res.json({ user: newUser, isAuth: true });
  }

  async refreshToken(req, res, next) {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return next(CustomErrorHandler.unAuthorized());
    }

    let userId;
    try {
      const { _id } = await TokenService.verifyRefreshToken(refreshToken);
      userId = _id;
    } catch (err) {
      return next(CustomErrorHandler.unAuthorized());
    }

    let user;
    try {
      user = await UserService.getUser({ _id: userId });
      if (!user) {
        return next(CustomErrorHandler.unAuthorized());
      }
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }

    const token = TokenService.findRefToken(userId, refreshToken);

    if (!token) {
      return next(CustomErrorHandler.unAuthorized());
    }

    const { _id } = user;
    const { accessToken, refreshToken: newRefreshToken } =
      await TokenService.generateToken({ _id });

    res.cookie("refreshToken", newRefreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });

    try {
      await TokenService.updateRefreshToken(_id, newRefreshToken);
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }

    const newUser = new userDTO(user);
    res.json({ user: newUser, isAuth: true });
  }

  async logout(req, res, next) {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return next(CustomErrorHandler.unAuthorized());
    }

    let userId;
    try {
      const { _id } = await TokenService.verifyRefreshToken(refreshToken);
      userId = _id;
    } catch (err) {
      return next(CustomErrorHandler.unAuthorized());
    }

    try {
      await TokenService.removeRefreshToken(refreshToken);
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }

    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");

    res.json({ user: null, isAuth: false });
  }
}

module.exports = new AuthController();
