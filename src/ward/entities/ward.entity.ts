import { City } from "src/city/entities/city.entity";
import { District } from "src/district/entities/district.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: 'ward' })

export class Ward {
    @PrimaryGeneratedColumn("uuid")
        id: string;
    
        @Column()
        id_code:string; 
    
        @Column()
        districtId:number;
        @ManyToOne(() => District, (district) => district.id)
        district: District;
    
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
        created_at: number;
}
