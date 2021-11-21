import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { player } from "../..";
module.exports = {
  command: new SlashCommandBuilder()
    .setName("previous")
    .setDescription("Play the previous Song"),
  async run(interaction: CommandInteraction) {
    await interaction.deferReply();
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing)
      return void interaction.editReply({
        content: "❌ | No music is being played!",
      });
    await queue.back();
    await interaction.editReply({
      content: "✅ | Playing the previous track!",
    });
  },
};
