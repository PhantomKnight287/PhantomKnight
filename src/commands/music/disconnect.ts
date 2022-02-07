import {
    CommandInteraction,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
} from "discord.js";
import { hyperlink, SlashCommandBuilder } from "@discordjs/builders";
import { player } from "../..";
module.exports = {
    command: new SlashCommandBuilder()
        .setName("disconnect")
        .setDescription("Stop the Music!"),
    async run(interaction: CommandInteraction) {
        await interaction.deferReply();
        const queue = player.getQueue(interaction.guildId);
        if (!queue || !queue.playing) {
            return await interaction.editReply({
                content: "❌ | No music is being played!",
            });
        }
        queue.destroy();
        const embed = new MessageEmbed()
            .setTimestamp()
            .setTitle("Thank you for using the bot!")
            .setDescription(
                `The bot has been disconnected from the voice channel!
                If You like our service, please consider giving us a star on ${hyperlink(
                    "Github",
                    "https://github.com/PhantomKnight287/PhantomKnight"
                )}
                `
            )
            .setColor("RANDOM");
        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setStyle("LINK")
                .setLabel("Github")
                .setURL("https://github.com/PhantomKnight287/PhantomKnight")
        );
        return interaction.editReply({ embeds: [embed], components: [row] });
    },
};
