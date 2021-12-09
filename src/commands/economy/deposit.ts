import { CommandInteraction, MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { prisma } from "../../prisma";
module.exports = {
    command: new SlashCommandBuilder()
        .setName("deposit")
        .setDescription("Deposit money into your account")
        .addNumberOption((number) => {
            return number
                .setName("amount")
                .setRequired(true)
                .setDescription("Amount to deposit");
        }),
    async run(interaction: CommandInteraction) {
        await interaction.deferReply();
        const user = await prisma.users.findFirst({
            where: {
                userId: interaction.user.id,
            },
        });
        if (!user) {
            interaction.reply("You need to register first!");
            return;
        }
        const amount = interaction.options.getNumber("amount");
        if (user.walletBalance < amount) {
            interaction.reply("You dont have enough money!");
            return;
        }
        await prisma.users.update({
            where: {
                userId: interaction.user.id,
            },
            data: {
                walletBalance: user.walletBalance - BigInt(amount),
                bankBalance: user.bankBalance + BigInt(amount),
            },
        });
        const embed = new MessageEmbed().setDescription(
            `Deposit ** ${amount} ** <:betcoin:896012051946803251> in your Bank Account!`
        );
        await interaction.editReply({ embeds: [embed] });
    },
};
