import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { prisma } from "../../prisma";
module.exports = {
  command: new SlashCommandBuilder()
    .setName("warnings")
    .setDescription("Get warnings for a user")
    .addUserOption((user) => {
      return user.setName("user").setDescription("user").setRequired(true);
    }),
  async run(interaction: CommandInteraction) {
    await interaction.deferReply({ ephemeral: true });
    const user = interaction.options.getUser("user");
    const guildRecord = await prisma.warnings.findFirst({
      where: {
        guildId: interaction.guildId,
      },
    });
    if (!guildRecord) {
      await interaction.editReply({
        content: "No warning Record for this guild",
      });
      return;
    }
    const warnings = [];
    guildRecord.warnings.map((warning: any, index) => {
      if (warning.userId == user.id) {
        warnings.push({ warning, id: index + 1 });
      }
    });
    const embed = new MessageEmbed().setAuthor(
      user.username,
      user.displayAvatarURL()
    );
    if (warnings.length == 0) {
      await interaction.editReply({
        content: "No warnings for specified User",
      });
      return;
    }
    warnings.forEach((warning) => {
      embed.addField(`ID:${warning.id}`, `${warning.warning.reason}`, false);
    });
    await interaction.editReply({ embeds: [embed] });
  },
};
