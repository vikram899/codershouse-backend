const { JWT_ACCESS_KEY, JWT_REFRESH_KEY } = require("../config");
const jwt = require("jsonwebtoken");
const { RefToken } = require("../models");

class TokenService {
  async generateToken(user) {
    const accessToken = jwt.sign(user, JWT_ACCESS_KEY, { expiresIn: "1m" });
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

  async verifyRefreshToken(token) {
    try {
      const user = jwt.verify(token, JWT_REFRESH_KEY);
      return user;
    } catch (err) {
      return null;
    }
  }

  async findRefToken(userId, token) {
    return await RefToken.findOne({ userId, token });
  }

  async updateRefreshToken(userId, token) {
    await RefToken.updateOne({ userId }, { token });
  }

  async removeRefreshToken(token) {
    await RefToken.deleteOne({ token });
  }
}

module.exports = new TokenService();
