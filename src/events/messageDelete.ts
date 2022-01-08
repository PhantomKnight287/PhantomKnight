import { messageHandler } from "../functions";
import { Message, PartialMessage, TextChannel } from "discord.js";
import { channelMention } from "@discordjs/builders";
export const singleMessageDelete = async (
    message: Message<boolean> | PartialMessage
) => {
    const { embed, enabled, channel } = await messageHandler(message);
    if (!enabled) {
        return null;
    } else if (enabled) {
        embed
            .setAuthor({
                name: message.author.username,
                iconURL: message.author.displayAvatarURL(),
            })
            .setDescription(
                `Message Deleted in ${channelMention(message.channelId)}`
            )
            .addField(`Message`, `${message.content}`)
            .setTimestamp();
        if (!channel) {
            return null;
        }
        (channel as TextChannel).send({ embeds: [embed] });
    }
};
