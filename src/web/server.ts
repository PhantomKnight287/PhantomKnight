import { Server } from "socket.io";
import { getPlaylists, queryCode, deletePlaylistSong } from "./socket";
import { client } from "..";

client; // reference to the client

const io = new Server({
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log("A User Connected");
    socket.on(
        "routerQueryCode",
        async (args: {
            code: string;
            redirectUri: string;
            mongodbId: string;
        }) => {
            await queryCode(socket, args);
        }
    );
    socket.on("getPlaylists", async (args: { id: string }) => {
        await getPlaylists(socket, args);
    });
    socket.on(
        "deleteSong",
        async (args: {
            id: string;
            song: {
                title: string;
                thumbnail: string;
            };
        }) => {
            await deletePlaylistSong(socket, args);
        }
    );
});

io.listen(3001);
