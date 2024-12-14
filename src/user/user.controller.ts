import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ClientIp } from 'common/checkIp';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Body() body: CreateUserDto) {
    const data = await this.userService.create(body);
    return {
      statusCode: 1,
      message: 'Tạo tài khoản thành công!',
      data: data
    };
  }

  @Post('login')
  async login(@Body() body: LoginUserDto,@ClientIp() ip: string) {
      const data = await this.userService.login(body,ip);
      return {
          statusCode: 1,
          message: 'Đăng nhập thành công!',
          token: data.token,
          user: data.user 
      };
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('get-by-id-user')
  async findOne(@Req() req: any) {
    const data = await this.userService.findOne(req);
    return {
      statusCode: 1,
      message: 'get by id user success!',
      data: data 
  };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
