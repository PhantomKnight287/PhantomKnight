import { CommandInteraction, MessageAttachment } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { Triggered } from "discord-image-generation";

module.exports = {
  command: new SlashCommandBuilder()
    .setName("triggered")
    .setDescription("Trigger An Image")
    .addUserOption((user) => {
      return user
        .setName("user")
        .setDescription("Mention a User")
        .setRequired(false);
    }),
  async run(interaction: CommandInteraction) {
    await interaction.deferReply();
    const user = interaction.options.getUser("user")
      ? interaction.options.getUser("user")
      : interaction.user;
    const imageUrl = user.displayAvatarURL({ format: "png", size: 1024 });
    const image = await new Triggered().getImage(imageUrl);
    const attachment = new MessageAttachment(image, "trigger.gif");
    await interaction.editReply({ files: [attachment] });
  },
};
