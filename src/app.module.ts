import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
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
import { Repository } from 'typeorm';
import { currentTimestamp } from './utils';
import * as bcrypt from 'bcryptjs';
let saltOrRounds = 10;
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
     TypeOrmModule.forFeature([Role, User]),
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
// export class AppModule { }
export class AppModule implements OnModuleInit {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) { }

  async onModuleInit() {
    // Seed roles
    const roles = ['admin', 'student', 'teacher'];
    const roleEntities: Record<string, Role> = {};

    for (const roleName of roles) {
      let role = await this.roleRepo.findOne({ where: { name: roleName } });
      if (!role) {
        role = this.roleRepo.create({
          name: roleName,
          created_at: currentTimestamp(), // hoặc currentTimestamp()
        });
        role = await this.roleRepo.save(role);
      }
      roleEntities[roleName] = role;
    }

    // Seed admin account
    let adminUser = await this.userRepo.findOne({ where: { email: 'admin@gmail.com' } });
    if (!adminUser) {
      const password = await bcrypt.hash('123123@', saltOrRounds);
      adminUser = this.userRepo.create({
        email: 'admin@gmail.com',
        password,
        role: roleEntities['admin'],
        created_at: currentTimestamp(),
      });
      await this.userRepo.save(adminUser);
    }

    console.log('✅ Default roles & users ready!');
  }

}