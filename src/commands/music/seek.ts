import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { player } from "../..";
module.exports = {
  command: new SlashCommandBuilder()
    .setName("seek")
    .setDescription("Seek to the given time")
    .addIntegerOption((seconds) => {
      return seconds.setName("seconds").setDescription("The time to seek");
    }),
  async run(interaction: CommandInteraction) {
    await interaction.deferReply();
    const time = interaction.options.getInteger("seconds")
      ? interaction.options.getInteger("seconds")
      : 10;
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing)
      return await interaction.editReply({
        content: "❌ | No music is being played!",
      });
    await queue.seek(time * 1000);
    console.log(queue);
    await interaction.editReply({ content: `✅ | Seeked to ${time} seconds` });
  },
};
