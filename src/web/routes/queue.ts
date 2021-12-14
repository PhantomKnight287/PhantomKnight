import { GuildMember } from "discord.js";
import { Router } from "express";
import { client, player } from "../..";

const router = Router();
router.get("/:guildid", async (req, res) => {
    try {
        const isPlaying = player.getQueue(req.params.guildid);
        if (!isPlaying) {
            return res
                .status(200)
                .send({ message: "No Music is Currently Playing" });
        }
        try {
            const currentlyPlaying = player.getQueue(
                req.params.guildid
            ).current;
            const progressbar = player
                .getQueue(req.params.guildid)
                .createProgressBar();
            const queue = player.getQueue(req.params.guildid).tracks;
            // console.log(isPlaying.player);
            return res.status(200).send({
                message: {
                    currentlyPlaying,
                    queue,
                    progressbar,
                    paused: isPlaying.connection.paused,
                },
            });
        } catch (error) {
            console.log(error.message);
            return res.status(500).send({ message: "An error occured" });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({ message: "An Error Occured" });
    }
});
router.get("/:guildId/play", async (req, res) => {
    try {
        const queue = player.getQueue(req.params.guildId);
        if (!queue) {
            return res.status(200).send({ message: "No Music is Playing!" });
        } else {
            queue.setPaused(false);
            return res.status(200).send({ message: "Music Started" });
        }
    } catch (error) {
        return res.status(500).send({ message: "An Error Occured" });
    }
});
router.get("/:guildId/pause", async (req, res) => {
    try {
        const queue = player.getQueue(req.params.guildId);
        if (!queue) {
            return res.status(200).send({ message: "No Music is Playing!" });
        } else {
            queue.setPaused(true);
            return res.status(200).send({ message: "Music Stopped" });
        }
    } catch (error) {
        return res.status(500).send({ message: "An Error Occured" });
    }
});

router.get("/:guildId/next", async (req, res) => {
    try {
        const queue = player.getQueue(req.params.guildId);
        if (!queue) {
            return res.status(200).send({ message: "No Music is Playing!" });
        } else {
            queue.skip();
            return res.status(200).send({ message: "Skipped the Song" });
        }
    } catch (error) {
        return res.status(500).send({ message: "An Error Occured" });
    }
});
router.get("/:guildId/prev", async (req, res) => {
    try {
        const queue = player.getQueue(req.params.guildId);
        if (!queue) {
            return res.status(200).send({ message: "No Music is Playing!" });
        } else {
            queue.back();
            return res.status(200).send({ message: "Playing Previous Song" });
        }
    } catch (error) {
        return res.status(500).send({ message: "An Error Occured" });
    }
});

router.post("/:guildId/search", async (req, res) => {
    try {
        const user = await client.users.cache.get(req.body.userId);
        const tracks = await player
            .search(req.body.query, {
                requestedBy: user,
            })
            .then((response) => {
                return response.tracks;
            })
            .catch((error) => {
                return error.message;
            });
        return res.status(200).send({ message: tracks });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({ message: "An Error Occured" });
    }
});

router.post("/:guildId/user", async (req, res) => {
    try {
        const users = client.guilds.cache.get(req.params.guildId).members.cache;

        const channelId = users.map((user: GuildMember) => {
            if (user.id == req.body.userId) {
                return user.voice.channelId;
            } else if (user.id == process.env.clientId) {
                return user.voice.channelId;
            }
        });
        console.log(channelId[0]);
        return res
            .status(200)
            .send({
                message: { inVc: channelId[0] == channelId[1] ? true : false },
            });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({ message: "An Error Occured" });
    }
});
export { router };
