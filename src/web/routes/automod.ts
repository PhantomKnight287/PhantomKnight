import { prisma } from "../../prisma";
import { Router } from "express";

const router = Router();

router.get("/words/:id", async (req, res) => {
    const words = await prisma.automods.findFirst({
        where: {
            guildId: req.params.id,
        },
    });
    if (words) {
        res.status(200).send({ config: words });
    } else {
        res.status(200).send({
            message: "Automod is not enabled for your server",
        });
    }
});

export { router as autoModRoutes };
