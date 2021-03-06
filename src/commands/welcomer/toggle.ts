import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { prisma } from "../../prisma";
module.exports = {
    command: new SlashCommandBuilder()
        .setName("toggle")
        .setDescription("Toggle Welcome for your server")
        .addBooleanOption((enabled) => {
            return enabled
                .setName("enable")
                .setDescription("Toggle Welcome for Your Server")
                .setRequired(true);
        }),
    async run(interaction: CommandInteraction) {
        await interaction.deferReply();
        const welcomeConfig = await prisma.welcomers.findFirst({
            where: {
                guildId: interaction.guildId,
            },
        });
        if (!welcomeConfig)
            return void (await interaction.editReply({
                content:
                    "Welcomer is not configured for your server,Configure it first!",
            }));
        if (
            !welcomeConfig.enabled &&
            interaction.options.getBoolean("enable")
        ) {
            await prisma.welcomers.update({
                where: {
                    guildId: interaction.guildId,
                },
                data: {
                    enabled: true,
                },
            });
            return void (await interaction.editReply({
                content: "Enabled Welcomer for your server!",
            }));
        } else if (
            welcomeConfig.enabled &&
            !interaction.options.getBoolean("enable")
        ) {
            await prisma.welcomers.update({
                where: {
                    guildId: interaction.guildId,
                },
                data: {
                    enabled: false,
                },
            });
            return void (await interaction.editReply({
                content: "Disabled Welcomer for your server!",
            }));
        } else {
            const replyKeyword =
                welcomeConfig.enabled &&
                interaction.options.getBoolean("enable")
                    ? "Enabled"
                    : "Disabled";
            await interaction.editReply({
                content: `Welcomer is already ${replyKeyword} for your server!`,
            });
        }
    },
};
