import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, Permissions } from "discord.js";
import { prisma } from "../../prisma";
module.exports = {
    command: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("Warn a user")
        .addUserOption((user) => {
            return user
                .setName("user")
                .setDescription("Mention a user to warn")
                .setRequired(true);
        })
        .addStringOption((reason) => {
            return reason.setName("reason").setDescription("Reason to warn");
        }),
    async run(interaction: CommandInteraction, client: Client) {
        await interaction.deferReply({ ephemeral: true });
        const user = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason");
        if (
            (interaction.member.permissions as any).has([
                Permissions.FLAGS.KICK_MEMBERS,
                Permissions.FLAGS.BAN_MEMBERS,
            ])
        ) {
            const guildRecords = await prisma.warnings.findFirst({
                where: {
                    guildId: interaction.guildId,
                },
            });
            if (guildRecords) {
                const warnings = [
                    ...(guildRecords as any).warnings,
                    {
                        userId: user.id,
                        reason,
                        moderatorName: interaction.user.username,
                    },
                ];
                await prisma.warnings.update({
                    where: {
                        guildId: interaction.user.id,
                    },
                    data: {
                        warnings,
                    },
                });
            } else {
                const warnings = [
                    {
                        userId: user.id,
                        reason,
                        moderatorName: interaction.user.username,
                    },
                ];
                await prisma.warnings.create({
                    data: {
                        warnings,
                        guildId: interaction.guildId,
                    },
                });
            }

            try {
                client.users.cache
                    .get(user.id)
                    .send(
                        `You have been warned in ${
                            interaction.guild.name
                        }\n Reason:${reason ? reason : "No Reason Specified"}`
                    );
            } catch (error) {
                console.log(error.message);
            }
            await interaction.editReply({
                content: `Successfully warned ${user.username}`,
            });
        }
    },
};
