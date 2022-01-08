import { Message, MessageEmbed, PartialMessage } from "discord.js";
import { client } from "..";
import { prisma } from "../prisma";

export const messageHandler = async (
    message: Message<boolean> | PartialMessage
) => {
    const embed = new MessageEmbed().setColor("RANDOM");
    const config = await prisma.logsConfig.findFirst({
        where: {
            guildId: message.guildId,
        },
    });
    const enabled = config ? config.enabled : false;
    const channel = client.channels.cache.get(`${config.channelId}`);
    return { embed, enabled, channel };
};
