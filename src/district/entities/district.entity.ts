import { City } from "src/city/entities/city.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: 'district' })

export class District {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    cityId:number;
    @ManyToOne(() => City, (city) => city.id)
    city: City;

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
