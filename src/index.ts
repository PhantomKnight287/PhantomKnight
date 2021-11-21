const registerSlashCommands = require("./handler/registerCommands");
const getJSFile = require("./handler");
import { Player } from "discord-player";
import { connect, connection } from "mongoose";
require("dotenv").config();
connect(process.env.mongodbUrl as string);
connection.on("open", () => {
  console.log("connected to mongodb");
});
import { join } from "path";
const { Client, Intents, Collection } = require("discord.js");
const client: typeof Client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});
import { CommandInteraction, GuildMember } from "discord.js";
import welcomerEvent from "./events/welcomeMessage";
import { AutoPoster } from "topgg-autoposter";
if (process.env.topggtoken) {
  const ap = AutoPoster(process.env.topggtoken as string, client);
  ap.on("posted", () => {
    console.log("posted Stats to Top.gg");
  });
}
client.commands = new Collection();
const commands = [];

// Get all the `.js` files in the `commands` directory
const commandFiles = getJSFile(join(__dirname, "commands"));

// Import all command files and
// add them to the `client.commands` collection
commandFiles.forEach((file) => {
  const command = require(file);

  // Add the values to the array and `Collection`
  commands.push(command.command.toJSON());
  // Sets the name of the command as the key
  client.commands.set(command.command.name, command);
});

// Registers the slash commands
// NOTE: isGlobal value is set to false because the bot is still under development phase

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
        name: "Made in Typescript By PHANTOMKNIGHT#9254",
      },
    ],
  });
});

client.on("interactionCreate", async (interaction: CommandInteraction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const command = client.commands.get(interaction.commandName);
  if (!command) {
    return;
  }
  try {
    await command.run(interaction, client);
  } catch (error) {
    console.log(error.message);
  }
});

client.on("guildMemberAdd", async (userJoined: GuildMember) => {
  await welcomerEvent(userJoined, client);
});

client.login(process.env.token as string);

export { player };
