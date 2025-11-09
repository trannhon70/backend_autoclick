import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum StatusEnum {
    SUCCESS = 'success',
    ROBOT = 'robot',
    ERROR = 'error',
}

@Entity({ name: 'history' })
export class History {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: StatusEnum,
        default: StatusEnum.ERROR, // optional
    })
    status: StatusEnum;

    @Column()
    created_at: number;
}
