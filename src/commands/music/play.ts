import {
    CommandInteraction,
    GuildMember,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
} from "discord.js";
import { SlashCommandBuilder, userMention } from "@discordjs/builders";
import { player } from "../../";
import { QueryType } from "discord-player";
module.exports = {
    command: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play Music in Your voice Channel")
        .addStringOption((song) => {
            return song
                .setName("song")
                .setDescription("Enter name of the song")
                .setRequired(true);
        }),
    async run(interaction: CommandInteraction) {
        await interaction.deferReply();
        const query = interaction.options.getString("song");
        const queue = player.createQueue(interaction.guild, {
            metadata: {
                channel: interaction.channel,
            },
            ytdlOptions: {
                filter: "audioonly",
                dlChunkSize: 0,
                highWaterMark: 1 << 25,
                quality: "highest",
            },
            leaveOnEmptyCooldown: 180,
        });
        try {
            if (!queue.connection)
                await queue.connect(
                    (interaction.member as GuildMember).voice.channel
                );
        } catch (error) {
            console.log(error.message);
            queue.destroy();
            return await interaction.editReply({
                content: "Could not join your voice channel!",
            });
        }
        const track = await player
            .search(query, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO,
            })
            .then((x) => x.tracks[0])
            .catch((error) => {
                console.log(error);
            });
        const allSongs = await player.search(query, {
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO,
        });
        if (!allSongs.tracks[0] || !track)
            return await interaction.followUp({
                content: `❌ | Track **${query}** not found!`,
            });
        if (allSongs.playlist != null) {
            if (!queue.playing) {
                queue.play(allSongs.playlist.tracks[0]);
                allSongs.playlist.tracks.forEach(async (song, index) => {
                    if (index != 0) {
                        queue.addTrack(song);
                    }
                });
            } else {
                allSongs.playlist.tracks.forEach(async (song) => {
                    queue.addTrack(song);
                });
            }
            const messageEmbed = new MessageEmbed()
                .setTitle(
                    ` :minidisc: Added ${allSongs.playlist.tracks.length} songs to the queue!`
                )
                .setColor("RANDOM")
                .setTimestamp()
                .addField(
                    "<:dogeThugLife:848437513067954178> Requested By",
                    `${userMention(interaction.user.id)}`,
                    true
                )
                .addField("Playlist Name", allSongs.playlist.title, true);
            const row = new MessageActionRow().addComponents(
                new MessageButton()
                    .setLabel("Open Playlist")
                    .setStyle("LINK")
                    .setURL(allSongs.playlist.url)
            );
            if (allSongs.playlist.thumbnail) {
                messageEmbed.setThumbnail(allSongs.playlist.thumbnail);
            }
            return await interaction.followUp({
                embeds: [messageEmbed],
                components: [row],
            });
        }
        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setLabel("Open Playlist")
                .setStyle("LINK")
                .setURL(track.url)
        );
        if (!queue.playing) {
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

                .setColor("RANDOM");
            return await interaction.followUp({
                embeds: [emb],
                components: [row],
            });
        } else {
            queue.addTrack(track);
            const embed = new MessageEmbed()
                .setTimestamp()
                .setTitle(` :minidisc:  ${track.title}`)
                .setThumbnail(`${track.thumbnail}`)
                .addField(
                    "<:dogeThugLife:848437513067954178> Requested By",
                    `${userMention(interaction.user.id)}`,
                    true
                )
                .addField(":clock1: Duration", `**${track.duration}**`, true)

                .setColor("RANDOM")
                .setFooter({ text: "Song Added to Queue!" });
            await interaction.followUp({ embeds: [embed], components: [row] });
        }
    },
};
