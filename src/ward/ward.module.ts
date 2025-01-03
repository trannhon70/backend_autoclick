import { Module } from '@nestjs/common';
import { WardService } from './ward.service';
import { WardController } from './ward.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { District } from 'src/district/entities/district.entity';
import { Ward } from './entities/ward.entity';

@Module({
  imports:[
      TypeOrmModule.forFeature([ District , Ward]),
  ],
  controllers: [WardController],
  providers: [WardService],
})
export class WardModule {}
