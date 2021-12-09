import {
    MessageEmbed,
    CommandInteraction,
    MessageActionRow,
    MessageSelectMenu,
    SelectMenuInteraction,
} from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { prisma } from "../../prisma";
module.exports = {
    command: new SlashCommandBuilder()
        .setName("nall")
        .setDescription("Sends list of emojis present in the database."),
    async run(interaction: CommandInteraction) {
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
        const options = [];
        Object.keys(embedObj).forEach((embed) => {
            options.push({
                label: embed,
                value: embed,
            });
        });
        const row = new MessageActionRow().addComponents(
            new MessageSelectMenu().setCustomId("select").addOptions(options)
        );
        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTimestamp()
            .setDescription(" ** Choose An Options from Below **");
        await interaction.editReply({ components: [row], embeds: [embed] });
        const collector =
            await interaction.channel.createMessageComponentCollector({
                time: 60000,
            });
        collector.on("collect", async (collected: SelectMenuInteraction) => {
            await collected.deferReply({ ephemeral: true });
            const emb = embedObj[collected.values[0]];
            await collected.editReply({ components: [row], embeds: [emb] });
        });
        collector.on("end", async () => {
            row.components.forEach((component) => {
                component.setDisabled(true);
            });
            await interaction.editReply({ components: [row] });
        });
    },
};
