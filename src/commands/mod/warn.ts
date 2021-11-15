import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, Permissions } from "discord.js";
import { warningModel } from "../../models/warnings";
module.exports = {
  command: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn a user")
    .addUserOption((user) => {
      return user
        .setName("user")
        .setDescription("Mention a user to warn")
        .setRequired(true);
    })
    .addStringOption((reason) => {
      return reason.setName("reason").setDescription("Reason to warn");
    }),
  async run(interaction: CommandInteraction, client: Client) {
    await interaction.deferReply({ ephemeral: true });
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");
    if (
      (interaction.member.permissions as any).has([
        Permissions.FLAGS.KICK_MEMBERS,
        Permissions.FLAGS.BAN_MEMBERS,
      ])
    ) {
      const guildRecords = await warningModel.findOne({
        guildId: interaction.guildId,
      });
      const newWarningRecord = guildRecords
        ? [
            ...(guildRecords as any).warnings,
            {
              userId: user.id,
              reason,
              moderatorName: interaction.user.username,
            },
          ]
        : new warningModel({
            guildId: interaction.guildId,
            warnings: [
              {
                userId: user.id,
                reason,
                moderatorName: interaction.user.username,
              },
            ],
          });
      guildRecords
        ? await warningModel.findOneAndUpdate(
            { guildId: interaction.guildId },
            { warnings: newWarningRecord }
          )
        : await newWarningRecord.save();
      try {
        client.users.cache
          .get(user.id)
          .send(
            `You have been warned in ${interaction.guild.name}\n Reason:${
              reason ? reason : "No Reason Specified"
            }`
          );
      } catch (error) {
        console.log(error.message);
      }
      await interaction.editReply({
        content: `Successfully warned ${user.username}`,
      });
    }
  },
};
