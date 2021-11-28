import express from "express";
import cors from "cors";

import {
  guildRoute,
  guildDetailRoute,
  welcomeRoute,
  updateWelcomeRoute,
  queueRoute
} from "./routes";

const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (_, res) => {
  res.send({ message: "Hello World" });
});

app.use("/guild", guildRoute);
app.use("/guilddetail", guildDetailRoute);
app.use("/welcome", welcomeRoute);
app.use("/welcome/update", updateWelcomeRoute);
app.use('/queue', queueRoute)
app.listen(4000, () => {
  console.log("Serving on localhost:4000");
});
