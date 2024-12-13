import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { currentTimestamp } from 'utils/currentTimestamp';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) 
    private readonly roleRepository: Repository<Role>,
){}

 async create(body: CreateRoleDto) {
    const check = await this.roleRepository.findOne({ where: { name: body.name } });
    if (check) {
        throw new BadRequestException('Tên quyền đã được đăng ký, vui lòng đăng ký tên khác!');
    }
    const data  = {
        name: body.name,
        created_at: currentTimestamp()
    }
    const todo = this.roleRepository.create(data);
    return await this.roleRepository.save(todo)
  }

  findAll() {
    return `This action returns all role`;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
