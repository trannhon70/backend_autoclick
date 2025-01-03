import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { WardService } from './ward.service';
import { CreateWardDto } from './dto/create-ward.dto';
import { UpdateWardDto } from './dto/update-ward.dto';

@Controller('ward')
export class WardController {
  constructor(private readonly wardService: WardService) {}

    @Post('create')
      async create(@Req() req: any, @Body() body: any) {
  
          const data = await this.wardService.create(req, body);
          return {
              statusCode: 1,
              message: 'create ward suscess!',
              data: data,
          };
      }
  @Get()
  findAll() {
    return this.wardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wardService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWardDto: UpdateWardDto) {
    return this.wardService.update(+id, updateWardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wardService.remove(+id);
  }
}
