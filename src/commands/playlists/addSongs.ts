import {
    ButtonInteraction,
    CommandInteraction,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
} from "discord.js";
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
            .setFooter("To Add song to playlist press green button")
            .setThumbnail(`${song[i].thumbnail}`);
        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId("okay")
                .setEmoji("✅")
                .setStyle("SUCCESS"),
            new MessageButton()
                .setCustomId("next")
                .setEmoji("<a:aFail:848315264491192320>")
                .setStyle("DANGER")
        );
        await interaction.editReply({ components: [row], embeds: [embed] });
        const collector = interaction.channel.createMessageComponentCollector({
            time: 60000,
        });
        collector.on("collect", async (collected: ButtonInteraction) => {
            if (collected.user !== interaction.user) {
                return await collected.deferUpdate();
            }
            if (collected.customId == "okay") {
                await collected.deferUpdate();
                const user = await prisma.playlists.findFirst({
                    where: {
                        userId: interaction.user.id,
                    },
                });
                if (!user) {
                    console.log(song[i].title);
                    const playList = [song[i].title];
                    console.log(playList);
                    await prisma.playlists.create({
                        data: {
                            userId: interaction.user.id,
                            playList,
                        },
                    });
                    embed.setFooter("Song Added to Playlist");
                    await collected.editReply({
                        embeds: [embed],
                        components: [],
                    });
                } else if (user) {
                    const Playlist: string[] = user.playList;
                    Playlist.push(song[i].title);
                    await prisma.playlists.update({
                        where: {
                            userId: interaction.user.id,
                        },
                        data: {
                            playList: Playlist,
                        },
                    });
                    embed.setFooter("Song Added to Playlist");
                    await collected.editReply({
                        embeds: [embed],
                        components: [],
                    });
                    await collector.dispose(collected);
                }
            } else if (collected.customId == "next") {
                await collected.deferUpdate();
                i++;
                if ((song as any).length - 1 < i) {
                    await collected.editReply({
                        content: "This was the last song",
                    });
                    return;
                }
                const emb = new MessageEmbed()
                    .setColor("RANDOM")
                    .setTitle(`:minidisc: ${song[i].title}`)
                    .addField(
                        "<:dogeThugLife:848437513067954178> Requested By",
                        `${userMention(interaction.user.id)}`,
                        true
                    )
                    .addField(
                        ":clock1: Duration",
                        `**${song[i].duration}**`,
                        true
                    )
                    .addField(
                        "Url",
                        `${hyperlink("Click Here", `${song[i].url}`)}`,
                        true
                    )
                    .setFooter("To Add song to playlist press green button")
                    .setThumbnail(`${song[i].thumbnail}`);
                await collected.editReply({ embeds: [emb], components: [row] });
            }
        });
        collector.on("end", async () => {
            row.components.forEach((component) => {
                component.setDisabled(true);
            });
            await interaction.editReply({ embeds: [embed], components: [] });
        });
    },
};
