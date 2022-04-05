import { ActivitiesOptions, PresenceStatusData } from "discord.js";
import { client } from "..";
class Ready {
    name: string = "ready";
    action: Function = this.execute;
    constructor() {}
    async execute() {
        const presences: PresenceStatusData[] = ["dnd", "online", "idle"];
        console.log(`Logged in as ${client.user.tag}! at ${new Date()}`);
        setInterval(() => {
            const activities: ActivitiesOptions[] = [
                {
                    name: "Screams of Developer",
                    type: "LISTENING",
                },
                {
                    name: "Made By 'PHANTOM KNIGHT#4209'",
                    type: "LISTENING",
                },
                {
                    name: "Living in the shadow of the sun",
                    type: "PLAYING",
                },
                {
                    name: "Living Alone in an EC2",
                    type: "PLAYING",
                },
                {
                    name: "Not as Easy as You Think",
                    type: "PLAYING",
                },
                {
                    name: `${client.users.cache.size} Members`,
                    type: "WATCHING",
                },
                {
                    name: `${client.guilds.cache.size} Servers`,
                    type: "WATCHING",
                },
                {
                    name: `${client.channels.cache.size} Channels`,
                    type: "WATCHING",
                },
                {
                    name: `from a Docker Container`,
                    type: "PLAYING",
                },
                {
                    name: `bot.phantomknight.tk`,
                    type: "WATCHING",
                },
            ];
            client.user.setPresence({
                activities: [
                    activities[Math.floor(Math.random() * activities.length)],
                ],
                status: presences[Math.floor(Math.random() * presences.length)],
                afk: true,
            });
        }, 10000);
    }
}

export default new Ready();
