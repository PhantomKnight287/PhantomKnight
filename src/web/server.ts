import { Server } from "socket.io";
import { getPlaylists, queryCode, deletePlaylistSong } from "./socket";
import { client } from "..";
import express from "express";
import http from "http";
import { deletePlaylistSongRoute, getPlaylistRoute } from "./routes";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);

client; // reference to the client
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

app.get("/", async (_, res) => {
    return res.status(200).send({
        message: "Hello World",
    });
});
app.use("/", getPlaylistRoute);
app.use("/", deletePlaylistSongRoute);

io.on("connection", (socket) => {
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
server.listen(3001, () => {
    console.log("listening on *:3000");
});
