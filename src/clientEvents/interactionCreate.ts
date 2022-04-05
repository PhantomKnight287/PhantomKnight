import { vcCheck } from "../checks";
import type { CommandInteraction } from "discord.js";
import { command } from "types";
import { client, economyCommands, MusicCommand } from "..";
class InteractionCreate {
    name: string = "interactionCreate";
    execute: Function = this.action;
    constructor() {}
    async action(interaction: CommandInteraction) {
        if (!interaction.guild)
            return void (await interaction.reply({
                content: "You can't use these commands in DM's!",
            }));
        if (economyCommands.includes(interaction.commandName)) {
            return void (await interaction.reply({
                content: "These Commands Are Deprecated!",
            }));
        }
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
            console.log(error);
        }
    }
}

export default new InteractionCreate();
