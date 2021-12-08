import { GuildMember, MessageAttachment } from "discord.js";
import type { Client } from "discord.js";
import Canvas from "canvas";
import { prisma } from "../prisma";
async function sendWelcomeMessage(
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
  const canvas = Canvas.createCanvas(1024, 250);
  const context = canvas.getContext("2d");

  const background = await Canvas.loadImage(
    "https://discordjs.guide/assets/canvas-preview.30c4fe9e.png"
  );
  context.drawImage(background, 0, 0, canvas.width, canvas.height);

  context.strokeStyle = "#0099ff";
  context.strokeRect(0, 0, canvas.width, canvas.height);

  context.font = "30px sans-serif";
  context.fillStyle = "#ffffff";
  const messageContent = isGuildPresent.welcomerMessage
    .replace("|user|", `<@${newJoinedMember.user.id}>`)
    .replace("|guild|", `${newJoinedMember.guild.name}`);
  context.fillText(
    `${newJoinedMember.user.username} Just Joined The Server\nMember #${
      newJoinedMember.guild.members.cache.size + 1
    }`,
    canvas.width / 2.5,
    canvas.height / 1.8
  );

  context.beginPath();
  context.arc(125, 125, 100, 0, Math.PI * 2, true);
  context.closePath();
  context.clip();

  const avatar = await Canvas.loadImage(
    newJoinedMember.displayAvatarURL({ format: "jpg" })
  );
  context.drawImage(avatar, 25, 25, 200, 200);

  const attachment = new MessageAttachment(
    canvas.toBuffer(),
    "welcomeMessage.png"
  );
  client.channels.fetch(`${isGuildPresent.channelId}`).then((channel) => {
    (channel as any).send({
      files: [attachment],
      content: `${messageContent}`,
    });
  });
}
export default sendWelcomeMessage;
