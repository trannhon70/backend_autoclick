import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommandService } from './command.service';

@Controller('command')
export class CommandController {
  constructor(private readonly commandService: CommandService) { }

  @Post('run')
  async run(@Body() body: any) {
    return this.commandService.run(body);
  }
}
