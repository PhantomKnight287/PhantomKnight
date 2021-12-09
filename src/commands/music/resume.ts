import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { player } from "../..";
module.exports = {
    command: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("resume The Music"),
    async run(interaction: CommandInteraction) {
        await interaction.deferReply();
        const queue = player.getQueue(interaction.guildId);
        if (!queue || !queue.playing)
            return await interaction.editReply({
                content: "❌ | No music is being played!",
            });
        const playing = queue.setPaused(false);
        return await interaction.editReply({
            content: playing ? "▶ | Resumed!'" : "❌ | Something went wrong!",
        });
    },
};
