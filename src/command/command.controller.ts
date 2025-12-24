import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommandService } from './command.service';
import { CommandServiceV1 } from './commandV1.service';

@Controller('command')
export class CommandController {
  constructor(
    private readonly commandService: CommandService,
    private readonly commandServiceV1: CommandServiceV1,
  ) { }

  @Post('run')
  async run(@Body() body: any) {
    return this.commandService.run(body);
  }

  @Post('stop')
  async stop() {
    return this.commandService.stop();
  }

   @Post('run-v1')
  async runV1(@Body() body: any) {
    return this.commandServiceV1.runV1(body);
  }
}
