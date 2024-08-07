const { Room } = require("../models");

class RoomService {
  async createRoom(roomName, roomType, ownerId) {
    const room = Room.create({
      roomName,
      roomType,
      ownerId,
      speakers: [ownerId],
    });

    return room;
  }
  async getRooms(roomTypes) {
    const rooms = Room.find({ roomType: { $in: roomTypes } })
      .populate("speakers")
      .populate("ownerId")
      .exec();

    return rooms;
  }
}
module.exports = new RoomService();
