import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Index({ unique: true })
    @Column()
    userId: string;

    @Column()
    wallet: string;

    @Column()
    bank: string;

    @Column()
    lastworked: string;


}
