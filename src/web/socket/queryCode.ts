import { Socket } from "socket.io";
import axios from "axios";
import { client } from "../..";
import { responseGuild } from "../../classes/guild";
require("dotenv").config();
export async function queryCode(
    socket: Socket,
    args: { code: string; redirectUri: string; token?: string }
) {
    if (!args.token) {
        const params = new URLSearchParams();
        params.set("grant_type", "authorization_code");
        params.set("code", args.code);
        params.set("redirect_uri", args.redirectUri);
        params.set("client_id", process.env.clientId as string);
        params.set("client_secret", process.env.clientSecret as string);
        try {
            const { data } = await axios.post(
                "https://discord.com/api/oauth2/token",
                params,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );

            console.log(data);
            const { data: userData } = await axios.get(
                "http://discordapp.com/api/users/@me",
                {
                    headers: {
                        Authorization: `Bearer ${data.access_token}`,
                    },
                }
            );
            const { data: guildData } = await axios.get(
                "http://discordapp.com/api/users/@me/guilds",
                {
                    headers: {
                        Authorization: `Bearer ${data.access_token}`,
                    },
                }
            );
            const allGuilds = [];
            guildData.forEach(
                (guild: {
                    id: string;
                    name: string;
                    icon: string;
                    owner: boolean;
                    permissions: number;
                    features: string[];
                    permissions_new: string;
                }) => {
                    const isMutual = client.guilds.cache.has(guild.id);
                    if (isMutual) {
                        const server = new responseGuild(guild, true);
                        allGuilds.push(server);
                    }
                }
            );
            userData.refresh = data.refresh_token;
            userData.guilds = allGuilds;
            socket.emit("userData", { userData, error: null });
        } catch (error) {
            socket.emit("userData", { userData: null, error: true });
            console.log(error.response);
        }
    } else if (args.token) {
        const params = new URLSearchParams();
        params.set("client_id", process.env.clientId as string);
        params.set("client_secret", process.env.clientSecret as string);
        params.set("grant_type", "refresh_token");
        params.set("refresh_token", args.token);
        try {
            const { data } = await axios.post(
                "https://discord.com/api/oauth2/token",
                params,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );
            console.log(data);
            const { data: userData } = await axios.get(
                "http://discordapp.com/api/users/@me",
                {
                    headers: {
                        Authorization: `Bearer ${data.access_token}`,
                    },
                }
            );
            const { data: guilds } = await axios.get(
                "http://discordapp.com/api/users/@me/guilds",
                {
                    headers: {
                        Authorization: `Bearer ${data.access_token}`,
                    },
                }
            );
            const allGuilds = [];
            guilds.forEach(
                (guild: {
                    id: string;
                    name: string;
                    icon: string;
                    owner: boolean;
                    permissions: number;
                    features: string[];
                    permissions_new: string;
                }) => {
                    const isMutual = client.guilds.cache.has(guild.id);
                    if (isMutual) {
                        const server = new responseGuild(guild, true);
                        allGuilds.push(server);
                    }
                }
            );
            userData.refresh = data.refresh_token;
            userData.guilds = allGuilds;
            socket.emit("userData", { userData, error: null });
        } catch (error) {
            socket.emit("userData", { userData: null, error: true });
            console.log(error.response);
        }
    }
}
