import { CommandInteraction, MessageEmbed } from "discord.js";
import {
    hyperlink,
    SlashCommandBuilder,
    userMention,
} from "@discordjs/builders";
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
            },
        });
        try {
            if (!queue.connection)
                await queue.connect((interaction.member as any).voice.channel);
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
        if (!track)
            return await interaction.followUp({
                content: `❌ | Track **${query}** not found!`,
            });
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
                .addField(
                    "Url",
                    `${hyperlink("Click Here", `${track.url}`)}`,
                    true
                )
                .setColor("RANDOM");
            return await interaction.followUp({
                embeds: [emb],
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
                .addField(
                    "Url",
                    `${hyperlink("Click Here", `${track.url}`)}`,
                    true
                )
                .setColor("RANDOM")
                .setFooter("Song Added to Queue!");
            await interaction.followUp({ embeds: [embed] });
        }
    },
};
