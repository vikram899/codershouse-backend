const crypto = require("crypto");
const { SECRET_KEY } = require("../config");

class HashService {
  async generateHash(data) {
    return crypto.createHmac("sha256", SECRET_KEY).update(data).digest("hex");
  }

  async compareHash(data, hash) {
    const generatedHash = await this.generateHash(data);
    return hash === generatedHash;
  }
}

module.exports = new HashService();
