const { BASE_URL } = require("../config");

class userDTO {
  _id;
  phone;
  activated;
  createdAt;
  name;
  avatar;

  constructor(user) {
    this._id = user._id;
    this.phone = user.phone;
    this.activated = user.activated;
    this.createdAt = user.createdAt;
    this.name = user.name;
    this.avatar = user.avatar;
  }
}

module.exports = userDTO;
