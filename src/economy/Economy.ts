import { Knex } from "knex";
import { Connect } from "../db";

export class Economy {
    userId: string;
    connection: Knex;
    constructor(userId?: string) {
        Connect().then((con) => {
            this.connection = con;
        });
        this.userId = userId;
    }
    async connectToDb() {
        await Connect().then((con) => {
            this.connection = con;
        });
    }
    async createAccount() {
        if (!this.connection) await this.connectToDb();
        const user = await this.connection.raw(
            `INSERT INTO user (userId,bank,lastworked,wallet) VALUES ('${
                this.userId
            }','2000','${new Date().getTime() - 3600000}','2000')`
        );
        return user;
    }
    async isAccountPresent() {
        if (!this.connection) await this.connectToDb();
        const user = await this.connection.raw(
            `SELECT * FROM user WHERE userId='${this.userId}'`
        );
        return user;
    }
    async setAmountInWallet(money: string) {
        if (!this.connection) await this.connectToDb();
        await this.connection.raw(
            `UPDATE user SET wallet='${money}' WHERE userId='${this.userId}'`
        );
    }
    async setAmountInBank(money: string) {
        if (!this.connection) await this.connectToDb();
        await this.connection.raw(
            `UPDATE user SET bank='${money}' WHERE userId='${this.userId}'`
        );
    }
    async getBalance() {
        if (!this.connection) await this.connectToDb();
        const user = await this.connection.raw(
            `SELECT * FROM user WHERE userId='${this.userId}'`
        );
        return user;
    }
}
