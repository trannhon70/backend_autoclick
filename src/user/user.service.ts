import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { extractUserFromRequest } from 'src/common/helpers/jwt-helper';
import { RedisService } from 'src/redis/redis.service';
import { Role } from 'src/role/entities/role.entity';
import { currentTimestamp, expirationTime } from 'src/utils';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

let saltOrRounds = 10;
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    private readonly jwtService: JwtService, // Inject JwtService
    private readonly redisService: RedisService,
  ) { }

  async create(req: any, body: CreateUserDto) {
    try {
      const check = await this.userRepository.findOne({ where: { email: body.email } });
      if (check) {
        throw new BadRequestException('Email đã được đăng ký, vui lòng đăng ký mail khác!');
      }

      const hashPassword = await bcrypt.hash(body.password, saltOrRounds)
      const data: any = {
        roleId: body.roleId || '',
        email: body.email || '',
        password: hashPassword || '',
        fullName: body.fullName || '',
        ngaySinh: body.ngaySinh || '',
        phone: body.phone || '',
        created_at: currentTimestamp(),
      }

      const todo = this.userRepository.create(data);
      return await this.userRepository.save(todo)
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  async login(body: any, ip: string) {

    const user = await this.userRepository.findOne({
      where: {
        email: body.email
      },
      relations: ['role'], // Liên kết với bảng Roles
    });

    if (!user) {
      throw new BadRequestException('Email không tồn tại!');
    }
    if (user.isDeleted === true) {
      throw new BadRequestException('Tài khoản này đã bị xóa!');
    }

    const isMatch = await bcrypt.compare(String(body.password), String(user.password));

    if (!isMatch) {
      throw new BadRequestException('Password không đúng');
    }

    // Kiểm tra Redis xem có phiên đăng nhập nào chưa
    const currentSession = await this.redisService.getKey(`user:${user.id}:session`);

    if (currentSession) {
      // Hủy token cũ
      await this.redisService.delKey(`user:${user.id}:session`);
    }
    const payload = {
      email: user.email,
      id: user.id,
      fullName: user.fullName,
      role: user.role,
    };

    const sessionToken = this.jwtService.sign(payload);

    // Lưu token mới vào Redis với thời gian hết hạn

    const sessionData = {
      token: sessionToken,
      expiresAt: Date.now() + expirationTime,
    };

    await this.redisService.setKey(`user:${user.id}:session`, JSON.stringify(sessionData), Math.floor(expirationTime / 1000));

    // ✅ Cập nhật trạng thái online
    user.online = true;
    await this.userRepository.save(user);

    return {
      token: sessionToken,
      user: {
        email: user.email,
        id: user.id,
        fullName: user.fullName,
        created_at: user.created_at,
        role: user.role,
        online: user.online,
        avatar: user.avatar,
      },
      startTime: currentTimestamp(),
      endTime: currentTimestamp() + Math.floor(expirationTime / 1000)
    }
  }

  async getById(req: any, ip: any) {
    try {
      const { userId } = await extractUserFromRequest(req, this.jwtService);

      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['role'],
      });
      if (user) {
        delete user.password;  // loại bỏ trường password
      }
      return user;
    } catch (error) {
      console.log(error); 
      throw error
    }
  }
}
