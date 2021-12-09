import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, Permissions } from "discord.js";
module.exports = {
    command: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Ban A user")
        .addUserOption((user) => {
            return user
                .setName("user")
                .setDescription("Mention a user to Ban")
                .setRequired(true);
        }),
    async run(interaction: CommandInteraction, client: Client) {
        const user = await interaction.options.getMember("user");
        const userDetails = await interaction.options.getUser("user");
        if (userDetails === client.user) {
            await interaction.reply({
                content: "You can't ban me using my commands!",
            });
            return;
        }
        if (
            (interaction.member.permissions as any).has([
                Permissions.FLAGS.KICK_MEMBERS,
                Permissions.FLAGS.BAN_MEMBERS,
            ])
        ) {
            (user as any)
                .ban(userDetails)
                .then(async () => {
                    await interaction.reply({
                        content: `Banned ${userDetails.username} from the guild`,
                    });
                })
                .catch(async (err) => {
                    console.log(err);
                    await interaction.reply({ content: err.message });
                });
        } else {
            await interaction.reply({
                content: "You don't have enough permission to ban a user!",
            });
        }
    },
};
