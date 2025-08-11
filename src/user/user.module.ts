import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomJwtModule } from 'src/common/auth/auth.module';
import { AuthMiddleware } from 'src/common/middleware/auth.middleware';
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';
import { Role } from 'src/role/entities/role.entity';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
   imports:[
      TypeOrmModule.forFeature([Role, User]),
  ],
  controllers: [UserController],
  providers: [UserService],
})

export class UserModule implements NestModule {
  
  configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(AuthMiddleware, LoggerMiddleware) 
        .forRoutes( 
         //  { path: 'user/create', method: RequestMethod.POST },
          
      ); 
  }
}
