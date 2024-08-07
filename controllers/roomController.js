const { CustomErrorHandler, RoomService } = require("../services");
const { roomDTO } = require("../dtos");

class RoomController {
  async create(req, res, next) {
    const { roomName, roomType } = req.body;

    if (!roomName || !roomType) {
      return next(
        CustomErrorHandler.badRequest("Room name and room type are required")
      );
    }

    try {
      const room = await RoomService.createRoom(
        roomName,
        roomType,
        req.user._id
      );

      const roomDTOData = new roomDTO(room);
      console.log("roomDTO:", roomDTOData);
      return res.send({ room: roomDTOData });
    } catch (err) {
      return next(CustomErrorHandler.serverError("Cannot create room"));
    }
  }
  async getRooms(req, res, next) {
    try {
        
      const rooms = await RoomService.getRooms(["Open"]);
      const roomsDTO = rooms.map((room) => new roomDTO(room));
      return res.send({ rooms: roomsDTO });
    } catch (err) {
      return next(CustomErrorHandler.serverError("Cannot get rooms"));
    }
  }
}

module.exports = new RoomController();
