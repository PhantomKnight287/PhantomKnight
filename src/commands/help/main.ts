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
        "Click any button to get help regarding that topic. Remember All of these are Slash Commands\n\nThis Bot is Open Source, You can take a look at the source [here](https://github.com/PhantomKnight287/discordbot)"
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
      )
      .addField("Moderation", "`Select Moderation Option`", true)
      .addField(
        "<a:nitro:872445091111923753> Lack of Nitro",
        "`Select Lack of Nitro Option`",
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
          {
            label: "Moderation",
            description: "Get List of Moderation Commands",
            value: "mod",
          },
          {
            label: "Lack of nitro",
            description: "Get List of Lon Commands",
            value: "nqn",
            emoji: "<a:nitro:872445091111923753>",
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
      mod: new MessageEmbed()
        .setTitle("Moderation")
        .setColor("RANDOM")
        .addField("Ban", "Use `ban` command to  ban a user", true)
        .addField(" Kick", "Use `kick` command to kick a user", true)
        .addField("Unban", "Use `unban` command to unban a user", true)
        .addField("Warn", "Use `warn` command to warn a user", true)
        .addField(
          "Warnings",
          "Use `warnings` command to check warnings of a user",
          true
        ),
      nqn: new MessageEmbed()
        .setTitle("Lack of Nitro")
        .setColor("RANDOM")
        .addField(
          "<a:nitro:872445091111923753> Nqn",
          "Use `nqn` command to use an emoji",
          true
        )
        .addField(
          "<a:nitro:872445091111923753> Nall",
          "Use `nall` command to get list of all emojis",
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
    collector.on("end", async () => {
      row.components.forEach((component) => {
        component.setDisabled(true);
      });
      await interaction.editReply({ components: [row] });
    });
  },
};
