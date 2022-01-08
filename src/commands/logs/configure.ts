import { SlashCommandBuilder } from "@discordjs/builders";
import {
    CommandInteraction,
    GuildMember,
    Permissions,
    TextChannel,
} from "discord.js";
import { client } from "../..";
import { prisma } from "../../prisma";
module.exports = {
    command: new SlashCommandBuilder()
        .setName("logs")
        .setDescription("Configure Logs For Your Server.")
        .addSubcommand((command) => {
            return command
                .setName("enable")
                .setDescription("Enable Logs For Your Server")
                .addChannelOption((channel) => {
                    return channel
                        .setName("channel")
                        .setDescription("Select A Channel to send logs")
                        .setRequired(true);
                });
        })
        .addSubcommand((disableCommand) => {
            return disableCommand
                .setName("disable")
                .setDescription("Disable Logs For Your Server.");
        }),
    async run(interaction: CommandInteraction) {
        await interaction.deferReply({ ephemeral: true });
        if (
            !(interaction.member as GuildMember).permissions.has([
                Permissions.FLAGS.MANAGE_GUILD,
            ])
        ) {
            return await interaction.editReply({
                content: "You don't have `MANAGE_GUILD` permission.",
            });
        }
        const command = interaction.options.getSubcommand();
        const config = await prisma.logsConfig.findFirst({
            where: {
                guildId: interaction.guildId,
            },
        });
        if (command === "enable") {
            if (!config) {
                const channel = await client.channels.cache.get(
                    `${interaction.options.getChannel("channel").id}`
                );
                if (!channel) {
                    return await interaction.editReply({
                        content: "The Mentioned Channel Does not Exist!",
                    });
                }
                try {
                    const msg = await (channel as TextChannel).send({
                        content:
                            "This message is for checking permission. You can delete this message",
                    });
                    await msg.delete();
                } catch (err) {
                    console.log(err);
                    return await interaction.editReply({
                        content:
                            "I don't have Permission to Send Message in the channel.",
                    });
                }
                await prisma.logsConfig.create({
                    data: {
                        channelId: interaction.options.getChannel("channel").id,
                        enabled: true,
                        guildId: interaction.guildId,
                    },
                });
                await interaction.editReply({
                    content: "Configured Logs For Your Server!",
                });
            } else if (config) {
                if (config.enabled) {
                    return await interaction.editReply({
                        content: "Logs are already Configured for your server.",
                    });
                }
                await prisma.logsConfig.update({
                    where: {
                        guildId: interaction.guildId,
                    },
                    data: {
                        channelId: interaction.options.getChannel("channel").id,
                        enabled: true,
                    },
                });
                return await interaction.editReply({
                    content: "Enabled Logs for Your Server",
                });
            }
        } else if (command === "disable") {
            if (!config) {
                return await interaction.editReply({
                    content: "Logs aren't configured for your server!",
                });
            }
            await prisma.logsConfig.update({
                where: {
                    guildId: interaction.guildId,
                },
                data: {
                    channelId: config.channelId,
                    enabled: false,
                },
            });
            await interaction.editReply({
                content: "Disabled Logs For Your Server!",
            });
        }
    },
};
