import { Server } from "socket.io";
import { queryCode } from "./socket";
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
        async (args: { code: string; redirectUri: string }) => {
            await queryCode(socket, args);
        }
    );
});

io.listen(3001);
