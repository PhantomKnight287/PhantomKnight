require("dotenv").config(); // .env config
import { getJSFiles, registerSlashCommands } from "./handler"; //for commands config
import { Player } from "discord-player"; // player for discord-player
import { vcCheck } from "./checks"; // checks for music based commands
import { join } from "path"; // idk what this is for
import { PhantomKnight } from "./construct"; // custom class to remove typescript errors
import {
  CommandInteraction,
  GuildMember,
  Message,
  Collection,
} from "discord.js"; // importing types
import { AutoPoster } from "topgg-autoposter"; // autoposter to post topgg stats
import { sendWelcomeMessage, autoMod } from "./events"; // events config

import { command } from "./types"; // command type
import { prisma } from "./prisma"; // prisma for levelling config
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
const client = new PhantomKnight();
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

registerSlashCommands(commands, true);
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
  await sendWelcomeMessage(userJoined, client);
});

client.on("messageCreate", async (message: Message) => {
  if (message.author.bot) return;
  const user = await prisma.users.findFirst({
    where: {
      userId: message.author.id,
    },
  });
  if (!user) {
    await prisma.users.create({
      data: {
        userId: message.author.id,
        lastWorked: new Date().getTime() - 3600000,
        bankBalance: 1000,
        walletBalance: 1000,
      },
    });
  }
  const levelingUser = await prisma.leveling.findFirst({
    where: {
      userId: message.author.id,
    },
  });
  if (!levelingUser) {
    await prisma.leveling.create({
      data: {
        exp: 0,
        level: 0,
        levelUpXp: 200,
        nextLevel: 1,
        userId: message.author.id,
      },
    });
  } else {
    if (levelingUser.exp >= levelingUser.levelUpXp) {
      await prisma.leveling.update({
        where: {
          userId: message.author.id,
        },
        data: {
          level: levelingUser.level + 1,
          levelUpXp: levelingUser.level * 100,
          exp: 0,
          nextLevel: levelingUser.level + 2,
        },
      });
    } else {
      await prisma.leveling.update({
        where: {
          userId: message.author.id,
        },
        data: {
          exp: levelingUser.exp + Math.floor(Math.random() * 20),
        },
      });
    }
  }
  await autoMod(message);
});

client.login(process.env.token as string);

export { player, client };
