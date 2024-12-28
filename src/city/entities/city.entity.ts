import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'city' })
export class City {
    @PrimaryGeneratedColumn("uuid")
    id: string; 

    @Column()
    id_code:number; 

    @Column()
    name: string;

    @Column()
    name_en: string;

    @Column()
    full_name: string;

    @Column()
    full_name_en: string;

    @Column()
    latitude: string;

    @Column()
    longitude: string;


    @Column()
    created_at: string;
}
