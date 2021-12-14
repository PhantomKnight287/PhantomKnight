import { args } from "../../types";
import Axios from "axios";
import { stringify } from "flatted";
import { Socket } from "socket.io";
import { client } from "../..";
export async function guild(socket: Socket, data) {
    const args: args = JSON.parse(data);
    const params = new URLSearchParams();
    params.set("grant_type", "authorization_code");
    params.set("code", args.token);
    params.set("redirect_uri", args.redirectUrl);
    params.set("client_id", "838686966387965992");
    params.set("client_secret", "DSMt3XvhV96aa66dWmx3UAlycRfl6gd1");
    try {
        const response = await Axios.post(
            "https://discord.com/api/oauth2/token",
            params,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );
        const response2 = await Axios.get(
            "http://discordapp.com/api/users/@me",
            {
                headers: {
                    Authorization: `Bearer ${response.data.access_token}`,
                },
            }
        );
        const response3 = await Axios.get(
            "https://discordapp.com/api/users/@me/guilds",
            {
                headers: {
                    Authorization: `Bearer ${response.data.access_token}`,
                },
            }
        );
        let commonGuilds = [];
        response3.data.forEach((guild) => {
            const commonGuild = client.guilds.cache.get(guild.id);
            if (commonGuild) {
                const user = commonGuild.members.cache.get(response2.data.id);
                if (user) {
                    commonGuilds.push(commonGuild);
                }
            }
        });
        const obj = {
            error: false,
            user: response2.data,
            guilds: commonGuilds,
        };
        socket.emit("userData", stringify(obj));
    } catch (error) {
        socket.emit(
            "userData",
            stringify({
                error: true,
            })
        );
    }
}
