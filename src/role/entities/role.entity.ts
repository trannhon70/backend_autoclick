import { User } from "src/user/entities/user.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'roles' })
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    created_at: number;

    @OneToMany(() => User, (user) => user.role)  // Đảm bảo rằng bạn tham chiếu đến trường 'role'
    users: User[];
}
