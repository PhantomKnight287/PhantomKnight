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

router.post("/enable/:id", async (req, res) => {
    const guildConfig = await prisma.automods.findFirst({
        where: {
            guildId: req.params.id,
        },
    });
    if (!guildConfig) {
        await prisma.automods.create({
            data: {
                enabled: true,
                guildId: req.params.id,
            },
        });
        return res
            .status(200)
            .send({ message: "Automod is now enabled for your server!" });
    } else {
        await prisma.automods.update({
            where: {
                guildId: req.params.id,
            },
            data: {
                enabled: true,
            },
        });
        return res.status(200).send({
            message: "Automod is now enabled for your server!",
        });
    }
});

router.post("/disable/:id", async (req, res) => {
    const guildConfig = await prisma.automods.findFirst({
        where: {
            guildId: req.params.id,
        },
    });
    if (!guildConfig) {
        await prisma.automods.create({
            data: {
                enabled: false,
                guildId: req.params.id,
            },
        });
        return res
            .status(200)
            .send({ message: "Automod is now disabled for your server!" });
    } else {
        await prisma.automods.update({
            where: {
                guildId: req.params.id,
            },
            data: {
                enabled: false,
            },
        });
        return res.status(200).send({
            message: "Automod is now disabled for your server!",
        });
    }
});

router.post("/words/update/:id", async (req, res) => {
    const guildConfig = await prisma.automods.findFirst({
        where: {
            guildId: req.params.id,
        },
    });
    if (guildConfig && guildConfig.words == req.body.words) {
        return res.status(200).send({ message: "" });
    }
    if (!guildConfig) {
        await prisma.automods.create({
            data: {
                enabled: true,
                guildId: req.params.id,
                words: req.body.words,
            },
        });
        return res
            .status(200)
            .send({ message: "Successfully Updated Automod Config!" });
    } else {
        await prisma.automods.update({
            where: {
                guildId: req.params.id,
            },
            data: {
                words: req.body.words,
            },
        });
        return res
            .status(200)
            .send({ message: "Successfully Updated Automod Config!" });
    }
});

export { router as autoModRoutes };
