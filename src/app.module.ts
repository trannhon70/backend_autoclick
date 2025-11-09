import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommandModule } from './command/command.module';
import { CustomJwtModule } from './common/auth/auth.module';
import { History } from './history/entities/history.entity';
import { HistoryModule } from './history/history.module';
import { Proxy } from './proxy/entities/proxy.entity';
import { ProxyModule } from './proxy/proxy.module';
import { RedisModule } from './redis/redis.module';
import { Role } from './role/entities/role.entity';
import { RoleModule } from './role/role.module';
import { SocketModule } from './socket/socket.module';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        database: configService.get('DB_DATABASE'),
        password: configService.get('DB_PASSWORD'),
        entities: [User, Role, Proxy, History],
        synchronize: configService.get('APP_ENV') === 'development',

      }),
      inject: [ConfigService]
    }),
    RedisModule,
    SocketModule,
    CustomJwtModule,
    UserModule,
    RoleModule,
    ProxyModule,
    CommandModule,
    SocketModule,
    HistoryModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
