import { prisma } from "../prisma";
import { client } from "..";
import { Guild } from "discord.js";
import { promisify } from "util";
export async function saveEmojis() {
    const wait = await promisify(setTimeout);
    await prisma.emojis.deleteMany({});
    client.guilds.cache.forEach((guild: Guild) => {
        guild.emojis.cache.forEach(async (emoji) => {
            await wait(2000);
            await prisma.emojis.create({
                data: {
                    customName: emoji.name,
                    emoji: emoji.toString(),
                    guildId: emoji.guild.id,
                },
            });
        });
    });
}
