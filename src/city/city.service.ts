import { Injectable } from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from './entities/city.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { currentTimestamp } from 'utils/currentTimestamp';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
   
    private readonly jwtService: JwtService
) { }
  async create(req: any, body: any) {
    try {
        const response = await fetch('https://esgoo.net/api-tinhthanh/1/0.htm');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const result = data.data
        const cities = result.map((city: any) => {
            return {
              id_code: Number(city.id),
              name: city.name,
              name_en: city.name_en,
              full_name: city.full_name,
              full_name_en: city.full_name_en,
              latitude: city.latitude,
              longitude: city.longitude,
              created_at: currentTimestamp(), 
            };
          });
      
          // Sử dụng cityRepository để lưu tất cả các bản ghi
          const savedCities = await this.cityRepository.save(cities); // Lưu mảng các thành phố
          return savedCities;
        
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
}

  findAll() {
    return `This action returns all city`;
  }

  findOne(id: number) {
    return `This action returns a #${id} city`;
  }

  update(id: number, updateCityDto: UpdateCityDto) {
    return `This action updates a #${id} city`;
  }

  remove(id: number) {
    return `This action removes a #${id} city`;
  }
}
