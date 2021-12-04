import { CommandInteraction, MessageAttachment } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { Bed } from "discord-image-generation";

module.exports = {
  command: new SlashCommandBuilder()
    .setName("bed")
    .setDescription("Why Do You Hate Me Brother?")
    .addUserOption((user) => {
      return user
        .setName("user")
        .setDescription("Mention a User")
        .setRequired(true);
    }),
  async run(interaction: CommandInteraction) {
    await interaction.deferReply();
    const user = interaction.options.getUser("user");

    const imageUrl1 = user.displayAvatarURL({ format: "png", size: 1024 });
    const imageUrl2 = interaction.user.displayAvatarURL({
      format: "png",
      size: 1024,
    });
    const image = await new Bed().getImage(imageUrl2, imageUrl1);
    const attachment = new MessageAttachment(image, "bed.png");
    await interaction.editReply({ files: [attachment] });
  },
};
