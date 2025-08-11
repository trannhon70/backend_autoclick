import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { RoleModule } from './role/role.module';
import { Role } from './role/entities/role.entity';
import { ProxyModule } from './proxy/proxy.module';
import { ChatService } from './chat/chat.service';
import { RedisModule } from './redis/redis.module';
import { CustomJwtModule } from './common/auth/auth.module';

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
        entities: [User, Role],
        synchronize: configService.get('APP_ENV') === 'development',

      }),
      inject: [ConfigService]
    }),
    RedisModule,
    // SocketModule,
    CustomJwtModule,
    UserModule,
    RoleModule,
    ProxyModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
