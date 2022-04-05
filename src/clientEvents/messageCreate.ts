import type { Message } from "discord.js";
import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { client } from "..";
import { autoMod, levelling } from "../events";
class MessageCreate {
    name: string = "messageCreate";
    execute: Function = this.action;

    constructor() {}
    async action(message: Message) {
        if (
            message.content.includes(`<@!${client.user.id}>`) ||
            message.content.includes(`<@${client.user.id}>`)
        ) {
            const row = new MessageActionRow().addComponents(
                new MessageButton()
                    .setStyle("LINK")
                    .setURL(
                        `https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=-9&scope=bot%20applications.commands`
                    )
                    .setLabel("Invite Me"),
                new MessageButton()
                    .setStyle("LINK")
                    .setLabel("Github")
                    .setEmoji("<:github:954782695882358906>")
                    .setURL("https://github.com/PhantomKnight287/PhantomKnight")
            );
            const embed = new MessageEmbed()
                .setColor("RANDOM")
                .setTimestamp()
                .setDescription(
                    "The Bot uses `Slash Commands` instead of `Message Commands`!\n To Use a command type `/` and wait for a menu to appear."
                );
            await message.channel.send({ embeds: [embed], components: [row] });
        }
        if (message.author.bot) return;
        await autoMod(message);
        await levelling(message);
    }
}

export default new MessageCreate();
