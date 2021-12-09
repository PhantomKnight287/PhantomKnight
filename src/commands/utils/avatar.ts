import { MessageEmbed } from "discord.js";
import type { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
module.exports = {
    command: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("Sends an avatar of User")
        .addUserOption((user) =>
            user.setName("member").setDescription("Mention a user")
        ),
    async run(interaction: CommandInteraction) {
        const user = interaction.options.getUser("member")
            ? interaction.options.getUser("member")
            : interaction.user;
        const avatarUrl = user.displayAvatarURL({ size: 1024 });
        if (avatarUrl) {
            const embed = new MessageEmbed()
                .setTitle(`Avatar of ${user.username}`)
                .setImage(`${avatarUrl}`);
            await interaction.reply({ embeds: [embed] });
        } else {
            await interaction.reply({
                content: `The avatar of ${user.username} cannot be found!`,
            });
        }
    },
};
