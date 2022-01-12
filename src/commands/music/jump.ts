import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { player } from "../..";

module.exports = {
    command: new SlashCommandBuilder()
        .setName("jump")
        .setDescription("Jump To A Song")
        .addIntegerOption((song) => {
            return song
                .setName("songs")
                .setDescription("Number of Songs to Jump")
                .setRequired(true);
        }),
    async run(interaction: CommandInteraction) {
        await interaction.deferReply();
        const queue = player.getQueue(interaction.guildId);
        if (!queue || !queue.playing) {
            return await interaction.editReply({
                content: "❌ | No music is being played!",
            });
        }
        const trackIndex = interaction.options.getInteger("songs") -1;
        const trackName = queue.tracks[trackIndex].title;
        queue.jump(trackIndex);
        await interaction.editReply({ content: `✅ | Jumped to ${trackName}` });
    },
};
