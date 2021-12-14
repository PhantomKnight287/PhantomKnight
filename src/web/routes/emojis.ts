import { prisma } from "../../prisma";
import { Router } from "express";

const router = Router();

router.get("/", async (_, res) => {
    const emojis = await prisma.emojis.findMany({});
    res.status(200).send(emojis);
});

export { router };
