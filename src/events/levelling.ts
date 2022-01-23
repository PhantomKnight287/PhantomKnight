import { prisma } from "../prisma";
import { Message } from "discord.js";

export async function levelling(message: Message) {
    try {
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
    } catch (error) {}
}
