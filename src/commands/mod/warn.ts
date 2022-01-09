import { SlashCommandBuilder } from "@discordjs/builders";
import {
    CommandInteraction,
    GuildMember,
    MessageEmbed,
    Permissions,
} from "discord.js";
import { prisma } from "../../prisma";
import { client } from "../..";
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
    async run(interaction: CommandInteraction) {
        await interaction.deferReply({ ephemeral: true });
        const user = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason");
        if (
            !(interaction.member as unknown as GuildMember).permissions.has([
                Permissions.FLAGS.KICK_MEMBERS,
                Permissions.FLAGS.BAN_MEMBERS,
                Permissions.FLAGS.MANAGE_MESSAGES,
            ])
        ) {
            return await interaction.editReply({
                content: "You don't have the necessary permissions!",
            });
        }
        const warnings = await prisma.warn.findFirst({
            where: {
                guildId: interaction.guildId,
            },
        });
        if (!warnings) {
            const warningsArray = [
                {
                    moderator: `${interaction.user.username}#${interaction.user.discriminator}`,
                    reason: reason ? reason : "No Reason Specified",
                    timestamp: `${new Date().getTime()}`,
                    warnedUser: `${user.username}#${user.discriminator}`,
                },
            ];
            await prisma.warn.create({
                data: {
                    guildId: interaction.guildId,
                    warnings: warningsArray,
                },
            });
            const dmUser = client.users.cache.get(user.id);
            const embed = new MessageEmbed()
                .setColor("RANDOM")
                .setTitle("You've Been Warned")
                .setDescription(
                    `You've been warned in ${interaction.guild.name}`
                )
                .addField("Reason", reason ? reason : "No Reason Specified")
                .setTimestamp()
                .setAuthor({
                    name: `${interaction.user.username}#${interaction.user.discriminator}`,
                    iconURL: interaction.user.displayAvatarURL(),
                });
            if (dmUser) {
                (await dmUser.createDM(true))
                    .send({ embeds: [embed] })
                    .catch((error) => {
                        console.log(error.message);
                    });
            }
            const successEmbed = new MessageEmbed()
                .setTimestamp()
                .setColor("GREEN")
                .setDescription(
                    `${user.username}#${user.discriminator} has been Warned`
                );
            await interaction.editReply({ embeds: [successEmbed] });
        } else if (warnings) {
            const newWarnings = {
                moderator: `${interaction.user.username}#${interaction.user.discriminator}`,
                reason: reason ? reason : "No Reason Specified",
                timestamp: `${new Date().getTime()}`,
                warnedUser: `${user.username}#${user.discriminator}`,
            };
            warnings.warnings.push(newWarnings);
            await prisma.warn.update({
                where: {
                    guildId: interaction.guildId,
                },
                data: {
                    warnings: warnings.warnings,
                },
            });
            const dmUser = client.users.cache.get(user.id);
            const embed = new MessageEmbed()
                .setColor("RANDOM")
                .setTitle("You've Been Warned")
                .setDescription(
                    `You've been warned in ${interaction.guild.name}`
                )
                .addField("Reason", reason ? reason : "No Reason Specified")
                .setTimestamp()
                .setAuthor({
                    name: `${interaction.user.username}#${interaction.user.discriminator}`,
                    iconURL: interaction.user.displayAvatarURL(),
                });
            if (dmUser) {
                (await dmUser.createDM(true))
                    .send({ embeds: [embed] })
                    .catch((error) => {
                        console.log(error.message);
                    });
            }
            const successEmbed = new MessageEmbed()
                .setTimestamp()
                .setColor("GREEN")
                .setDescription(
                    `${user.username}#${user.discriminator} has been Warned`
                );
            await interaction.editReply({ embeds: [successEmbed] });
        }
    },
};
