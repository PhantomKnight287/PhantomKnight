import { SlashCommandBuilder } from "@discordjs/builders";
import type { CommandInteraction } from "discord.js";
import { prisma } from "../../prisma";
module.exports = {
    command: new SlashCommandBuilder()
        .setName("welcomer-update")
        .setDescription("Update Welcomer Config for your server")
        .addStringOption((message) =>
            message
                .setName("message")
                .setDescription("Set A welcomer Message")
                .setRequired(true)
        )
        .addChannelOption((channel) =>
            channel
                .setName("channel")
                .setDescription("Select Channel To Send Welcomer Message")
                .setRequired(true)
        ),
    async run(interaction: CommandInteraction) {
        await interaction.deferReply();
        const isOldGuild = await prisma.welcomers.findFirst({
            where: {
                guildId: interaction.guildId,
            },
        });
        if (!isOldGuild) {
            await interaction.editReply({
                content:
                    "Welcomer is not configured for this server, configure it usigng welcomer command!",
            });
            return;
        }
        const message = interaction.options.getString("message");
        const channel = interaction.options.getChannel("channel");
        await prisma.welcomers.update({
            where: {
                guildId: interaction.guildId,
            },
            data: {
                enabled: true,
                welcomerMessage: message,
                channelId: channel.id,
            },
        });
        await interaction.editReply({
            content: "Welcomer Config For This server is updated successfully!",
        });
    },
};
