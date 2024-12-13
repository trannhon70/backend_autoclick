import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        database: configService.get('DB_DATABASE'),
        password: configService.get('DB_PASSWORD'),
        entities: [],
        synchronize: configService.get('APP_ENV') === 'development',
        
      }),
      inject: [ConfigService]
    }),
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'app_mysql',
    //   port: 3306,
    //   username: 'root',
    //   password: 'password',
    //   database: 'nestjs_app',
    //   entities: [],
    //   synchronize: true,
    // }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
