import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { playlistModel } from "../../models/playlist";

module.exports = {
  command: new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Remove a song from your playlist")
    .addStringOption((songName) => {
      return songName
        .setName("song")
        .setDescription("Name of song to remove from playlist")
        .setRequired(true);
    }),
  async run(interaction: CommandInteraction) {
    var songTitle = null;
    await interaction.deferReply();
    const user = await playlistModel.findOne({ userId: interaction.user.id });
    if (!user) {
      return await interaction.editReply({
        content: "You don't have any playlist. Create one first",
      });
    }
    const songName = interaction.options.getString("song");
    const userPlaylist: string[] = user.playList;
    userPlaylist.map((song, index) => {
      if (song.toLowerCase().includes(songName.toLowerCase())) {
        songTitle = userPlaylist.splice(index, 1)[0];
      }
    });
    if (!songTitle) {
      return await interaction.editReply({
        content: `No song name ${songName} found in the playlist!`,
      });
    } else {
      await playlistModel.findOneAndUpdate(
        { userId: interaction.user.id },
        { playList: userPlaylist }
      );
      return await interaction.editReply({
        content: `**${songTitle}** removed from your playlist!`,
      });
    }
  },
};
