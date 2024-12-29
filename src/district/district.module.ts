import { Module } from '@nestjs/common';
import { DistrictService } from './district.service';
import { DistrictController } from './district.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { City } from 'src/city/entities/city.entity';
import { District } from './entities/district.entity';
import { CustomJwtModule } from 'common/auth/auth.module';

@Module({

 imports:[
    TypeOrmModule.forFeature([User,City, District ]),
    CustomJwtModule,
],  controllers: [DistrictController],
  providers: [DistrictService],
})
export class DistrictModule {}
