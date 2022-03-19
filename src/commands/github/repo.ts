import { SlashCommandBuilder, time } from "@discordjs/builders";
import {
    CommandInteraction,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
} from "discord.js";
import axios from "axios";

export const command = new SlashCommandBuilder()
    .setName("repo")
    .setDescription("Get Repo Info from Github")
    .addStringOption((username) =>
        username
            .setName("username")
            .setDescription("Enter Github username")
            .setRequired(true)
    )
    .addStringOption((reponame) =>
        reponame
            .setName("reponame")
            .setDescription("Enter Github reponame")
            .setRequired(true)
    );

export const run = async (interaction: CommandInteraction) => {
    await interaction.deferReply();
    const reponame = interaction.options.getString("reponame");
    const username = interaction.options.getString("username");
    const url = `https://api.github.com/repos/${username}/${reponame}`;
    let response;
    try {
        response = await axios.get(url);
    } catch {
        return await interaction.editReply({
            content: "Repo not found!",
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
            .setLabel("Open Repo")
            .setURL(response.data.html_url)
            .setEmoji("<:github:954782695882358906>"),
        new MessageButton()
            .setStyle("LINK")
            .setLabel("Open Owner Profile")
            .setURL(response.data.owner.html_url)
            .setEmoji("<:github:954782695882358906>")
    );
    const emb = new MessageEmbed()
        .addFields([
            {
                name: "Repo Name",
                value: response.data.name,
                inline: true,
            },
            {
                name: "Description",
                value: response.data.description || "No Description",
                inline: true,
            },
            {
                name: "Language",
                value: response.data.language || "No Language",
                inline: true,
            },
            {
                name: "Star Count",
                value: `${response.data.stargazers_count}`,
                inline: true,
            },
            {
                name: "Fork Count",
                value: `${response.data.forks_count}`,
                inline: true,
            },
            {
                name: "Watchers",
                value: `${response.data.watchers_count}`,
                inline: true,
            },
            {
                name: "Open Issues",
                value: `${response.data.open_issues_count}`,
                inline: true,
            },
            {
                name: "Created On",
                value: `${time(
                    Math.round(
                        new Date(response.data.created_at).getTime() / 1000
                    ),
                    "R"
                )}`,
                inline: true,
            },
            {
                name: "Updated On",
                value: `${time(
                    Math.round(
                        new Date(response.data.updated_at).getTime() / 1000
                    ),
                    "R"
                )}`,
                inline: true,
            },
            {
                name: "Pushed On",
                value: `${time(
                    Math.round(
                        new Date(response.data.pushed_at).getTime() / 1000
                    ),
                    "R"
                )}`,
                inline: true,
            },
            {
                name: "Owner",
                value: response.data.owner.login,
                inline: true,
            },
        ])
        .setColor("RANDOM")
        .setThumbnail(response.data.owner.avatar_url);
    await interaction.editReply({
        embeds: [emb],
        components: [row],
    });
};
