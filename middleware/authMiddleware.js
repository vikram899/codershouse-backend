const { CustomErrorHandler, TokenService } = require("../services");

const authMiddleware = async (req, res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    return next(CustomErrorHandler.unAuthorized());
  }

  const userData = await TokenService.verifyAccessToken(accessToken);

  if (!userData) {
    return next(CustomErrorHandler.unAuthorized());
  }

  req.user = userData;
  next();
};
module.exports = authMiddleware;
