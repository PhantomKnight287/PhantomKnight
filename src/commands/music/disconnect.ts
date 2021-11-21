import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { player } from "../..";
module.exports = {
  command: new SlashCommandBuilder()
    .setName("disconnect")
    .setDescription("Stop the Music!"),
  async run(interaction: CommandInteraction) {
    await interaction.deferReply();
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) {
      return await interaction.editReply({
        content: "❌ | No music is being played!",
      });
    }
    queue.destroy();
    return interaction.editReply({ content: "🛑 | Stopped the player!" });
  },
};
