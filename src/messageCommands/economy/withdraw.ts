import { Message, MessageEmbed } from "discord.js";
import { betcoin } from "../..";
import { Economy } from "../../economy/Economy";
export const alias = ["with"];
export const name = "withdraw";
export const description = "Withdraw your money from your bank";

export const execute = async (message: Message) => {
    let money = message.content.split(" ")[1];
    if (
        money == "0" ||
        money.includes("-") ||
        money.includes("k") ||
        money.includes("m") ||
        money.includes("b")
    ) {
        return message.channel.send({ content: "Invalid Amount" });
    }
    const eco = new Economy(message.author.id);
    const accountDetails = await eco.isAccountPresent();
    if (!accountDetails) {
        await eco.createAccount();
        await eco.setAmountInWallet("0");
        await eco.setAmountInBank("4000");
        const embed = new MessageEmbed()
            .setAuthor({
                name: message.author.tag,
                iconURL: message.author.displayAvatarURL(),
            })
            .setTimestamp()
            .addFields([
                {
                    name: "Deposited",
                    value: `\`2000\` ${betcoin} `,
                    inline: false,
                },
                {
                    name: "Current Wallet Balance",
                    value: `\0\` ${betcoin} `,
                    inline: true,
                },
                {
                    name: "Current Bank Balance",
                    value: `\`4000\` ${betcoin} `,
                    inline: true,
                },
            ])
            .setColor("RANDOM");
        return await message.channel.send({ embeds: [embed] });
    }
    if (money == "all") {
        money = accountDetails.bank;
    }
    try {
        money = BigInt(money).toString();
    } catch {
        return message.channel.send({ content: "Invalid Amount" });
    }
    if (BigInt(money) > BigInt(accountDetails.bank)) {
        return message.channel.send({ content: "You don't have enough money" });
    }
    const bankMoney = (BigInt(accountDetails.bank) - BigInt(money)).toString();
    await eco.setAmountInBank(bankMoney);
    await eco.setAmountInWallet(money);
    const embed = new MessageEmbed()
        .setAuthor({
            name: message.author.tag,
            iconURL: message.author.displayAvatarURL(),
        })
        .setTimestamp()
        .addFields([
            {
                name: "Withdrew",
                value: `\`${money}\` ${betcoin} `,
                inline: false,
            },
            {
                name: "Current Wallet Balance",
                value: `\`${money}\` ${betcoin} `,
                inline: true,
            },
            {
                name: "Current Bank Balance",
                value: `\`${bankMoney}\` ${betcoin} `,
                inline: true,
            },
        ])
        .setColor("RANDOM");
    return await message.channel.send({ embeds: [embed] });
};
