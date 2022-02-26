import knex from "knex";
require("dotenv").config();
export async function Connect() {
    const connection = knex({
        client: "mysql",
        connection: {
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            ssl:true
        },
    });
    await connection.raw(
        `CREATE TABLE IF NOT EXISTS user (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, userId VARCHAR(255) NOT NULL, bank VARCHAR(255) NOT NULL, wallet VARCHAR(255) NOT NULL, lastworked VARCHAR(255) NOT NULL)`
    );
    // create job table with id:number,jobName:string,min:string,max:string,description:string
    await connection.raw(
        `CREATE TABLE IF NOT EXISTS job (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, jobName VARCHAR(255) NOT NULL, min VARCHAR(255) NOT NULL, max VARCHAR(255) NOT NULL, description VARCHAR(255) NOT NULL)`
    );
    console.log("Connected to database");
    return connection;
}
