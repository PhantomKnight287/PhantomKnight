import { Guild } from "discord.js";
import { prisma } from "../prisma";

export async function deleteEmojis(guild: Guild) {
    await prisma.emojis.deleteMany({
        where: {
            guildId: guild.id,
        },
    });
}
