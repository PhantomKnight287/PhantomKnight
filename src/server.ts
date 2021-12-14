import express from "express";
import http from "http";
import { Server } from "socket.io";
import { guild } from "./web/events";
import { client } from ".";
client;
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("token", async (args) => {
        await guild(socket, args);
    });
});

server.listen(4000, () => {
    console.log("listening on *:4000");
});
