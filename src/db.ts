import { createConnection } from "typeorm";
import { User } from "./entities";
require("dotenv").config();
async function Connect() {
    const connection = await createConnection({
        type: "mysql",
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        ssl: true,
        entities: [User],
        synchronize: true,
    });
    console.log("Connected To PlanetScaleDB");
    return connection;
}
export { Connect };
