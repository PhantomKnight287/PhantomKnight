import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
module.exports = {
    command: new SlashCommandBuilder()
        .setName("serverinfo")
        .setDescription("Get server info."),

    async run(interaction) {
        const guildIcon = interaction.guild.iconURL({ dynamic: true })
            ? interaction.guild.iconURL({ dynamic: true })
            : null;
        const emd = new MessageEmbed()
            .setAuthor("Server Info")
            .setTitle(`${interaction.guild.name}`)
            .setColor(interaction.member.displayHexColor)
            .addField("**Server name**", `${interaction.guild.name}`, true)
            .addField(
                "**Server owner**",
                `<@${interaction.guild.ownerId}>`,
                true
            )
            .addField(
                "**Member count**",
                `${
                    interaction.guild.members.cache.filter(
                        (member) => !member.user.bot
                    ).size
                }`,
                true
            )
            .addField(
                "**Channel categories**",
                `${
                    interaction.guild.channels.cache.filter(
                        (channel) => channel.type === "GUILD_CATEGORY"
                    ).size
                }`,
                true
            )
            .addField(
                "**Text channels**",
                `${
                    interaction.guild.channels.cache.filter(
                        (channel) => channel.type === "GUILD_TEXT"
                    ).size
                }`,
                true
            )
            .addField(
                "**Voice channels**",
                `${
                    interaction.guild.channels.cache.filter(
                        (channel) => channel.type === "GUILD_VOICE"
                    ).size
                }`,
                true
            )
            .addField(
                "**Roles**",
                `${interaction.guild.roles.cache.size}`,
                true
            )
            .addField("**ID**", `${interaction.guild.id}`, true)
            .addField(
                "**Server created at**",
                `${interaction.guild.createdAt.toLocaleDateString()}`,
                true
            )
            .setImage(
                "https://media.discordapp.net/attachments/616315208251605005/616319462349602816/Tw.gif?width=563&height=3"
            );
        if (guildIcon) {
            emd.setAuthor("Server Info", `${guildIcon}`);
            emd.setThumbnail(`${guildIcon}`);
        }
        await interaction.reply({ embeds: [emd] });
    },
};
