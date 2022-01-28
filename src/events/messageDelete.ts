import { messageHandler } from "../functions";
import { Message, PartialMessage, TextChannel } from "discord.js";
import { channelMention, userMention } from "@discordjs/builders";
import { client } from "..";
export const singleMessageDelete = async (
    message: Message<boolean> | PartialMessage
) => {
    if (
        message.author.id === client.user.id ||
        !message.content ||
        message.embeds.length > 0
    )
        return;
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
                `**Message sent by ${userMention(
                    message.author.id
                )} Deleted in ${channelMention(message.channelId)}**`
            )
            .addField(
                `Message`,
                `${message.content ? message.content : "\u200b"}`
            )
            .setTimestamp();
        if (!channel) {
            return null;
        }
        (channel as TextChannel).send({ embeds: [embed] });
    }
};
