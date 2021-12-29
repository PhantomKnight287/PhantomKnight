import { prisma } from "../../prisma";
import { Socket } from "socket.io";

export async function deletePlaylistSong(
    socket: Socket,
    args: { id: string; song: { title: string; thumbnail: string } }
) {
    const playList = await prisma.playlists.findFirst({
        where: {
            userId: args.id,
        },
    });
    playList.playList.map(
        (song: { title: string; thumbnail: string }, index) => {
            if (song.title == args.song.title) {
                playList.playList.splice(index, 1);
            }
        }
    );
    await prisma.playlists.update({
        where: {
            userId: args.id,
        },
        data: {
            playList: playList.playList,
        },
    });
    socket.emit("playlists", {
        message: `Removed ${args.song.title} from Playlist`,
        songs: playList.playList,
    });
}
