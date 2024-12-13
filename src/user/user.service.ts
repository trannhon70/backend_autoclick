import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/role/entities/role.entity';
import * as bcrypt from 'bcryptjs';
import { currentTimestamp } from 'utils/currentTimestamp';

let saltOrRounds = 10; 

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
) { }
 async create(body: CreateUserDto) {
    const roleExists = await this.roleRepository.findOne({ where: { id: body.roleId } });
    const check = await this.userRepository.findOne({ where: { email: body.email } });
    if (check) {
        throw new BadRequestException('Email đã được đăng ký, vui lòng đăng ký mail khác!');
    }

    const hashPassword = await bcrypt.hash(body.password, saltOrRounds)

    const data: any = {
        role: roleExists || '',
        email: body.email || '',
        password: hashPassword || '',
        fullName: body.fullName || '',
        created_at: currentTimestamp(),
    }

    const todo = this.userRepository.create(data);
    return await this.userRepository.save(todo)
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
