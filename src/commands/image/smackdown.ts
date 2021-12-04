import { CommandInteraction, MessageAttachment } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { Smackdown } from "../../classes/smackdown";
module.exports = {
  command: new SlashCommandBuilder()
    .setName("smackdown")
    .setDescription("You know what it is!")
    .addUserOption((user) => {
      return user
        .setName("user")
        .setDescription("Mention a User")
        .setRequired(true);
    }),
  async run(interaction: CommandInteraction) {
    await interaction.deferReply();
    const user = interaction.options.getUser("user");
    const buffer = await new Smackdown().generateImage(
      interaction.user.displayAvatarURL({ format: "png", size: 1024 }),
      user.displayAvatarURL({ format: "png", size: 1024 })
    );
    const attachment = new MessageAttachment(buffer, "smackdown.png");
    await interaction.editReply({ files: [attachment] });
  },
};
