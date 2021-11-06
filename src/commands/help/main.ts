import { MessageEmbed, MessageActionRow, MessageSelectMenu } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import type { CommandInteraction, SelectMenuInteraction } from "discord.js";
module.exports = {
  command: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Stop It, Get Some Help"),
  async run(interaction: CommandInteraction) {
    await interaction.deferReply();

    const emb = new MessageEmbed()
      .setColor(0x1ee0eb)
      .setTimestamp()
      .setTitle("Help Commands")
      .setDescription(
        "Click any button to get help regarding that topic. Remember All of these are Slash Commands"
      )
      .addField(
        `<:herime_ujju_bhaiya:859068619765579786> Fun Command`,
        "`Select Fun Option`",
        true
      )
      .addField(
        `<:dogeThugLife:848437513067954178> Utils`,
        "`Select Utils Option`",
        true
      )
      .addField(
        "<:dorime:832826644993540096> Welcomer",
        "`Select Welcomer Option`",
        true
      );
    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("select")
        .setPlaceholder("Select An Option")
        .addOptions([
          {
            label: "Fun",
            description: "Get List of Fun Commands",
            emoji: "<:herime_ujju_bhaiya:859068619765579786>",
            value: "fun",
          },
          {
            label: "Utils",
            description: "Get List of Utils Commands",
            emoji: "<:dogeThugLife:848437513067954178>",
            value: "utils",
          },
          {
            label: "Welcomer",
            description: "Get List of Welcomer Commands",
            value: "welcomer",
            emoji: "<:dorime:832826644993540096>",
          },
        ])
    );
    const embeds = {
      welcomer: new MessageEmbed()
        .setTimestamp()
        .setTitle("Welcomer")
        .setDescription(
          ` **
      Use "|guild|" and "|user|" in the welcome message.These words will be replaced by guild(server) name and new Members name respectively. These keywords are case sensitive.
      ** `
        )
        .addField(
          `<:dorime:832826644993540096> Welcomer`,
          "Use `welcomer` command to configure and start welcomer for your server.",
          true
        )
        .addField(
          "<:dorime:832826644993540096> Welcomer-update",
          "Use `welcomer-update` command to update the older welcomer config for your server.",
          true
        )
        .setColor("RANDOM")
        .setAuthor(
          `${interaction.user.username}`,
          `${interaction.user.displayAvatarURL()}`
        ),
      utils: new MessageEmbed()
        .setTimestamp()
        .setTitle("Utils")
        .setColor("RANDOM")
        .addField(
          `<:lmao:851030422719954946> Avatar`,
          "Use `avatar` command to view avatar of a user.",
          true
        )
        .addField(
          `<:hmmm:872444276422873098> MemberCount`,
          "Use `membercount` command to view the count of users in your server.",
          true
        )
        .addField(
          `<:hmmm:872444276422873098> ServerInfo`,
          "Use `serverinfo` command to get info about your server.",
          true
        )
        .addField(
          "<:stonks:874302521680740432> Stats",
          "Use `stats` command to view the stats of bot",
          true
        ),

      fun: new MessageEmbed()
        .setTimestamp()
        .setTitle("Fun")
        .addField(
          `<:KEKW:833726165776334898> Meme`,
          "Use `meme` command to show memes.",
          true
        ),
    };
    await interaction.editReply({ embeds: [emb], components: [row] });
    const collector = await interaction.channel.createMessageComponentCollector(
      { time: 60000 }
    );
    collector.on("collect", async (collected: SelectMenuInteraction) => {
      await collected.reply({
        ephemeral: true,
        embeds: [embeds[collected.values[0]]],
      });
    });
  },
};
