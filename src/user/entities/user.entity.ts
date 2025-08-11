import { Role } from "src/role/entities/role.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
//    ngày nhập công, tình trạng bảo hiểm xã hội
@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    //Chức vụ
    @Column({ nullable: true })
    roleId: number;
    @ManyToOne(() => Role, (role) => role.id)
    role: Role;

    //email
    @Column({ nullable: true })
    email: string

    //mật khẩu
    @Column({ nullable: true })
    password: string;

    //tên user
    @Column({ nullable: true })
    fullName: string;

    //ngày sinh
    @Column({ nullable: true })
    ngaySinh: string;

    //Số điện thoại
    @Column({ nullable: true })
    phone: string;

    // 0 là đã khóa, 1 chưa khóa
    @Column({ default: false })
    isDeleted: boolean;

    @Column({ default: false })
    online: boolean;

    @Column({ type: 'varchar', length: 255, nullable: true })
    avatar: string;

    //thời gian tạo
    @Column()
    created_at: number;
}
