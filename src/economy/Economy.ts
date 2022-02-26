import { User } from "../entities";
import { Connection, getConnection } from "typeorm";
export class Economy {
    userId: string;
    connection: Connection;
    constructor(userId: string) {
        this.userId = userId;
    }
    async connectToDb() {
        this.connection = getConnection();
    }
    async createAccount() {
        if (!this.connection) await this.connectToDb();
        const user = await this.connection
            .createQueryBuilder()
            .insert()
            .into(User)
            .values([
                {
                    userId: this.userId,
                    bank: "2000",
                    lastworked: `${new Date().getTime() - 3600000}`,
                    wallet: "2000",
                },
            ])
            .execute();
        return user;
    }
    async isAccountPresent() {
        if (!this.connection) await this.connectToDb();

        const user = await this.connection
            .getRepository(User)
            .createQueryBuilder("user")
            .where("user.userId=:id", { id: this.userId })
            .getOne();
        return user;
    }
    async setAmountInWallet(money: string) {
        if (!this.connection) await this.connectToDb();

        await this.connection
            .createQueryBuilder()
            .update(User)
            .set({ wallet: money })
            .where("userId=:id", { id: this.userId })
            .execute();
    }
    async setAmountInBank(money: string) {
        if (!this.connection) await this.connectToDb();

        await this.connection
            .createQueryBuilder()
            .update(User)
            .set({ bank: money })
            .where("userId=:id", { id: this.userId })
            .execute();
    }
    async getBalance() {
        if (!this.connection) await this.connectToDb();

        const user = await this.connection
            .getRepository(User)
            .createQueryBuilder("user")
            .where("user.userId=:id", { id: this.userId })
            .getOne();
        return user;
    }
    
}
