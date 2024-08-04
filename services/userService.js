const { User } = require("../models");

class UserService {
  async createUser(data) {

    return User.create(data);
  }

  async getUser(filter) {
    return await User.findOne(filter);
  }

  async updateUser(filter, name, imagePath) {

    const user = await User.findOne(filter);

    if (user) {
      user.activated = true;
      user.name = name;
      user.avatar = `/storage/${imagePath}`;
      user.save();
    }

    return user;
  }
}

module.exports = new UserService();
