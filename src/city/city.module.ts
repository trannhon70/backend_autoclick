import { Module } from '@nestjs/common';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { City } from './entities/city.entity';
import { CustomJwtModule } from 'common/auth/auth.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([User,City ]),
    CustomJwtModule,
],
  controllers: [CityController],
  providers: [CityService],
})
export class CityModule {}
