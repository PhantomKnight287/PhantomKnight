import { messageHandler } from "../functions";
import { Message, PartialMessage, TextChannel } from "discord.js";
import { channelMention } from "@discordjs/builders";

export const messageUpdateHandler = async (
    oldMessage: Message<boolean> | PartialMessage,
    newMessage: Message<boolean> | PartialMessage
) => {
    const { channel, embed, enabled } = await messageHandler(oldMessage);
    if (!enabled) return;
    embed
        .setAuthor({
            name: oldMessage.author.username,
            iconURL: oldMessage.author.displayAvatarURL(),
        })
        .setDescription(
            `Message Deleted in ${channelMention(oldMessage.channelId)}`
        )
        .addFields(
            {
                name: "Before",
                value: `${oldMessage.content}`,
                inline: false,
            },
            {
                name: "After",
                value: `${newMessage.content}`,
                inline: false,
            }
        )
        .setTimestamp();
    if (!channel) return;
    (channel as TextChannel).send({ embeds: [embed] });
};
