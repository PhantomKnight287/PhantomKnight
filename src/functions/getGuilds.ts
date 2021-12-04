import axios from "axios";
import { Socket } from "socket.io";
import { client } from "..";
export default async function getGuilds(
  socket: Socket,
  code: string,
  redirectUrl: string
) {
  const mutualGuilds = [];
  const params = new URLSearchParams();
  params.set("grant_type", "authorization_code");
  params.set("code", code);
  params.set("redirect_uri", redirectUrl);
  params.set("client_id", "838686966387965992");
  params.set("client_secret", "DSMt3XvhV96aa66dWmx3UAlycRfl6gd1");
  try {
    const accessCodeReq = await axios.post(
      "https://discord.com/api/oauth2/token",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const userDataReq = await axios.get("http://discordapp.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${accessCodeReq.data.access_token}`,
      },
    });
    const response3 = await axios.get(
      "https://discordapp.com/api/users/@me/guilds",
      {
        headers: {
          Authorization: `Bearer ${accessCodeReq.data.access_token}`,
        },
      }
    );

    response3.data.forEach((guild) => {
      const isMutualGuild = client.guilds.cache.get(guild.id);
      if (isMutualGuild) {
        mutualGuilds.push(guild);
      }
    });
    socket.emit(
      "getUserData",
      JSON.stringify({
        user: userDataReq.data,
        guilds: mutualGuilds,
        error: false,
      })
    );
  } catch (error) {
    console.log(error.message);
    socket.emit("getUserData", JSON.stringify({ error: true }));
  }
}
