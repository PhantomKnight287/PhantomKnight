import { Router } from "express";
import { client } from "../..";
import { version as DJSVersion } from "discord.js";
import { version as TsVersion } from "typescript";
const router = Router();

router.get("/stats", async (_, res) => {
    const stats = {};
    stats["Servers"] = client.guilds.cache.size;
    stats["Members"] = client.users.cache.size;
    stats["Ping"] = client.ws.ping;
    stats["DJS"] = DJSVersion;
    stats["Typescript"] = TsVersion;
    stats["Uptime"] = client.uptime;
    res.status(200).send({ stats });
});

export { router as statsRoute };
