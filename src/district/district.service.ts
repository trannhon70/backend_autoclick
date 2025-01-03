import { Injectable } from '@nestjs/common';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { District } from './entities/district.entity';
import { Repository } from 'typeorm';
import { City } from 'src/city/entities/city.entity';
import { JwtService } from '@nestjs/jwt';
import { currentTimestamp } from 'utils/currentTimestamp';

@Injectable()
export class DistrictService {
  constructor(
    @InjectRepository(District)
    private readonly districtRepository: Repository<District>,
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
    private readonly jwtService: JwtService
  ) { }
  async create(req: any, body: any) {
    try {
      const cities = await this.cityRepository.find();
  
      // Sử dụng Promise.all để đợi tất cả các lời gọi API
      const results = await Promise.all(
        cities.map(async (item: any) => {
          const response = await fetch(`https://esgoo.net/api-tinhthanh/2/${item.id_code}.htm`);
          if (!response.ok) {
            throw new Error(`Failed to fetch data for city: ${item.id_code}`);
          }
  // đá
          const data = await response.json(); 
          const result = data.data;
          if (Array.isArray(result)) {
            const districts : any = result.map((district: any) => {
              return {
                cityId: item.id,
                name: district.name,
                id_code: district.id,
                name_en: district.name_en,
                full_name: district.full_name,
                full_name_en: district.full_name_en,
                latitude: district.latitude,
                longitude: district.longitude,
                created_at: currentTimestamp(),
              };
            });
      
            // Lưu mảng các quận/huyện vào cơ sở dữ liệu
            return await this.districtRepository.save(districts);
          } else {
            console.error('Result is not an array or is null:', result);
          }
        })
      );
  
      // Trả về kết quả sau khi hoàn tất
      return results;
    } catch (error) {
      console.error('Error fetching districts:', error);
      throw error; // Ném lỗi để hàm gọi biết được có lỗi xảy ra
    }
  }
  

  findAll() {
    return `This action returns all district`;
  }

  findOne(id: number) {
    return `This action returns a #${id} district`;
  }

  update(id: number, updateDistrictDto: UpdateDistrictDto) {
    return `This action updates a #${id} district`;
  }

  remove(id: number) {
    return `This action removes a #${id} district`;
  }
}
