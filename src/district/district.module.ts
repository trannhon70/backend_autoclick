import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { DistrictService } from './district.service';
import { DistrictController } from './district.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { City } from 'src/city/entities/city.entity';
import { District } from './entities/district.entity';
import { CustomJwtModule } from 'common/auth/auth.module';
import { AuthMiddleware } from 'common/middleware/auth.middleware';
import { LoggerMiddleware } from 'common/middleware/logger.middleware';
import { RedisModule } from 'src/redis/redis.module';

@Module({

 imports:[
    TypeOrmModule.forFeature([User,City, District ]),
    CustomJwtModule,
    RedisModule
],  controllers: [DistrictController],
  providers: [DistrictService],
})
// export class DistrictModule {}

export class DistrictModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(AuthMiddleware, LoggerMiddleware) 
        .forRoutes( 
          { path: 'district/create', method: RequestMethod.POST },
          
      ); 
  }
}
