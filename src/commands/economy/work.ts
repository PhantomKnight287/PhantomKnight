import { CommandInteraction, MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { prisma } from "../../prisma";
module.exports = {
    command: new SlashCommandBuilder()
        .setName("work")
        .setDescription("Work to earn money"),
    async run(interaction: CommandInteraction) {
        await interaction.deferReply();
        const user = await prisma.users.findFirst({
            where: {
                userId: interaction.user.id,
            },
        });
        if (!user)
            return await interaction.editReply({
                content: "You need to register first!",
            });
        if (new Date().getTime() - Number(user.lastWorked) < 3600000)
            return await interaction.editReply({
                content: `You are on CoolDown! Please Try again after `,
            });
        const amount = Math.floor(Math.random() * 10000) + 1;
        const embed = new MessageEmbed()
            .setDescription(
                `You Worked Hard and got ${amount} <:betcoin:896012051946803251>`
            )
            .setColor("RANDOM");
        await interaction.editReply({ embeds: [embed] });
        await prisma.users.update({
            where: {
                userId: interaction.user.id,
            },
            data: {
                lastWorked: new Date().getTime(),
                walletBalance: user.walletBalance + BigInt(amount),
            },
        });
    },
};
