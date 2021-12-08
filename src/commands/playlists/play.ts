import { CommandInteraction, MessageEmbed } from "discord.js";
import { player } from "../..";
import {
  hyperlink,
  SlashCommandBuilder,
  userMention,
} from "@discordjs/builders";
const wait = require("util").promisify(setTimeout);
import { QueryType } from "discord-player";
import { prisma } from "../../prisma";
module.exports = {
  command: new SlashCommandBuilder()
    .setName("play-playlist")
    .setDescription("Play Music in your Playlist"),
  async run(interaction: CommandInteraction) {
    await interaction.deferReply();
    const user = await prisma.playlists.findFirst({
      where: {
        userId: interaction.user.id,
      },
    });
    if (!user) {
      return await interaction.editReply({
        content: "You don't have any playlist create a playlist first.",
      });
    }
    const music: string[] = user.playList;
    async function addSong(musicQuery: string) {
      const queue = player.createQueue(interaction.guild, {
        metadata: {
          channel: interaction.channel,
        },
        ytdlOptions: {
          filter: "audioonly",
          dlChunkSize: 0,
          highWaterMark: 1 << 25,
        },
      });
      try {
        if (!queue.connection) {
          await queue.connect((interaction.member as any).voice.channel);
        }
      } catch (error) {
        console.log(error.message);
        queue.destroy();
        return await interaction.editReply({
          content: "Could not join your voice channel!",
        });
      }
      const track = await player
        .search(musicQuery, {
          requestedBy: interaction.user,
          searchEngine: QueryType.AUTO,
        })
        .then((x) => x.tracks[0])
        .catch((error) => {
          console.log(error);
        });
      if (!track) {
        await interaction.followUp({
          content: `❌ | Track **${music[0]}** not found!`,
        });
      }
      if (!queue.playing && track) {
        queue.play(track);
        const emb = new MessageEmbed()
          .setTimestamp()
          .setTitle(` :minidisc:  ${track.title}`)
          .setThumbnail(`${track.thumbnail}`)
          .addField(
            "<:dogeThugLife:848437513067954178> Requested By",
            `${userMention(interaction.user.id)}`,
            true
          )
          .addField(":clock1: Duration", `**${track.duration}**`, true)
          .addField("Url", `${hyperlink("Click Here", `${track.url}`)}`, true)
          .setColor("RANDOM");
        await interaction.followUp({
          embeds: [emb],
        });
        await wait(3000);
      } else if (queue.playing && track) {
        queue.addTrack(track);
        await interaction.editReply({ content: "Songs Added to Queue!" });
      }
    }
    await addSong(music[0]);
    music.splice(0, 1);
    music.forEach(async (song: string) => {
      await addSong(song);
    });
  },
};
