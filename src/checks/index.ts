import { CommandInteraction } from "discord.js";
export const vcCheck = (interaction: CommandInteraction) => {
  if ((interaction.member as any).voice.channelId) {
    return true;
  } else {
    return false;
  }
};
