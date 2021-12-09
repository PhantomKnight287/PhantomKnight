import { CommandInteraction, MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { prisma } from "../../prisma";

module.exports = {
    command: new SlashCommandBuilder()
        .setName("give")
        .setDescription("Have Access Money? Give it to someone")
        .addUserOption((user) => {
            return user
                .setName("user")
                .setDescription("Mention a user")
                .setRequired(true);
        })
        .addNumberOption((number) => {
            return number
                .setRequired(true)
                .setName("amount")
                .setDescription("Amount to give");
        }),
    async run(interaction: CommandInteraction) {
        await interaction.deferReply();
        const user1 = await prisma.users.findFirst({
            where: {
                userId: interaction.user.id,
            },
        });
        const user2 = await prisma.users.findFirst({
            where: {
                userId: interaction.options.getUser("user").id,
            },
        });
        if (!user1)
            return await interaction.editReply({
                content: "You need to Register First!",
            });
        if (!user2)
            return await interaction.editReply({
                content: `${
                    interaction.options.getUser("user").username
                } need to register first!`,
            });
        if (user1.walletBalance < interaction.options.getNumber("amount"))
            return await interaction.editReply({
                content: "You don't have enough money!",
            });
        if (interaction.options.getNumber("amount") <= 0) {
            return await interaction.editReply({
                content: "Please Specify An amount above 0!",
            });
        }
        await prisma.users.update({
            where: {
                userId: interaction.user.id,
            },
            data: {
                walletBalance:
                    user1.walletBalance -
                    BigInt(interaction.options.getNumber("amount")),
            },
        });
        await prisma.users.update({
            where: {
                userId: interaction.options.getUser("user").id,
            },
            data: {
                walletBalance:
                    user2.walletBalance +
                    BigInt(interaction.options.getNumber("amount")),
            },
        });
        const embed = new MessageEmbed()
            .setDescription(
                `You gave ${interaction.options.getNumber(
                    "amount"
                )} <:betcoin:896012051946803251> to ${
                    interaction.options.getUser("user").username
                }`
            )
            .setColor("RANDOM");
        await interaction.editReply({ embeds: [embed] });
    },
};
