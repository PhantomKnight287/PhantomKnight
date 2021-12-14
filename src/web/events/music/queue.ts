import { player } from "../../..";
import { stringify, parse } from "flatted";
import { Socket } from "socket.io";
export async function getQueue(socket: Socket, args) {
    const { guildId } = parse(args);
    const queue = player.getQueue(guildId);
    if (!queue) {
        return socket.emit("noQueue");
    } else {
        socket.emit("queue", stringify({ tracks: queue.tracks, guildId }));
        return socket.emit(
            "currently",
            stringify({
                currentlyPlaying: queue.current,
                guildId,
            })
        );
    }
}
