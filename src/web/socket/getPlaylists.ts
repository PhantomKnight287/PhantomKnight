import { prisma } from "../../prisma";
import { Socket } from "socket.io";

export async function getPlaylists(socket: Socket, args: { id: string }) {
    const playlists = await prisma.playlists.findFirst({
        where: {
            userId: args.id,
        },
    });
    if (playlists) {
        socket.emit("playlists", { songs: playlists.playList, message: null });
    } else {
        socket.emit("playlists", {
            songs: [],
            message: "This User Has No Playlist!",
        });
    }
}
