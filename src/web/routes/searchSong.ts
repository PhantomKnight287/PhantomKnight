import { Router } from "express";
import { prisma } from "../../prisma";
const usetube = require("usetube");

const router = Router();
router.post("/search", async (req, res) => {
    const { song } = req.body;
    const { videos: songs } = await usetube.searchVideo(song);
    res.status(200).send({ songs });
});

router.post("/add/:id", async (req, res) => {
    const { song } = req.body;
    const songs = await prisma.playlists.findFirst({
        where: {
            userId: req.params.id,
        },
    });
    if (!songs) {
        await prisma.playlists.create({
            data: {
                userId: req.params.id,
                playList: [song],
            },
        });
        return res.status(200).send({
            message: `Added ${song.title} to Your Playlist`,
        });
    }
    if (!songs.playList || !songs.playList.length) {
        await prisma.playlists.update({
            where: {
                userId: req.params.id,
            },
            data: {
                playList: [song],
            },
        });
        return res.status(200).send({
            message: `Added ${song.title} to Your Playlist`,
        });
    }
    if (songs.playList) {
        songs.playList.push(song);
        await prisma.playlists.update({
            where: {
                userId: req.params.id,
            },
            data: {
                playList: songs.playList,
            },
        });
        return res.status(200).send({
            message: `Added ${song.title} to Your Playlist`,
        });
    }
});

export { router as searchSongRoute };
