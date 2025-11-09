import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HistoryService } from './history.service';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) { }

  @Get('get-All')
  async getAll() {
    return await this.historyService.getAll();
  }


}
