import { SlashCommandBuilder, time } from "@discordjs/builders";
import {
    CommandInteraction,
    MessageActionRow,
    MessageAttachment,
    MessageButton,
    MessageEmbed,
} from "discord.js";
import axios from "axios";
import { createCanvas, loadImage } from "canvas";
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
    const canvas = createCanvas(400, 250);
    const ctx = canvas.getContext("2d");
    loadImage(
        `https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&langs_count=69&show_icons=true&locale=en&layout=compact`
    ).then(async (img) => {
        ctx.drawImage(img, 0, 0, 400, 250);
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
                    inline:false,
                },
                {
                    name: "Name",
                    value: `${response.data.name || "No Name"}`,
                    inline:false,
                },
                {
                    name: "Bio",
                    value: `${response.data.bio || "No Bio"}`,
                    inline:false,
                },
                {
                    name: "Followers",
                    value: `${response.data.followers}`,
                    inline:false,
                },
                {
                    name: "Following",
                    value: `${response.data.following}`,
                    inline:false,
                },
                {
                    name: "Public Repos",
                    value: `${response.data.public_repos}`,
                    inline:false,
                },
                {
                    name: "Public Gists",
                    value: `${response.data.public_gists}`,
                    inline:false,
                },
                {
                    name: "Account Created At",
                    value: `${time(
                        Math.round(
                            new Date(response.data.created_at).getTime() / 1000
                        ),
                        "R"
                    )}`,
                    inline:false,
                },
            ])
            .setColor("RANDOM")
            .setThumbnail(response.data.avatar_url);
        if (response.data.type !== "Organization") {
            emb.setImage(`attachment://topLanguages.png`);
        }
        const attachment = new MessageAttachment(
            canvas.toBuffer(),
            "topLanguages.png"
        );
        await interaction.editReply({
            embeds: [emb],
            components: [row],
            files: response.data.type !== "Organization" ? [attachment] : [],
        });
    });
};
