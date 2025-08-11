import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ClientInfo } from 'src/common/checkIp';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Req() req:any, @Body() body: CreateUserDto) {
    return this.userService.create(req, body);
  }

  @Post('login')
  async login(@Body() body: any, @ClientInfo() ip: string) {
    const data = await this.userService.login(body, ip);
    
    return data;
  }

  @Get('get-by-id')
  async getById(@Req() req:any, @ClientInfo() ip: string) {
    const data = await this.userService.getById(req, ip);
   
    return data;
  }
}
