import { GuildMember, MessageAttachment, TextChannel } from "discord.js";
import type { Client } from "discord.js";
import Canvas from "canvas";
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
    const canvas = Canvas.createCanvas(700, 250);
    const context = canvas.getContext("2d");

    const background = await Canvas.loadImage(
        "https://discordjs.guide/assets/canvas-preview.30c4fe9e.png"
    );
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    context.strokeStyle = "#0099ff";
    context.strokeRect(0, 0, canvas.width, canvas.height);

    context.font = "35px sans-serif";
    context.fillStyle = "#ffffff";
    const messageContent = isGuildPresent.welcomerMessage
        .replace("|user|", `<@${newJoinedMember.user.id}>`)
        .replace("|guild|", `${newJoinedMember.guild.name}`);

    const avatar = await Canvas.loadImage(
        newJoinedMember.displayAvatarURL({ format: "jpg" })
    );
    context.drawImage(avatar, canvas.width / 2 - avatar.width / 2, 25);
    const text = `${newJoinedMember.user.username} Just Joined The Server`;
    context.fillText(
        text,
        canvas.width / 2 - context.measureText(text).width / 2,
        60 + avatar.height
    );
    const attachment = new MessageAttachment(
        canvas.toBuffer(),
        "welcomeMessage.png"
    );
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
