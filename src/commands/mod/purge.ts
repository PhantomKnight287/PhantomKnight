import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, TextChannel } from "discord.js";

module.exports = {
    command: new SlashCommandBuilder()
        .setName("purge")
        .setDescription("Purges a number of messages from the current channel.")
        .addIntegerOption((message) => {
            return message
                .setName("amount")
                .setDescription("The amount of messages to purge.")
                .setRequired(true);
        }),
    async run(interaction: CommandInteraction) {
        await interaction.deferReply({ ephemeral: true });
        if (
            !(interaction.member as GuildMember).permissions.has([
                "MANAGE_MESSAGES",
            ])
        ) {
            return interaction.editReply({
                content: "You don't have enough permission to purge messages!",
            });
        }
        await (interaction.channel as TextChannel).bulkDelete(
            interaction.options.getInteger("amount")
        );
        return interaction.editReply({
            content: `Successfully purged ${interaction.options.getInteger(
                "amount"
            )} messages!`,
        });
    },
};
