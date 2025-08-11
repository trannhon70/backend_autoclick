import { Module, Global, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ProxyService } from './proxy.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Proxy } from './entities/proxy.entity';
import { AuthMiddleware } from 'src/common/middleware/auth.middleware';
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';
import { roleMiddleware } from 'src/common/middleware/role.middleware';
import { CHECK_ROLE } from 'utils/currentTimestamp';
import { ProxyController } from './proxy.controller';

@Global()
@Module({
   imports:[
        TypeOrmModule.forFeature([Proxy, User]),
    ],
    controllers: [ProxyController],
  providers: [ProxyService],
  exports: [ProxyService],
})
// export class ProxyModule {}

export class ProxyModule implements NestModule {
  
  configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(AuthMiddleware, LoggerMiddleware,roleMiddleware([CHECK_ROLE.ADMIN, CHECK_ROLE.USER]) ) 
        .forRoutes( 
          { path: 'proxy/play', method: RequestMethod.POST },
          { path: 'proxy/create', method: RequestMethod.POST },
          { path: 'proxy/update/:id', method: RequestMethod.PUT },
          { path: 'proxy/delete/:id', method: RequestMethod.DELETE },
      ); 
  }
}
