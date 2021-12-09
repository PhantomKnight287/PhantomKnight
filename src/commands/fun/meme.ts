import { SlashCommandBuilder } from "@discordjs/builders";
import type { CommandInteraction } from "discord.js";
import { MessageEmbed } from "discord.js";
import Axios from "axios";
module.exports = {
    command: new SlashCommandBuilder()
        .setName("meme")
        .setDescription("Post Meme from r/programmerhumour"),
    async run(interaction: CommandInteraction) {
        await interaction.deferReply();
        const response = await Axios.get(
            "https://meme-api.herokuapp.com/gimme"
        );
        if (!response.data) {
            await interaction.editReply({
                content: "An error occured while executing this command!",
            });
            return;
        }
        const emb = new MessageEmbed()
            .setTitle(`${response.data.title}`)
            .setImage(`${response.data.url}`);
        await interaction.editReply({ embeds: [emb] });
    },
};
