require("dotenv").config(); // .env config
import { getJSFiles, registerSlashCommands } from "./handler"; //for commands config
import { Player } from "discord-player"; // player for discord-player
import { join } from "path"; // idk what this is for
import { PhantomKnight } from "./construct"; // custom class to remove typescript errors
import { GuildMember, Collection } from "discord.js"; // importing types
import { AutoPoster } from "topgg-autoposter"; // autoposter to post topgg stats
import { sendWelcomeMessage, deleteEmojis } from "./events"; // events config
import { prisma } from "./prisma"; // prisma config
import { singleMessageDelete } from "./events";
import { promisify } from "util";
import { messageUpdateHandler } from "./events/messageUpdate";
const wait = promisify(setTimeout);
const MusicCommand = [
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
const economyCommands = [
    "balance",
    "deposit",
    "give",
    "rob",
    "withdraw",
    "work",
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

const eventFiles = getJSFiles(join(__dirname, "clientEvents"));

eventFiles.forEach(async (file) => {
    const event = require(file);
    if (event.default) {
        client.on(event.default.name, await event.default.execute);
    }
});
commandFiles.forEach((file) => {
    const command = require(file);

    commands.push(command.command.toJSON());
    client.commands.set(command.command.name, command);
});
const player = new Player(client, {
    ytdlOptions: {
        filter: "audio",
        dlChunkSize: 0,
        highWaterMark: 1 << 25,
        quality: "highestaudio",
    },
});

player.on("error", (_, error) => {
    console.log(error);
});
player.on("connectionError", (_, error) => {
    console.log(error);
});

const startingMilliseconds = new Date().getTime();
console.log(commands)
registerSlashCommands(commands, true);

client.on("guildMemberAdd", async (userJoined: GuildMember) => {
    await sendWelcomeMessage(userJoined, client);
});

client.on("guildCreate", async (guild) => {
    client.guilds.cache.get(guild.id)?.emojis.cache.forEach(async (emoji) => {
        await wait(2000);
        await prisma.emojis.create({
            data: {
                customName: emoji.name,
                guildId: guild.id,
                emoji: emoji.toString(),
            },
        });
    });
});

client.on("guildDelete", async (guild) => {
    await deleteEmojis(guild);
});

client.on("emojiCreate", async (emoji) => {
    await prisma.emojis.create({
        data: {
            customName: emoji.name,
            emoji: emoji.toString(),
            guildId: emoji.guild.id,
        },
    });
});

client.on("emojiDelete", async (emoji) => {
    await prisma.emojis.delete({
        where: {
            emoji: emoji.toString(),
        },
    });
});
client.on("emojiUpdate", async (oldEmoji, newEmoji) => {
    await prisma.emojis.update({
        where: {
            guildId: newEmoji.guild.id,
            emoji: oldEmoji.toString(),
        },
        data: {
            guildId: oldEmoji.guild.id,
            emoji: newEmoji.toString(),
        },
    });
});

client.on("messageDelete", async (message) => {
    if (!message.guildId) return;
    await singleMessageDelete(message);
});
client.on("messageUpdate", async (oldMessage, newMessage) => {
    if (!oldMessage.guildId) return;
    await messageUpdateHandler(oldMessage, newMessage);
});
const betcoin = "<:betcoin:896012051946803251>";
client.login(process.env.token as string);

export {
    player,
    client,
    betcoin,
    startingMilliseconds,
    MusicCommand,
    economyCommands,
};
