import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { User } from 'src/user/entities/user.entity';
import { Role } from './entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from 'common/middleware/auth.middleware';
import { LoggerMiddleware } from 'common/middleware/logger.middleware';
import { CustomJwtModule } from 'common/auth/auth.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Role, User]),
    CustomJwtModule,
    RedisModule
],
  controllers: [RoleController],
  providers: [RoleService],
})
// export class RoleModule {}
export class RoleModule implements NestModule {
  
  configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(AuthMiddleware, LoggerMiddleware) 
        .forRoutes( 
          { path: 'role/create', method: RequestMethod.POST },
          
      ); 
  }
}