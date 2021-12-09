import { CommandInteraction, MessageAttachment } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { Delete } from "discord-image-generation";

module.exports = {
    command: new SlashCommandBuilder()
        .setName("trash")
        .setDescription("Delete this trash")
        .addUserOption((user) => {
            return user
                .setName("user")
                .setDescription("Mention a User")
                .setRequired(true);
        }),
    async run(interaction: CommandInteraction) {
        await interaction.deferReply();
        const user = interaction.options.getUser("user");

        const imageUrl1 = user.displayAvatarURL({ format: "png", size: 1024 });

        const image = await new Delete().getImage(imageUrl1);
        const attachment = new MessageAttachment(image, "trash.png");
        await interaction.editReply({ files: [attachment] });
    },
};
