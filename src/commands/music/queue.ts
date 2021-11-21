import { CommandInteraction, MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { player } from "../..";
module.exports = {
  command: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Check the Music in Queue")
    .addIntegerOption((pageNumber) => {
      return pageNumber
        .setName("page")
        .setDescription("Specify Page Number in Queue")
        .setRequired(false);
    }),
  async run(interaction: CommandInteraction) {
    await interaction.deferReply();
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing)
      return await interaction.editReply({
        content: "No Music is Being Played",
      });
    const pageNumber = interaction.options.getInteger("page")
      ? interaction.options.getInteger("page")
      : 1;
    const pageStart = 10 * (pageNumber - 1);
    const pageEnd = pageStart + 10;
    const currentTrack = queue.current;
    const tracks = queue.tracks
      .slice(pageStart, pageEnd)
      .map((track, index) => {
        return `${index + pageStart + 1}. **${track.title}** ([link](${
          track.url
        }))`;
      });
    const emb = new MessageEmbed()
      .setTitle("Server Queue")
      .setDescription(
        `${tracks.join("\n")}${
          queue.tracks.length > pageEnd
            ? `\n...${queue.tracks.length - pageEnd} more track(s)`
            : ""
        }`
      )
      .setColor(0xff0000)
      .addField(
        "Now Playing",
        `🎶 | **${currentTrack.title}** ([link](${currentTrack.url}))`
      );
    await interaction.editReply({ embeds: [emb] });
  },
};
