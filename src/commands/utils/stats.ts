import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
const prettyMs = require("pretty-ms");
import type { CommandInteraction } from "discord.js";
module.exports = {
    command: new SlashCommandBuilder()
        .setName("stats")
        .setDescription("Get Stats of Bot."),
    async run(interaction: CommandInteraction, client) {
        await interaction.deferReply();
        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setStyle("LINK")
                .setURL("https://top.gg/bot/838686966387965992")
                .setLabel("Invite Me")
        );
        const embed = new MessageEmbed()
            .setTitle("Stats")
            .setColor(0x1ee0eb)
            .setDescription(
                `
        :arrow_up: Uptime : ${prettyMs(client.uptime)}\n\n:ping_pong: Ping : ${
                    client.ws.ping
                }ms\n\n<:javascript:832809294046691378>  Made in JavaScript\n\n:sunglasses: Playing in ${
                    client.guilds.cache.size
                } Servers
        `
            )
            .setImage(
                `https://cdn.discordapp.com/attachments/616315208251605005/616319462349602816/Tw.gif`
            );
        await interaction.editReply({ embeds: [embed], components: [row] });
    },
};
