import { Socket } from "socket.io";
import axios from "axios";
require("dotenv").config();
export async function queryCode(
    socket: Socket,
    args: { code: string; redirectUri: string }
) {
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
        console.log(userData);
        socket.emit("userData", { userData, error: null });
    } catch (error) {
        socket.emit("userData", { userData: null, error: true });
        console.log(error.response);
    }
}
