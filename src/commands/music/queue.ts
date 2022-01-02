import {
    CommandInteraction,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    ButtonInteraction,
} from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { player } from "../..";
module.exports = {
    command: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Check the Music in Queue"),
    async run(interaction: CommandInteraction) {
        await interaction.deferReply();
        let number = 0;
        const queue = player.getQueue(interaction.guildId);
        if (!queue || !queue.playing)
            return await interaction.editReply({
                content: "No Music is Being Played",
            });
        const songs = queue.tracks;
        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId("back")
                .setLabel("Back")
                .setStyle("PRIMARY"),
            new MessageButton()
                .setCustomId(`0`)
                .setLabel("\u200b")
                .setStyle("SECONDARY")
                .setDisabled(true),
            new MessageButton()
                .setCustomId("next")
                .setLabel("Next")
                .setStyle("PRIMARY")
        );
        async function sendEmbed(song: typeof songs, index: number) {
            const embed = new MessageEmbed()
                .setColor("RANDOM")
                .setTimestamp()
                .setTitle("Server Queue");
            const fixedIndex = index;
            for (index; index <= fixedIndex + 20; index++) {
                if (song[index]) {
                    embed.addField(`${song[index].title}`, "\u200b", false);
                }
            }
            return embed;
        }
        const embedObj: any = {};
        let count = 1;
        for (let i = 0; i <= songs.length; i += 20) {
            embedObj[`Page${count}`] = await sendEmbed(songs, i);
            count += 1;
        }
        await interaction.editReply({
            components: [row],
            embeds: [embedObj[Object.keys(embedObj)[number]]],
        });
        number += 1;
        const collector = interaction.channel.createMessageComponentCollector({
            time: 60000,
        });
        collector.on("collect", async (collected: ButtonInteraction) => {
            if (collected.user.id !== interaction.user.id)
                await collected.deferUpdate();
            await collected.deferUpdate();
            if (collected.customId === "back") {
                const customId = row.components[1].customId;
                row.components[1].setCustomId(`${parseInt(customId) - 1}`);
                const embed =
                    embedObj[
                        Object.keys(embedObj)[
                            parseInt(customId) === 0
                                ? 0
                                : parseInt(customId) - 1
                        ]
                    ];
                await collected.editReply({
                    embeds: [embed],
                });
            }
            if (collected.customId === "next") {
                const customId = row.components[1].customId;
                row.components[1].setCustomId(`${parseInt(customId) + 1}`);
                const embed =
                    embedObj[Object.keys(embedObj)[parseInt(customId) + 1]];
                await collected.editReply({
                    embeds: [embed],
                });
            }
        });
        collector.on("end", async () => {
            row.components.forEach((component) => {
                component.setDisabled(true);
            });
            await interaction.editReply({ components: [row] });
        });
    },
};
