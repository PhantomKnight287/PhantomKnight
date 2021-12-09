import { CommandInteraction, MessageAttachment } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import Jimp from "jimp";
module.exports = {
    command: new SlashCommandBuilder()
        .setName("greyscale")
        .setDescription("Grey Scale your Avatar")
        .addUserOption((user) => {
            return user
                .setName("user")
                .setDescription("Mention a user")
                .setRequired(false);
        }),
    async run(interaction: CommandInteraction) {
        await interaction.deferReply();
        const user = interaction.options.getUser("user")
            ? interaction.options.getUser("user")
            : interaction.user;
        Jimp.read(user.displayAvatarURL({ size: 1024, format: "png" })).then(
            async (image) => {
                image
                    .quality(100)
                    .greyscale()
                    .getBuffer(Jimp.MIME_PNG, async (error, file) => {
                        if (error) {
                            console.log(error);
                            return await interaction.editReply({
                                content: "An Error Occured",
                            });
                        }
                        const attachment = new MessageAttachment(
                            file,
                            "greyscale.png"
                        );
                        await interaction.editReply({ files: [attachment] });
                    });
            }
        );
    },
};
