import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { City } from './entities/city.entity';
import { CustomJwtModule } from 'common/auth/auth.module';
import { AuthMiddleware } from 'common/middleware/auth.middleware';
import { LoggerMiddleware } from 'common/middleware/logger.middleware';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([User,City ]),
    CustomJwtModule,
    RedisModule
],
  controllers: [CityController],
  providers: [CityService],
})
// export class CityModule {}
export class CityModule implements NestModule {
  
  configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(AuthMiddleware, LoggerMiddleware) 
        .forRoutes( 
          { path: 'city/create', method: RequestMethod.POST },
          
      ); 
  }
}