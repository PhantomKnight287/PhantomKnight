import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, Permissions } from "discord.js";

module.exports = {
    command: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kick A user")
        .addUserOption((user) => {
            return user
                .setName("user")
                .setDescription("Mention a user to kick")
                .setRequired(true);
        })
        .addStringOption((reason) => {
            return reason
                .setName("reason")
                .setDescription("Reason behind this action")
                .setRequired(false);
        }),
    async run(interaction: CommandInteraction, client: Client) {
        const user = await interaction.options.getMember("user");

        const userDetails = await interaction.options.getUser("user");
        const reason = await interaction.options.getString("reason");
        if (userDetails === client.user) {
            await interaction.reply({
                content: "You can't kick me using my commands!",
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
                .kick(reason ? reason : "")
                .then(async () => {
                    await interaction.reply({
                        content: `Kicked ${userDetails.username} from the guild`,
                    });
                })
                .catch(async (err) => {
                    console.log(err);
                    await interaction.reply({ content: err.message });
                });
        } else {
            await interaction.reply({
                content: "You don't have enough permission to kick a user!",
            });
        }
    },
};
