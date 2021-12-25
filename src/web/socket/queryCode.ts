import { Socket } from "socket.io";
import axios from "axios";
import { prisma } from "../../prisma";
require("dotenv").config();
export async function queryCode(
    socket: Socket,
    args: { code: string; redirectUri: string; mongodbId: string }
) {
    const userId = args.mongodbId;
    const userToken = await prisma.loginTokens.findFirst({
        where: {
            id: userId,
        },
    });
    console.log(userToken);
    if (!userToken) {
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
            const newUser = await prisma.loginTokens.create({
                data: {
                    refreshToken: data.refresh_token,
                },
            });
            userData.mongodb = newUser.id;
            console.log(userData);
            socket.emit("userData", { userData, error: null });
        } catch (error) {
            socket.emit("userData", { userData: null, error: true });
            console.log(error.response);
        }
    } else if (userToken) {
        const params = new URLSearchParams();
        params.set("grant_type", "refresh_token");
        params.set("client_id", process.env.clientId as string);
        params.set("client_secret", process.env.clientSecret as string);
        params.set("refresh_token", userToken.refreshToken);
        try {
            const { data } = await axios.post(
                "https://discord.com/api/v8/oauth2/token",
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
            userData.mongodb = userToken.id;
            socket.emit("userData", { userData, error: null });
            await prisma.loginTokens.update({
                where: {
                    id: userToken.id,
                },
                data: {
                    refreshToken: data.refresh_token,
                },
            });
        } catch (error) {
            socket.emit("userData", { userData: null, error: true });
            console.log(error.response);
        }
    }
}
