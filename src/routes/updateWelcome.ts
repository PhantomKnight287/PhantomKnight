import { welcomerModel } from "../models/welcomerMessage";
import { Router } from "express";
const router = Router();

router.post("/", async (req, res) => {
  const guild = await welcomerModel.findOne({ guild: req.body.guildId });
  if (!guild) {
    const newConfig = new welcomerModel(req.body);
    try {
      await newConfig.save();
      return res.status(200).send({ message: "New Welcomer Config Created!" });
    } catch (error) {
      console.log(error.message);
      return res.status(500).send({ message: "An error occured" });
    }
  } else {
    try {
      await welcomerModel.findOneAndUpdate(
        { guild: req.body.guildId },
        req.body
      );
      return res.status(200).send({ message: "Update Welcome Config!" });
    } catch (error) {
      console.log(error.message);
      return res
        .status(500)
        .send({ message: "An error occured. Please try again later" });
    }
  }
});
export { router };
