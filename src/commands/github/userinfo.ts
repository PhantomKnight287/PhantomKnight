import { SlashCommandBuilder, time } from "@discordjs/builders";
import {
    CommandInteraction,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
} from "discord.js";
import axios from "axios";
export const command = new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Get User Info from Github")
    .addStringOption((username) =>
        username
            .setName("username")
            .setDescription("Enter Github username")
            .setRequired(true)
    );

const apiBaseUrl = "https://api.github.com/users/";

export const run = async (interaction: CommandInteraction) => {
    await interaction.deferReply();
    const username = interaction.options.getString("username");
    const url = `${apiBaseUrl}${username}`;
    let response;
    try {
        response = await axios.get(url);
    } catch {
        return await interaction.editReply({
            content: "User not found!",
        });
    }
    if (!response.data) {
        await interaction.editReply({
            content: "An error occured while executing this command!",
        });
        return;
    }
    const row = new MessageActionRow().addComponents(
        new MessageButton()
            .setStyle("LINK")
            .setLabel("Open Profile")
            .setURL(response.data.html_url)
            .setEmoji("<:github:954782695882358906>")
    );
    const emb = new MessageEmbed()
        .addFields([
            {
                name: "Username",
                value: response.data.login,
                inline: true,
            },
            {
                name: "Name",
                value: `${response.data.name || "No Name"}`,
                inline: true,
            },
            {
                name: "Bio",
                value: `${response.data.bio || "No Bio"}`,
                inline: true,
            },
            {
                name: "Followers",
                value: `${response.data.followers}`,
                inline: true,
            },
            {
                name: "Following",
                value: `${response.data.following}`,
                inline: true,
            },
            {
                name: "Public Repos",
                value: `${response.data.public_repos}`,
                inline: true,
            },
            {
                name: "Public Gists",
                value: `${response.data.public_gists}`,
                inline: true,
            },
            {
                name: "Account Created At",
                value: `${time(
                    Math.round(
                        new Date(response.data.created_at).getTime() / 1000
                    ),
                    "R"
                )}`,
                inline: true,
            },
        ])
        .setColor("RANDOM")
        .setThumbnail(response.data.avatar_url);
    await interaction.editReply({
        embeds: [emb],
        components: [row],
    });
};
