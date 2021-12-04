import { CommandInteraction, Permissions } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { autoModModel } from "../../models/autoMod";
module.exports = {
  command: new SlashCommandBuilder()
    .setName("automod")
    .setDescription("Manage AutoMod Settings")
    .addSubcommand((subcommand) => {
      return subcommand
        .setName("add")
        .setDescription("Add new words to automod")
        .addStringOption((word) => {
          return word
            .setName("word")
            .setDescription("New AutoMod Word")
            .setRequired(true);
        });
    })
    .addSubcommand((subcommand) => {
      return subcommand
        .setName("toggle")
        .setDescription("Toggle AutoMod")
        .addBooleanOption((bool) => {
          return bool
            .setName("enable")
            .setDescription("Toggle AutoMod")
            .setRequired(true);
        });
    }),
  async run(interaction: CommandInteraction) {
    await interaction.deferReply();
    // handling adding of new words first
    if (interaction.options.getSubcommand() === "add") {
      if (
        (interaction.member.permissions as any).has([
          Permissions.FLAGS.MANAGE_MESSAGES,
          Permissions.FLAGS.MANAGE_GUILD,
        ])
      ) {
        let autoModConfig = await (autoModModel.findOne({
          guildId: interaction.guildId,
        }) as any);

        if (autoModConfig) {
          let words = (autoModConfig as any).words;
          words.push(interaction.options.getString("word"));
          await autoModModel.findOneAndUpdate(
            { guildId: interaction.guildId },
            { words: words }
          );
          await interaction.editReply({ content: "Update AutoMod Config!" });
        } else {
          let words = [interaction.options.getString("word")];
          const newAutoModConfig = new autoModModel({
            guildId: interaction.guildId,
            words: words,
          });
          await newAutoModConfig.save();
          await interaction.editReply({
            content: "Enabled automod and add new word",
          });
        }
      } else {
        await interaction.editReply({
          content: "You don't have required permission",
        });
      }
    } else if (interaction.options.getSubcommand() === "toggle") {
      const autoModConfig = await (autoModModel.findOne({
        guildId: interaction.guildId,
      }) as any);
      if (
        !(interaction.member.permissions as any).has([
          Permissions.FLAGS.MANAGE_MESSAGES,
          Permissions.FLAGS.MANAGE_GUILD,
        ])
      ) {
        return await interaction.editReply({
          content: "You don't have required permission!",
        });
      }
      if (interaction.options.getBoolean("enable")) {
        if (autoModConfig) {
          await autoModModel.findOneAndUpdate(
            { guildId: interaction.guildId },
            { enabled: false }
          );
          await interaction.editReply({
            content: "Disabled AutoMod for Your Server",
          });
        }
      } else {
        if (autoModConfig) {
          await autoModModel.findOneAndUpdate(
            { guildId: interaction.guildId },
            { enabled: true }
          );
          await interaction.editReply({
            content: "Enabled AutoMod for Your Server",
          });
        }
      }
    }
  },
};
