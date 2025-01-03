import { Injectable } from '@nestjs/common';
import { CreateWardDto } from './dto/create-ward.dto';
import { UpdateWardDto } from './dto/update-ward.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { District } from 'src/district/entities/district.entity';
import { Repository } from 'typeorm';
import { currentTimestamp } from 'utils/currentTimestamp';
import { Ward } from './entities/ward.entity';

@Injectable()
export class WardService {
  constructor(
      @InjectRepository(District)
      private readonly districtRepository: Repository<District>,
      @InjectRepository(Ward)
      private readonly WardRepository: Repository<District>,
      
    ) { }
    async create(req: any, body: any) {
      try {
        const district = await this.districtRepository.find();
    
        const batchSize = 10;  // Số lượng request tối đa mỗi lần
        const results = [];
    
        for (let i = 0; i < district.length; i += batchSize) {
          const batch = district.slice(i, i + batchSize);  // Chia thành từng nhóm
          const batchResults = await Promise.all(
            batch.map(async (item: any) => {
              try {
                const response = await fetch(`https://esgoo.net/api-tinhthanh/3/${item.id_code}.htm`);
                if (!response.ok) {
                  console.error(`Failed to fetch data for district ${item.id_code}: ${response.status}`);
                  return null;
                }
                const data = await response.json();
                const result = data.data;
    
                if (Array.isArray(result)) {
                  const wards: any = result.map((ward: any) => ({
                    districtId: item.id,
                    name: ward.name,
                    id_code: ward.id,
                    name_en: ward.name_en,
                    full_name: ward.full_name,
                    full_name_en: ward.full_name_en,
                    latitude: ward.latitude,
                    longitude: ward.longitude,
                    created_at: currentTimestamp(),
                  }));
                  await this.WardRepository.save(wards);
                  return wards;
                } else {
                  console.error(`Unexpected data format for district ${item.id_code}`);
                  return null;
                }
              } catch (error) {
                console.error(`Error processing district ${item.id_code}: ${error.message}`);
                return null;
              }
            })
          );
          results.push(...batchResults);  // Lưu kết quả vào mảng chung
        }
    
        return results.filter((result) => result !== null);  // Lọc bỏ các giá trị null
      } catch (error) {
        console.error('Error fetching districts:', error.message);
        throw error;
      }
    }
    

  findAll() {
    return `This action returns all ward`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ward`;
  }

  update(id: number, updateWardDto: UpdateWardDto) {
    return `This action updates a #${id} ward`;
  }

  remove(id: number) {
    return `This action removes a #${id} ward`;
  }
}
