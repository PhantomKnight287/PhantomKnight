import { CommandInteraction, MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { prisma } from "../../prisma";

module.exports = {
  command: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Check Your Balance")
    .addUserOption((user) => {
      return user
        .setName("user")
        .setDescription("The user to check the balance of")
        .setRequired(false);
    }),
  run: async (interaction: CommandInteraction) => {
    await interaction.deferReply();
    const user = interaction.options.getUser("user")
      ? interaction.options.getUser("user")
      : interaction.user;
    const data = await prisma.users.findFirst({
      where: {
        userId: user.id,
      },
    });
    if (!data) {
      await prisma.users.create({
        data: {
          userId: user.id,
          walletBalance: 1000,
          bankBalance: 1000,
          lastWorked: new Date().getTime(),
        },
      });
      const embed = new MessageEmbed()
        .setTimestamp()
        .setColor("RANDOM")
        .setTitle(`${user.username}'s Balance`)
        .setDescription(
          ` **Wallet** : 1000 <:betcoin:896012051946803251> \n **Bank** : 1000 <:betcoin:896012051946803251>`
        );

      await interaction.editReply({ embeds: [embed] });
    } else {
      const embed = new MessageEmbed()
        .setTimestamp()
        .setColor("RANDOM")
        .setTitle(`${user.username}'s Balance`)
        .setDescription(
          ` **Wallet** : ${data.walletBalance} <:betcoin:896012051946803251> \n **Bank** : ${data.bankBalance} <:betcoin:896012051946803251>`
        );

      await interaction.editReply({ embeds: [embed] });
    }
  },
};
