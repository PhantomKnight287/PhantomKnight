import {
    MessageEmbed,
    CommandInteraction,
    MessageActionRow,
    MessageButton,
    ButtonInteraction,
} from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { prisma } from "../../prisma";
module.exports = {
    command: new SlashCommandBuilder()
        .setName("nall")
        .setDescription("Sends list of emojis present in the database."),
    async run(interaction: CommandInteraction) {
        let number = 0;
        await interaction.deferReply();
        const allEmojis = await prisma.emojis.findMany();
        async function sendEmbed(emojis: typeof allEmojis, index: number) {
            const embed = new MessageEmbed()
                .setColor("RANDOM")
                .setTimestamp()
                .setDescription(
                    "** These Are the Emojis You can Use Without Nitro **"
                );
            const fixedIndex = index;
            for (index; index <= fixedIndex + 20; index++) {
                if (emojis[index]) {
                    embed.addField(
                        `${emojis[index].emoji}`,
                        `\`${emojis[index].customName}\``,
                        true
                    );
                }
            }
            return embed;
        }
        const embedObj: any = {};
        let count = 1;
        for (let i = 0; i <= allEmojis.length; i += 20) {
            embedObj[`Page${count}`] = await sendEmbed(allEmojis, i);
            count += 1;
        }

        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId("back")
                .setLabel("Back")
                .setStyle("PRIMARY"),
            new MessageButton()
                .setCustomId(`${number}`)
                .setLabel("\u200b")
                .setStyle("SECONDARY")
                .setDisabled(true),
            new MessageButton()
                .setCustomId("next")
                .setLabel("Next")
                .setStyle("PRIMARY")
        );
        await interaction.editReply({
            components: [row],
            embeds: [embedObj[Object.keys(embedObj)[number]]],
        });
        number += 1;
        const collector =
            await interaction.channel.createMessageComponentCollector({
                time: 60000,
            });
        collector.on("collect", async (collected: ButtonInteraction) => {
            if (collected.user.id !== interaction.user.id)
                await collected.deferUpdate();
            await collected.deferUpdate()
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
