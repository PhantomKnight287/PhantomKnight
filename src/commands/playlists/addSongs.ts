import { CommandInteraction, MessageEmbed } from "discord.js";
import {
    hyperlink,
    SlashCommandBuilder,
    userMention,
} from "@discordjs/builders";
import { player } from "../..";
import { QueryType } from "discord-player";
import { prisma } from "../../prisma";
module.exports = {
    command: new SlashCommandBuilder()
        .setName("add")
        .setDescription("Add a song to playlist")
        .addStringOption((song) => {
            return song
                .setName("song")
                .setDescription("Name of song")
                .setRequired(true);
        }),
    async run(interaction: CommandInteraction) {
        let i = 0;
        await interaction.deferReply();
        const song = await player
            .search(interaction.options.getString("song"), {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO,
            })
            .then((x) => x.tracks)
            .catch(async (error) => {
                console.log(error.message);
                return await interaction.editReply({
                    content: "An Error Occured",
                });
            });
        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle(`:minidisc: ${song[i].title}`)
            .addField(
                "<:dogeThugLife:848437513067954178> Requested By",
                `${userMention(interaction.user.id)}`,
                true
            )
            .addField(":clock1: Duration", `**${song[i].duration}**`, true)
            .addField(
                "Url",
                `${hyperlink("Click Here", `${song[i].url}`)}`,
                true
            )
            .setThumbnail(`${song[i].thumbnail}`)
            .setDescription(
                `Manage Your Playlist by Clicking ${hyperlink(
                    "Here",
                    "https://bot.phantomknight.tk"
                )}`
            );
        await interaction.editReply({
            embeds: [embed],
        });
        const user = await prisma.playlists.findFirst({
            where: {
                userId: interaction.user.id,
            },
        });
        if (!user) {
            console.log(song[i].title);
            const playList = [
                { title: song[i].title, thumbnail: song[i].thumbnail },
            ];
            console.log(playList);
            await prisma.playlists.create({
                data: {
                    userId: interaction.user.id,
                    playList,
                },
            });
        } else if (user) {
            const Playlist = user.playList;
            Playlist.push({
                title: song[i].title,
                thumbnail: song[i].thumbnail,
            });
            await prisma.playlists.update({
                where: {
                    userId: interaction.user.id,
                },
                data: {
                    playList: Playlist,
                },
            });
        }
    },
};
