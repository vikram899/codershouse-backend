const { JWT_ACCESS_KEY, JWT_REFRESH_KEY } = require("../config");
const jwt = require("jsonwebtoken");
const { RefToken } = require("../models");

class TokenService {
  async generateToken(user) {
    const accessToken = jwt.sign(user, JWT_ACCESS_KEY, { expiresIn: "15m" });
    const refreshToken = jwt.sign(user, JWT_REFRESH_KEY, { expiresIn: "1y" });
    return { accessToken, refreshToken };
  }

  async storeRefreshToken(userId, token) {
    try {
      await RefToken.create({ userId, token });
    } catch (err) {
      throw new Error("Token not stored");
    }
  }

  async verifyAccessToken(token) {
    try {
      const user = jwt.verify(token, JWT_ACCESS_KEY);
      return user;
    } catch (err) {
      return null;
    }
  }
}

module.exports = new TokenService();
