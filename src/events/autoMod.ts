import { Message } from "discord.js";
import { prisma } from "../prisma";
import { autoModWords } from "../types";
export async function autoMod(message: Message) {
  const autoModData = await prisma.automods.findFirst({
    where: {
      guildId: message.guildId,
    },
  });
  let isMessageDeleted = false;
  if (!autoModData || !autoModData.enabled || message.author.bot) return;
  try {
    (autoModData.words as autoModWords).forEach(async (word) => {
      if (
        message.content.toLowerCase().includes(word.toLowerCase()) &&
        !isMessageDeleted
      ) {
        await message.delete();
        await message.channel.send({
          content: `<@${message.author.id}> Watch Your Language!`,
        });
        isMessageDeleted = true;
      }
    });
  } catch (error) {
    console.log(error.message);
  }
}
