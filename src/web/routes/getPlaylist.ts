import { Router } from "express";
import { prisma } from "../../prisma";
const router = Router();
router.get("/playlist/:id", async (req, res) => {
    const playlist = await prisma.playlists.findFirst({
        where: { userId: req.params.id },
    });
    if (playlist && playlist.playList.length > 0) {
        return res.status(200).send({ songs: playlist.playList, message: null });
    } else {
        return res.status(200).send({
            songs: null,
            message: "You've not added any songs to your playlist yet!",
        });
    }
});
export { router as getPlaylistRoute };
