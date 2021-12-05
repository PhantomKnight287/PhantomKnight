import { CommandInteraction, MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { prisma } from "../../prisma";

module.exports = {
  command: new SlashCommandBuilder()
    .setName("rob")
    .setDescription("Steal Money from someone's pocket!")
    .addUserOption((user) => {
      return user
        .setName("user")
        .setDescription("Mention a user")
        .setRequired(true);
    }),
  async run(interaction: CommandInteraction) {
    await interaction.deferReply({ ephemeral: true });
    const mentionedUser = interaction.options.getUser("user");
    const user1 = await prisma.users.findFirst({
      where: {
        userId: interaction.user.id,
      },
    });
    const user2 = await prisma.users.findFirst({
      where: {
        userId: mentionedUser.id,
      },
    });
    if (!user1)
      return await interaction.editReply({
        content: "You need to register first!",
      });
    if (!user2)
      return await interaction.editReply({
        content: `${mentionedUser.username} need to register first!`,
      });
    if (user1.walletBalance < 2000)
      return await interaction.editReply({
        content:
          "You must have 2000 <:betcoin:896012051946803251> in your Wallet",
      });
    if (user2.walletBalance < 2000)
      return await interaction.editReply({
        content: `${mentionedUser.username} must have 2000 <:betcoin:896012051946803251> in this wallet`,
      });
    const outComes: boolean[] = [true, false];
    const isRobbingFailed = outComes[Math.floor(Math.random() * 2)];
    if (isRobbingFailed) {
      const robbedAmount = Math.floor(
        Math.random() * Number(user1.walletBalance)
      );
      const embed = new MessageEmbed().setDescription(
        `You were caught robbing ${mentionedUser.username}. You paid ${robbedAmount} <:betcoin:896012051946803251> to ${mentionedUser.username}`
      );
      await interaction.editReply({ embeds: [embed] });
      await prisma.users.update({
        where: {
          userId: interaction.user.id,
        },
        data: {
          walletBalance: user1.walletBalance - BigInt(robbedAmount),
        },
      });
      await prisma.users.update({
        where: {
          userId: mentionedUser.id,
        },
        data: {
          walletBalance: user2.walletBalance + BigInt(robbedAmount),
        },
      });
    } else {
      const robbedAmount = Math.floor(
        Math.random() * Number(user2.walletBalance)
      );
      const embed = new MessageEmbed()
        .setDescription(
          `You robbed <@${mentionedUser.id}> and got ${robbedAmount} <:betcoin:896012051946803251>`
        )
        .setColor("RANDOM");
      await interaction.editReply({ embeds: [embed] });
      await prisma.users.update({
        where: {
          userId: interaction.user.id,
        },
        data: {
          walletBalance: user2.walletBalance - BigInt(robbedAmount),
        },
      });
      await prisma.users.update({
        where: {
          userId: mentionedUser.id,
        },
        data: {
          walletBalance: user1.walletBalance + BigInt(robbedAmount),
        },
      });
    }
  },
};
