import { SlashCommandBuilder } from "@discordjs/builders";
import type { CommandInteraction } from "discord.js";
import { prisma } from "../../prisma";
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
    const isOldGuild = await prisma.welcomers.findFirst({
      where: {
        guildId: interaction.guildId,
      },
    });
    if (isOldGuild) {
      await interaction.editReply({
        content: "Welcomer is Already Configured For Your Server.",
      });
      return;
    }
    const message = interaction.options.getString("message");
    const channel = interaction.options.getChannel("channel");
    await prisma.welcomers.create({
      data: {
        channelId: channel.id,
        enabled: true,
        guildId: interaction.guildId,
        welcomerMessage: message,
      },
    });
    await interaction.editReply({
      content: "Welcomer for this server is configured successfully!",
    });
  },
};
