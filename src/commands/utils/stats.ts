import { SlashCommandBuilder, time } from "@discordjs/builders";
import {
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    version,
} from "discord.js";
import type { CommandInteraction } from "discord.js";
import { client, startingMilliseconds } from "../..";
import { version as tsVersion } from "typescript";
module.exports = {
    command: new SlashCommandBuilder()
        .setName("stats")
        .setDescription("Get Stats of Bot."),
    async run(interaction: CommandInteraction) {
        await interaction.deferReply();
        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setStyle("LINK")
                .setURL("https://top.gg/bot/838686966387965992")
                .setLabel("Invite Me"),
            new MessageButton()
                .setStyle("LINK")
                .setLabel("Github")
                .setEmoji("<:github:954782695882358906>")
                .setURL("https://github.com/PhantomKnight287/PhantomKnight")
        );
        const embed = new MessageEmbed()
            .setTitle("Stats")
            .setColor("RANDOM")
            .setImage(
                `https://cdn.discordapp.com/attachments/616315208251605005/616319462349602816/Tw.gif`
            )
            .addFields([
                {
                    name: ":arrow_up: Started",
                    value: `${time(
                        Math.floor(startingMilliseconds / 1000),
                        "R"
                    )}`,
                    inline: false,
                },
                {
                    name: ":ping_pong: Ping",
                    value: `\`\`\`${client.ws.ping}ms\`\`\``,
                    inline: false,
                },
                {
                    name: "<:djs:936654010277056564> Discord.js Version",
                    value: `\`\`\`${version}\`\`\``,
                    inline: false,
                },
                {
                    name: "<:typescript:936654542295158785> Typescript Version ",
                    value: `\`\`\`${tsVersion}\`\`\``,
                    inline: false,
                },
                {
                    name: "<:HomeServerLogo:843716672094339073> Total Servers",
                    value: `\`\`\`${client.guilds.cache.size}\`\`\``,
                    inline: false,
                },
            ]);
        await interaction.editReply({ embeds: [embed], components: [row] });
    },
};
