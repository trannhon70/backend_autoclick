import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { User } from 'src/user/entities/user.entity';
import { Role } from './entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from 'src/common/middleware/auth.middleware';
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';
import { CustomJwtModule } from 'src/common/auth/auth.module';
import { roleMiddleware } from 'src/common/middleware/role.middleware';
import { CHECK_ROLE } from 'utils/currentTimestamp';

@Module({
  imports:[
    TypeOrmModule.forFeature([Role, User]),
],
  controllers: [RoleController],
  providers: [RoleService],
})
// export class RoleModule {}
export class RoleModule implements NestModule {
  
  configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(AuthMiddleware, LoggerMiddleware,roleMiddleware([CHECK_ROLE.ADMIN]) ) 
        .forRoutes( 
          { path: 'role/create', method: RequestMethod.POST },
      ); 
  }
}