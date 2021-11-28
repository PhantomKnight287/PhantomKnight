import { Router } from "express";
import { client } from "..";
const router = Router();

router.post("/", async (req, res) => {
  if (!req.body.guildId)
    return res.status(400).send({ message: "No guildId Present in the body" });
  const guild = client.guilds.cache.get(req.body.guildId);
  if (!guild) {
    return res
      .status(400)
      .send({ message: "Bot is not present in the guild!" });
  }
  res.status(200).send({ message: guild });
});
export { router };
