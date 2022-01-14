import { SlashCommandBuilder, time } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { prisma } from "../../prisma";
type param = {
    moderator: string;
    reason: string;
    timestamp: string;
    warnedUser: string;
};
module.exports = {
    command: new SlashCommandBuilder()
        .setName("warnings")
        .setDescription("Get warnings for a user")
        .addUserOption((user) => {
            return user
                .setName("user")
                .setDescription("user")
                .setRequired(true);
        })
        .addIntegerOption((pageNumber) => {
            return pageNumber
                .setName("page")
                .setDescription("Specify Page Number")
                .setRequired(false);
        }),
    async run(interaction: CommandInteraction) {
        await interaction.deferReply();
        const user = interaction.options.getUser("user");
        const pageStart = interaction.options.getInteger("page")
            ? interaction.options.getInteger("page")
            : 0;
        const pageEnd = pageStart + 10;
        const guildRecord = await prisma.warn.findFirst({
            where: {
                guildId: interaction.guildId,
            },
        });
        if (!guildRecord) {
            await interaction.editReply({
                content: "No warning Record for this guild",
            });
            return;
        }
        const warnings = guildRecord.warnings
            .slice(pageStart, pageEnd)
            .map((m: param) => {
                if (m.warnedUser === `${user.username}#${user.discriminator}`) {
                    return `**${m.moderator} warned ${m.warnedUser} ${
                        m.reason &&
                        `\n Reason: ${m.reason} \n Timestamp: ${time(
                            Math.round(Number(m.timestamp) / 1000),
                            "R"
                        )}**`
                    }`;
                }
            });

        const embed = new MessageEmbed();

        if (warnings.length == 0) {
            await interaction.editReply({
                content: "No warnings for specified User",
            });
            return;
        }
        embed.setDescription(
            `${warnings.join("\n")} ${
                guildRecord.warnings.length > pageEnd
                    ? `\n .. ${
                          guildRecord.warnings.length - pageEnd
                      } more records`
                    : ""
            }`
        );
        await interaction.editReply({ embeds: [embed] });
    },
};
