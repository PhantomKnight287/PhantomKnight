import { GuildMember, MessageAttachment } from "discord.js";
import type { Client } from "discord.js";
import Canvas from "canvas";
import { welcomerModel } from "../models/welcomerMessage";
async function sendWelcomeMessage(
  newJoinedMember: GuildMember,
  client: Client
) {
  const isGuildPresent = await welcomerModel.findOne({
    guildId: newJoinedMember.guild.id,
  });
  if (isGuildPresent) {
    const applyText = (canvas: Canvas.Canvas, text: string) => {
      const context = canvas.getContext("2d");

      // Declare a base size of the font
      let fontSize = 70;

      do {
        // Assign the font to the context and decrement it so it can be measured again
        context.font = `${(fontSize -= 10)}px sans-serif`;
        // Compare pixel width of the text to the canvas minus the approximate avatar size
      } while (context.measureText(text).width > canvas.width - 300);

      // Return the result to use in the actual canvas
      return context.font;
    };
    const canvas = Canvas.createCanvas(700, 250);
    const context = canvas.getContext("2d");

    const background = await Canvas.loadImage(
      "https://discordjs.guide/assets/canvas-preview.30c4fe9e.png"
    );
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    context.strokeStyle = "#0099ff";
    context.strokeRect(0, 0, canvas.width, canvas.height);

    context.font = "28px sans-serif";
    context.fillStyle = "#ffffff";
    const messageContent = isGuildPresent.welcomerMessage
      .replace("|user|", `${newJoinedMember.user.username}`)
      .replace("|guild|", `${newJoinedMember.guild.name}`);
    context.fillText(messageContent, canvas.width / 2.5, canvas.height / 3.5);

    context.font = applyText(canvas, messageContent);
    context.fillStyle = "#ffffff";
    context.fillText(
      messageContent,
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
      (channel as any).send({ files: [attachment] });
    });
  }
}
export default sendWelcomeMessage;
