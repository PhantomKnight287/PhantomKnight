import { CommandInteraction, GuildMember } from "discord.js";
export const vcCheck = (interaction: CommandInteraction) => {
    if ((interaction.member as GuildMember).voice.channelId) {
        if (
            interaction.guild.me.voice.channelId &&
            (interaction.member as GuildMember).voice.channelId !==
                interaction.guild.me.voice.channelId
        ) {
            return {
                checkFailed: true,
                message: "You are not in my voice channel!",
            };
        } else {
            return {
                checkFailed: false,
                message: null,
            };
        }
    } else {
        return {
            checkFailed: true,
            message: "You are not in a voice channel!",
        };
    }
};
