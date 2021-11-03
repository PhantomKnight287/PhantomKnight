import Canvas from "canvas";
import { MessageAttachment } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import type { CommandInteraction } from "discord.js";
module.exports = {
  command: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Testing Image manipulation")
    .addUserOption((user) =>
      user.setName("member").setDescription("Mention a user").setRequired(true)
    ),
  async run(interaction: CommandInteraction) {
    const user = interaction.options.getUser("member")
      ? interaction.options.getUser("member")
      : interaction.user;
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
    await interaction.deferReply();
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
    context.fillText("Welcome", canvas.width / 2.5, canvas.height / 3.5);

    context.font = applyText(canvas, `${user.username}!`);
    context.fillStyle = "#ffffff";
    context.fillText(
      `${user.username}!`,
      canvas.width / 2.5,
      canvas.height / 1.8
    );

    context.beginPath();
    context.arc(125, 125, 100, 0, Math.PI * 2, true);
    context.closePath();
    context.clip();

    const avatar = await Canvas.loadImage(
      user.displayAvatarURL({ format: "jpg" })
    );
    context.drawImage(avatar, 25, 25, 200, 200);

    const attachment = new MessageAttachment(
      canvas.toBuffer(),
      "profile-image.png"
    );

    await interaction.editReply({ files: [attachment] });
  },
};
