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

    //số điện thoại
    @Column()
    phone: string;

    //ngày sinh
    @Column()
    date: number;
    
    //họ và tên
    @IsNotEmpty()
    @Column({ nullable: true }) // Không bắt buộc
    fullName: string;

    //tỉnh/TP
    @Column() // Không bắt buộc
    city: number;

    //quận/huyện
    @Column() // Không bắt buộc
    district: number;

    //phường/xã
    @Column() // Không bắt buộc
    ward: number;

    //Số nhà, tên đường
    @Column() // Không bắt buộc
    address: string;

    // phân quyên
    @ManyToOne(() => Role, (role) => role.users, { eager: true })
    @JoinColumn({ name: 'roleId' })
    role: Role;

    @Column({ name: 'roleId', nullable: true })
    roleId: number;

    //thời gian update
    @Column()  
    created_update: number;

    //thời gian tạo
    @Column()  
    created_at: number;

}
