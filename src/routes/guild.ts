import { Router } from "express";
import { client } from "..";
const router = Router();

router.post("/", async (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "No content present in body" });
  }
  const guild = await client.guilds.cache.get(req.body.guildId);
  if (!guild) {
    return res.status(400).send({ message: "You cannot manage this guild!" });
  }
  const user = await guild.members.fetch(req.body.userId);
  if (!user) {
    return res
      .status(400)
      .send({ message: "User is not present in the guild!" });
  }
  const hasPerms = user.permissions.has("MANAGE_GUILD");
  res.status(200).send({ message: hasPerms ? true : false });
});

export { router };
