import { Message, MessageEmbed } from "discord.js";
import { Economy } from "../../economy/Economy";
import { betcoin } from "../../";
export const name = "balance";
export const alias = ["bal"];
export const execute = async (msg: Message) => {
    const user = msg.mentions.users.first() || msg.author;
    const eco = new Economy(user.id);
    const isAccountPresent = await eco.isAccountPresent();
    if (!isAccountPresent) {
        await eco.createAccount();
        const embed = new MessageEmbed()
            .setAuthor({
                name: user.tag,
                iconURL: user.displayAvatarURL(),
            })
            .setTimestamp()
            .setColor("RANDOM")
            .setDescription(
                `**Wallet**:\`2000\`${betcoin}\n**Bank**:\`2000\` ${betcoin}`
            );
        await msg.channel.send({ embeds: [embed] });
    } else {
        const embed = new MessageEmbed()
            .setAuthor({
                name: user.tag,
                iconURL: user.displayAvatarURL(),
            })
            .setTimestamp()
            .setColor("RANDOM")
            .setDescription(
                `**Wallet**:\`${isAccountPresent.wallet}\` ${betcoin}\n**Bank**:\`${isAccountPresent.bank}\` ${betcoin} \n`
            );
        await msg.channel.send({ embeds: [embed] });
    }
};
export const description = "Check your balance";
