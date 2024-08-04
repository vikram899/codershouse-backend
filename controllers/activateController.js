const { CustomErrorHandler, UserService } = require("../services");
const Jimp = require("jimp");
const userDTO = require("../dtos/userDTO");
const path = require("path");

class ActivateController {
  async activate(req, res, next) {
    const { name, avatar } = req.body;

    if (!name || !avatar) {
      return next(
        CustomErrorHandler.badRequest("Please provide name and avatar")
      );
    }

    const buffer = Buffer.from(
      avatar.replace(/^data:image\/png;base64,/, ""),
      "base64"
    );
    const imagePath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;

    try {
      const jimResp = await Jimp.read(buffer);
      jimResp
        .resize(150, Jimp.AUTO)
        .write(path.resolve(__dirname, `../storage/${imagePath}`));
    } catch (err) {
      return next(
        CustomErrorHandler.serverError("Could not process the image")
      );
    }

    const userId = req.user._id;
    let user;
    try {
      user = await UserService.updateUser({ _id: userId }, name, imagePath);
      if (!user) {
        return next(CustomErrorHandler.notFound("User Not Found"));
      }
    } catch (error) {
      return next(CustomErrorHandler.serverError());
    }

    res.send({ user: new userDTO(user), isAuth: true });
  }
}
module.exports = new ActivateController();
