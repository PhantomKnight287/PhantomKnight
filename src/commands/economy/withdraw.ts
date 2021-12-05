import { CommandInteraction, MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { prisma } from "../../prisma";
module.exports = {
  command: new SlashCommandBuilder()
    .setName("withdraw")
    .setDescription("Withdraw Balance to your Wallet!")
    .addNumberOption((amount) => {
      return amount
        .setDescription("Amount to withdraw")
        .setName("amount")
        .setRequired(true);
    }),
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
    const amount = interaction.options.getNumber("amount");
    if (user.bankBalance < amount)
      return await interaction.editReply({
        content: "You don't have enough Money!",
      });
    await prisma.users.update({
      where: {
        userId: interaction.user.id,
      },
      data: {
        bankBalance: user.bankBalance - BigInt(amount),
        walletBalance: user.walletBalance + BigInt(amount),
      },
    });
    const embed = new MessageEmbed()
      .setDescription(
        `** ${amount} ** <:betcoin:896012051946803251> withdrawn and added to your wallet!`
      )
      .setColor("RANDOM");
    await interaction.editReply({ embeds: [embed] });
  },
};
