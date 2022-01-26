import { prisma } from "../../prisma";
import { Router } from "express";

const router = Router();

router.get("/welcome/:id", async (req, res) => {
    const welcomeConfig = await prisma.welcomers.findFirst({
        where: {
            guildId: req.params.id,
        },
    });
    if (!welcomeConfig) {
        return res.status(200).send({
            message: "Welcome Message is not enabled for your server",
            enabled: false,
        });
    }
    return res
        .status(200)
        .send({ enabled: welcomeConfig.enabled, config: welcomeConfig });
});

router.post("/welcome/disable/:id", async (req, res) => {
    await prisma.welcomers.update({
        where: {
            guildId: req.params.id,
        },
        data: {
            enabled: false,
        },
    });
    return res
        .status(200)
        .send({ message: "Welcome Message is Disabled For Your Server." });
});

router.post("/welcome/enable/:id", async (req, res) => {
    await prisma.welcomers.update({
        where: {
            guildId: req.params.id,
        },
        data: {
            enabled: true,
        },
    });
    return res
        .status(200)
        .send({ message: "Welcome Message is Enabled For Your Server." });
});

router.post("/welcome/update/:id", async (req, res) => {
    await prisma.welcomers.update({
        where: {
            guildId: req.params.id,
        },
        data: {
            channelId: req.body.channelId,
            enabled: req.body.enabled,
            welcomerMessage: req.body.message,
        },
    });
    return res
        .status(200)
        .send({ message: "Updated Welcome Message For Your Server." });
});

export { router as welcomeMessageRoute };
