const { User } = require("../models");

class UserService {
  async createUser(user) {
    return User.create(user);
  }

  async getUser(filter) {
    return await User.findOne(filter);
  }
}

module.exports = new UserService();
