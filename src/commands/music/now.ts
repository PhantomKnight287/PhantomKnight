import { CommandInteraction, MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { player } from "../..";
module.exports = {
    command: new SlashCommandBuilder()
        .setName("now")
        .setDescription("See what's currently being played"),
    async run(interaction: CommandInteraction) {
        await interaction.deferReply();
        const queue = player.getQueue(interaction.guildId);
        if (!queue || !queue.playing)
            return await interaction.editReply({
                content: "❌ | No music is being played!",
            });
        const progressbar = queue.createProgressBar();
        const timestamp = queue.getPlayerTimestamp();
        const emb = new MessageEmbed()
            .setTimestamp()
            .setTitle("Now Playing")
            .setDescription(
                `🎶 | **${queue.current.title}**! (\`${
                    timestamp.progress + "%"
                }\`)`
            )
            .addField("\u200b", `${progressbar.replace(/ 0:00/g, "◉ LIVE")}`)
            .setColor("RANDOM")
            .setTimestamp();
        await interaction.editReply({ embeds: [emb] });
    },
};
