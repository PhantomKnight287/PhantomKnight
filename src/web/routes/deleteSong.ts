import { Router } from "express";
import { prisma } from "../../prisma";
const router = Router();
router.post("/playlist/:id", async (req, res) => {
    try {
        const playlist = await prisma.playlists.findFirst({
            where: { userId: req.params.id },
        });
        playlist.playList.map(
            (song: { title: string; thumbnail: string }, index) => {
                if (song.title == req.body.song.title) {
                    playlist.playList.splice(index, 1);
                }
            }
        );

        await prisma.playlists.update({
            where: {
                userId: req.params.id,
            },
            data: {
                playList: playlist.playList,
            },
        });
        return res.status(200).send({
            songs: playlist.playList,
            message: "",
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            message: "Something went wrong",
        });
    }
});
export { router as deletePlaylistSongRoute };
