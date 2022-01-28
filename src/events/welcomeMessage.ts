import { GuildMember, MessageAttachment, TextChannel } from "discord.js";
import type { Client } from "discord.js";
import Canvas from "discord-canvas";
import { prisma } from "../prisma";
export async function sendWelcomeMessage(
    newJoinedMember: GuildMember,
    client: Client
) {
    const isGuildPresent = await prisma.welcomers.findFirst({
        where: {
            guildId: newJoinedMember.guild.id,
        },
    });
    if (!isGuildPresent || isGuildPresent.enabled !== true) {
        return;
    }
    const canvas = await new Canvas.Welcome();
    const image = await canvas
        .setUsername(`${newJoinedMember.user.username}`)
        .setDiscriminator(`${newJoinedMember.user.discriminator}`)
        .setMemberCount(`${newJoinedMember.guild.memberCount}`)
        .setGuildName(`${newJoinedMember.guild.name}`)
        .setAvatar(
            `${newJoinedMember.user.displayAvatarURL({ format: "png" })}`
        )
        .setColor("border", "#8015EA")
        .setColor("username-box", "#8015EA")
        .setColor("discriminator-box", "#8015EA")
        .setColor("message-box", "#8015EA")
        .setColor("title", "#8015EA")
        .setColor("avatar", "#8015EA")
        .toAttachment();

    const attachment = new MessageAttachment(
        image.toBuffer(),
        "welcomeMessage.png"
    );
    const messageContent = isGuildPresent.welcomerMessage
        .replace("|user|", `<@${newJoinedMember.user.id}>`)
        .replace("|guild|", `${newJoinedMember.guild.name}`);

    client.channels.fetch(`${isGuildPresent.channelId}`).then((channel) => {
        (channel as TextChannel)
            .send({
                files: [attachment],
                content: `${messageContent}`,
            })
            .catch((error) => {
                console.log(error.message);
            });
    });
}
