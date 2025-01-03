import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/role/entities/role.entity';
import { User } from './entities/user.entity';
import { CustomJwtModule } from 'common/auth/auth.module';
import { AuthMiddleware } from 'common/middleware/auth.middleware';
import { LoggerMiddleware } from 'common/middleware/logger.middleware';
import { RedisModule } from 'src/redis/redis.module';

@Module({
   imports:[
      TypeOrmModule.forFeature([Role, User]),
      CustomJwtModule,
      RedisModule
  ],
  controllers: [UserController],
  providers: [UserService],
})

export class UserModule implements NestModule {
  
  configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(AuthMiddleware, LoggerMiddleware) 
        .forRoutes( 
          { path: 'user/get-by-id-user', method: RequestMethod.GET },
          
      ); 
  }
}
