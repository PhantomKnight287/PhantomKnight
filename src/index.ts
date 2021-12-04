import { registerSlashCommands } from "./handler/registerCommands";
import { getJSFiles } from "./handler";
import { Player } from "discord-player";
import { connect, connection } from "mongoose";
import { vcCheck } from "./checks";
require("dotenv").config();
connect(process.env.mongodbUrl as string);
connection.on("open", () => {
  console.log("connected to mongodb");
});
import { join } from "path";
import { Collection } from "discord.js";
import { PhantomKnight } from "./construct";
const client = new PhantomKnight();
import { CommandInteraction, GuildMember, Message } from "discord.js";
import welcomerEvent from "./events/welcomeMessage";
import { AutoPoster } from "topgg-autoposter";
import autoMod from "./events/autoMod";
import { command } from "./types";
const MusicCommand: string[] = [
  "disconnect",
  "fast-forward",
  "pause",
  "play",
  "previous",
  "resume",
  "seek",
  "skip",
  "play-playlist",
];
if (process.env.topggtoken) {
  const ap = AutoPoster(process.env.topggtoken as string, client);
  ap.on("posted", () => {
    console.log("posted Stats to Top.gg");
  });
}
client.commands = new Collection();
const commands = [];

const commandFiles = getJSFiles(join(__dirname, "commands"));

commandFiles.forEach((file) => {
  const command = require(file);

  commands.push(command.command.toJSON());
  client.commands.set(command.command.name, command);
});
const player = new Player(client);

player.on("error", (_, error) => {
  console.log(error);
});
player.on("connectionError", (_, error) => {
  console.log(error);
});

registerSlashCommands(commands, false);
client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}! at ${new Date()}`);
  await client.user.setPresence({
    activities: [
      {
        name: "Made By 'PHANTOM KNIGHT#9254'",
      },
    ],
  });
});

client.on("interactionCreate", async (interaction: CommandInteraction) => {
  if (MusicCommand.includes(interaction.commandName)) {
    const { checkFailed, message } = vcCheck(interaction);
    if (checkFailed) {
      return await interaction.reply({
        content: message,
      });
    }
  }
  if (!interaction.isCommand()) {
    return;
  }
  const command = client.commands.get(interaction.commandName);
  if (!command) {
    return;
  }
  try {
    await (command as command).run(interaction, client);
  } catch (error) {
    console.log(error.message);
  }
});

client.on("guildMemberAdd", async (userJoined: GuildMember) => {
  await welcomerEvent(userJoined, client);
});

client.on("messageCreate", async (message: Message) => {
  await autoMod(message);
});

client.login(process.env.token as string);

export { player, client };
