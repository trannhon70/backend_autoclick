import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommandService } from './command.service';
import { CreateCommandDto } from './dto/create-command.dto';
import { UpdateCommandDto } from './dto/update-command.dto';

@Controller('command')
export class CommandController {
  constructor(private readonly commandService: CommandService) { }

  @Post('run')
  async run(@Body() body: any) {
    return this.commandService.run(body);
  }
}
