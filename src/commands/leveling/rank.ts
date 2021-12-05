import { CommandInteraction, MessageAttachment } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { Rank } from "canvacord";
import { prisma } from "../../prisma";

module.exports = {
  command: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("Get Your Rank Card")
    .addUserOption((user) => {
      return user
        .setName("user")
        .setDescription("Mention a user")
        .setRequired(false);
    }),
  async run(interaction: CommandInteraction) {
    await interaction.deferReply();
    const requiredUser = interaction.options.getUser("user")
      ? interaction.options.getUser("user")
      : interaction.user;
    const user = await prisma.leveling.findFirst({
      where: {
        userId: requiredUser.id,
      },
    });
    if (!user)
      return await interaction.editReply({
        content: `${requiredUser.username} isn't ranked!`,
      });
    const rank = new Rank()
      .setAvatar(
        requiredUser.displayAvatarURL({
          format: "png",
        })
      )
      .setCurrentXP(user.exp)
      .setRequiredXP(user.levelUpXp)
      .setProgressBar("#1ee0eb", "COLOR", true)
      .setUsername(requiredUser.username)
      .setDiscriminator(requiredUser.discriminator)
      .setLevel(user.level)
      .setRank(33, "brrr", false);
    const card = await rank.build({});
    const attachment = new MessageAttachment(card, "level.png");
    await interaction.editReply({ files: [attachment] });
  },
};
