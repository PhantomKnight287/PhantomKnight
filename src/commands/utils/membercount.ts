import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
module.exports = {
    command: new SlashCommandBuilder()
        .setName("membercount")
        .setDescription("Get the server member count."),

    async run(interaction) {
        const emd = new MessageEmbed()
            .setColor(interaction.member.displayHexColor)
            .addField(
                "Humans",
                `${
                    interaction.guild.members.cache.filter(
                        (member) => !member.user.bot
                    ).size
                }`,
                true
            )
            .addField(
                "Bots",
                `${
                    interaction.guild.members.cache.filter(
                        (member) => member.user.bot
                    ).size
                }`,
                true
            )
            .addField(
                "Total members",
                `${interaction.guild.members.cache.size}`,
                true
            )
            .setTimestamp()
            .setImage(
                "https://media.discordapp.net/attachments/616315208251605005/616319462349602816/Tw.gif?width=563&height=3"
            );
        await interaction.reply({ embeds: [emd] });
    },
};
