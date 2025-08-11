import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'proxy' })
export class Proxy {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    host: string

    @Column({ nullable: true })
    port: string

    @Column({ nullable: true })
    user_proxy: string

    @Column({ nullable: true })
    pass_proxy: string

    // Thêm cột userId làm khóa ngoại
    @Column({ nullable: true })
    userId: number;

    @ManyToOne(() => User, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'userId' })
    user: User;

    //thời gian tạo
    @Column()
    created_at: number;
}
