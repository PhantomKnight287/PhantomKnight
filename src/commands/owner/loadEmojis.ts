import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { saveEmojis } from "../../events";

export const command = new SlashCommandBuilder()
    .setName("load")
    .setDescription("Load Nqn Emojis");
export async function run(interaction: CommandInteraction) {
    await interaction.deferReply({
        ephemeral: true,
    });
    if (interaction.user.id != "510480545160101898")
        return await interaction.editReply({
            content: "Sorry, but this command is restricted to owner only!",
        });
    await saveEmojis();
    await interaction.editReply({
        content: "Loaded Emojs",
    });
}
