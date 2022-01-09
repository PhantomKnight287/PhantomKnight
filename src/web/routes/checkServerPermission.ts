import { Permissions } from "discord.js";
import { Router } from "express";
import { client } from "../..";
const router = Router();
router.post("/permission/:id", async (req, res) => {
    if (!req.body.userId)
        return res
            .status(400)
            .send({ message: "Missing UserId in Body", showMessage: false });
    const guild = client.guilds.cache.get(req.params.id);
    if (!guild) {
        return res.status(404).send({
            message: "Server with this Id Doesn't exist",
            redirect: "/",
            showMessage: false,
        });
    }
    const user = guild.members.cache.get(req.body.userId);
    if (!user) {
        return res.status(404).send({
            message: "You're not in this server",
            redirect: "/servers",
            showMessage: true,
        });
    }
    if (user.permissions.has([Permissions.FLAGS.MANAGE_GUILD])) {
        return res.status(200).send({
            message: null,
            redirect: `/servers/${req.params.id}`,
            showMessage: false,
        });
    }
});

export { router as checkServerPermissionRoute };
