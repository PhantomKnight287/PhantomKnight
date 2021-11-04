import { SlashCommandBuilder } from "@discordjs/builders";
import type { CommandInteraction } from "discord.js";
import { welcomerModel } from "../../models/welcomerMessage";
module.exports = {
  command: new SlashCommandBuilder()
    .setName("welcomer")
    .setDescription("Configure Welcomer for your server")
    .addStringOption((message) =>
      message
        .setName("message")
        .setDescription("Set A welcomer Message")
        .setRequired(true)
    )
    .addChannelOption((channel) =>
      channel
        .setName("channel")
        .setDescription("Select Channel To Send Welcomer Message")
        .setRequired(true)
    ),
  async run(interaction: CommandInteraction) {
    await interaction.deferReply();
    const isOldGuild = await welcomerModel.findOne({
      guildId: interaction.guildId,
    });
    if (isOldGuild) {
      await interaction.editReply({
        content: "Welcomer is Already Configured For Your Server.",
      });
      return;
    }
    const message = interaction.options.getString("message");
    const channel = interaction.options.getChannel("channel");
    const newWelcomerConfig = new welcomerModel({
      welcomerMessage: message,
      channelId: channel.id,
      guildId: interaction.guildId,
    });
    await newWelcomerConfig.save();
    await interaction.editReply({
      content: "Welcomer for this server is configured successfully!",
    });
  },
};
