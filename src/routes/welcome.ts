import { welcomerModel } from "../models/welcomerMessage";
import { Router } from "express";
import { client } from "..";
import { GuildChannel } from "discord.js";
const router = Router();

router.post("/", async (req, res) => {
  const config = await welcomerModel.findOne({ guild: req.body.guildId });
  var channelArray = [];
  var channelName = "";
  if (!welcomerModel) {
    return res
      .status(200)
      .send({ message: "Welcomer is not enabled", enabled: false });
  }
  const guild = await client.guilds.cache.get(req.body.guildId);
  guild.channels.cache.forEach((channel: GuildChannel) => {
    channelArray.push(channel.name);
  });
  guild.channels.cache.forEach((channel: GuildChannel) => {
    if (channel.id == config.channelId) {
      channelName = channel.name;
    }
  });
  return res.status(200).send({
    message: config,
    enabled: true,
    channels: channelArray ? channelArray : [],
    channelName,
  });
});
export { router };
