const { BASE_URL } = require("../config");

class roomDTO {
  _id;
  roomName;
  roomType;
  ownerId;
  createdAt;
  speakers;

  constructor(room) {
    this._id = room._id;
    this.roomName = room.roomName;
    this.roomType = room.roomType;
    this.ownerId = room.ownerId;
    this.createdAt = room.createdAt;
    this.speakers = room.speakers;
  }
}

module.exports = roomDTO;
