import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { player } from "../..";
module.exports = {
    command: new SlashCommandBuilder()
        .setName("fast-forward")
        .setDescription("Fast Forward A song")
        .addIntegerOption((seconds) => {
            return seconds
                .setName("seconds")
                .setDescription("Seconds to fast forward")
                .setRequired(true);
        }),
    async run(interaction: CommandInteraction) {
        await interaction.deferReply();
        const queue = player.getQueue(interaction.guildId);
        if (!queue || !queue.playing)
            return await interaction.editReply({
                content: "❌ | No music is being played!",
            });
        await queue.seek(
            (parseInt(queue.current.duration) +
                interaction.options.getInteger("seconds")) *
                1000
        );
        await interaction.editReply({
            content: `✅ | Fast Forwarded ${interaction.options.getInteger(
                "seconds"
            )} seconds`,
        });
    },
};
