import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { WardService } from './ward.service';
import { WardController } from './ward.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { District } from 'src/district/entities/district.entity';
import { Ward } from './entities/ward.entity';
import { LoggerMiddleware } from 'common/middleware/logger.middleware';
import { AuthMiddleware } from 'common/middleware/auth.middleware';
import { RedisModule } from 'src/redis/redis.module';
import { CustomJwtModule } from 'common/auth/auth.module';

@Module({
  imports:[
      TypeOrmModule.forFeature([ District , Ward]),
      CustomJwtModule,
      RedisModule
  ],
  controllers: [WardController],
  providers: [WardService],
})
// export class WardModule {}
export class WardModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(AuthMiddleware, LoggerMiddleware) 
        .forRoutes( 
          { path: 'ward/create', method: RequestMethod.POST },
          
      ); 
  }
}