import { stringify } from "flatted";
import { Socket } from "socket.io";
import { client } from "../..";
import { serverArgs } from "../../types";
import { Permissions } from "discord.js";
export async function server(socket: Socket, args) {
    const data: serverArgs = JSON.parse(args);
    const user = client.guilds.cache.get(data.id);

    if (!user)
        return socket.emit("guildPermission", stringify({ permission: false }));
    const guildUser = user.members.cache.get(data.userId);

    if (user) {
        if (guildUser.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
            socket.emit(
                "guildPermission",
                stringify({
                    permissions: true,
                    guildId: client.guilds.cache.get(data.id).id,
                })
            );
        } else {
            socket.emit("guildPermission", stringify({ permission: false }));
        }
    } else {
        socket.emit("guildPermission", stringify({ permission: false }));
    }
}
