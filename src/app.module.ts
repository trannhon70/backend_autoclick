import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { RoleModule } from './role/role.module';
import { Role } from './role/entities/role.entity';
import { CityModule } from './city/city.module';
import { City } from './city/entities/city.entity';
import { DistrictModule } from './district/district.module';
import { District } from './district/entities/district.entity';
import { WardModule } from './ward/ward.module';
import { Ward } from './ward/entities/ward.entity';

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
        entities: [User, Role, City, District, Ward],
        synchronize: configService.get('APP_ENV') === 'development',
        
      }),
      inject: [ConfigService]
    }),
    UserModule,
    RoleModule,
    CityModule,
    DistrictModule,
    WardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
