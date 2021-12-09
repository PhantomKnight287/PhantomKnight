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
import {
    sendWelcomeMessage,
    autoMod,
    saveEmojis,
    levelling,
    deleteEmojis,
} from "./events"; // events config

import { command } from "./types"; // command type
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

registerSlashCommands(commands, false);
client.on("ready", async () => {
    console.log(`Logged in as ${client.user.tag}! at ${new Date()}`);
    client.user.setPresence({
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

client.on("guildCreate", async () => {
    await saveEmojis();
});

client.on("guildDelete", async (guild) => {
    await deleteEmojis(guild);
});

client.on("messageCreate", async (message: Message) => {
    if (message.author.bot) return;
    await autoMod(message);
    await levelling(message);
});

client.login(process.env.token as string);

export { player, client };
