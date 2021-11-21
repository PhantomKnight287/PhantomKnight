import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { player } from "../..";
module.exports = {
  command: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the current playing track"),
  async run(interaction: CommandInteraction) {
    await interaction.deferReply();
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) {
      return await interaction.editReply({
        content: "❌ | No music is being played!",
      });
    }
    const currentTrack = queue.current;
    const success = queue.skip();
    await interaction.editReply({
      content: success
        ? `✅ | Skipped **${currentTrack.title}**!`
        : "❌ | Something went wrong!",
    });
  },
};
