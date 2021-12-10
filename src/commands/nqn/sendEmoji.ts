import { WebhookClient, CommandInteraction, Client } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { prisma } from "../../prisma";
module.exports = {
    command: new SlashCommandBuilder()
        .setName("nqn")
        .setDescription("Send Emojis using webhooks in the chat")
        .addStringOption((emojiName) => {
            return emojiName
                .setName("emoji")
                .setDescription("Emoji Name")
                .setRequired(true);
        }),
    async run(interaction: CommandInteraction, client: Client) {
        await interaction.deferReply({
            ephemeral: true,
        });
        const emoji = interaction.options.getString("emoji");
        const emojiInDb = await prisma.emojis.findFirst({
            where: {
                customName: emoji,
            },
        });
        if (!emojiInDb) {
            await interaction.editReply({
                content: "This emoji does not exist!",
            });
            return;
        }
        let name;
        let webhookToken = null;
        let webhookId = null;
        if ((interaction.member as any).nickname) {
            name = (interaction.member as any).nickname;
        } else {
            name = interaction.user.username;
        }
        try {
            const allWebhooks = await (
                interaction.channel as any
            ).fetchWebhooks();
            allWebhooks.map((webHook) => {
                if (webHook.owner.id == client.user.id) {
                    webhookToken = webHook.token;
                    webhookId = webHook.id;
                }
            });
            if (webhookId && webhookToken) {
                const webhookClient = new WebhookClient({
                    id: `${webhookId}`,
                    token: `${webhookToken}`,
                });
                webhookClient
                    .edit({
                        name: `${name}`,
                        avatar: `${interaction.user.avatarURL()}`,
                    })
                    .then((webhook) => {
                        webhook.send({
                            content: `${emojiInDb.emoji}`,
                        });
                    });
            } else if (!webhookId && !webhookToken) {
                const webhook = await (interaction.channel as any)
                    .createWebhook(`${name}`, {
                        avatar: interaction.user.avatarURL(),
                    })
                    .then((webhook) => webhook);
                console.log(webhook);
                const webhookClient = new WebhookClient({
                    id: `${webhook.id}`,
                    token: `${webhook.token}`,
                });
                webhookClient.edit({
                    name: `${name}`,
                    avatar: `${interaction.user.avatarURL()}`,
                });
                webhookClient.send({
                    content: `${emojiInDb.emoji}`,
                });
            }

            await interaction.editReply({
                content: "Sent Emoji in the chat",
            });
        } catch (error) {
            console.log(error.message);
            await interaction.editReply({
                content: "An unknown error occured",
            });
        }
    },
};
