import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { IsEmail, IsIn, IsNotEmpty } from "class-validator";
import { Role } from "src/role/entities/role.entity";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @IsEmail()
    @Column()
    email: string;

    @Column()
    password: string;
 
    @IsNotEmpty()
    @Column({ nullable: true }) // Không bắt buộc
    fullName: string;

    @ManyToOne(() => Role, (role) => role.users, { eager: true })
    @JoinColumn({ name: 'roleId' })
    role: Role;

    @Column({ name: 'roleId', nullable: true })
    roleId: number;

    @Column()  
    created_at: number;

}
