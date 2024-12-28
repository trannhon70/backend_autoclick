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
    const cities = await this.cityRepository.findOne({
      where: { id: ''},
    });

    const response = await fetch(`https://esgoo.net/api-tinhthanh/2/${cities.id_code}.htm`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    const result = data.data;
    console.log(result)

    // Kiểm tra nếu result không phải là null hoặc undefined và là một mảng
    if (Array.isArray(result)) {
      const districts : any = result.map((district: any) => {
        return {
          cityId: cities.id,
          name: district.name,
          name_en: district.name_en,
          full_name: district.full_name,
          full_name_en: district.full_name_en,
          latitude: district.latitude,
          longitude: district.longitude,
          created_at: currentTimestamp(),
        };
      });

      console.log(districts);

      // Lưu mảng các quận/huyện vào cơ sở dữ liệu
      return await this.districtRepository.save(districts);
    } else {
      console.error('Result is not an array or is null:', result);
    }
  } catch (error) {
    console.error('Error fetching districts:', error);
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
