import {
    CommandInteraction,
    MessageAttachment,
    MessageEmbed,
} from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { Gay } from "discord-image-generation";

module.exports = {
    command: new SlashCommandBuilder()
        .setName("gay")
        .setDescription("Show Your Gay Pride")
        .addUserOption((user) => {
            return user
                .setName("user")
                .setDescription("Mention a User")
                .setRequired(false);
        }),
    async run(interaction: CommandInteraction) {
        await interaction.deferReply();
        const user = interaction.options.getUser("user")
            ? interaction.options.getUser("user")
            : interaction.user;
        const imageUrl = user.displayAvatarURL({ format: "png", size: 1024 });
        const image = await new Gay().getImage(imageUrl);
        const attachment = new MessageAttachment(image, "gay.png");
        const embed = new MessageEmbed().setImage("attachment://gay.png");
        await interaction.editReply({ embeds: [embed], files: [attachment] });
    },
};
