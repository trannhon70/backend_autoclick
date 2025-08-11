import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { ProxyService } from './proxy.service';

@Controller('proxy')
export class ProxyController {
    constructor(
        private readonly proxyService: ProxyService
    ) { }

    @Post('play')
    async play(@Req() req: any, @Body() body: any) {
        return this.proxyService.play(req, body);
    }

    @Post('create')
    async create(@Req() req: any, @Body() body: any) {
        return this.proxyService.create(req, body);
    }

    @Put('update/:id')
    async update(@Req() req: any, @Body() body: any, @Param() param: any) {
        return this.proxyService.update(req, body, param);
    }

    @Get('get-by-id/:id')
    async getById(@Req() req: any, @Param() param: any) {
        return this.proxyService.getById(req, param);
    }

    @Delete('delete/:id')
    async delete(@Req() req: any, @Param() param: any) {
        return this.proxyService.delete(req, param);
    }

    @Get('get-paging')
    async getPaging(@Req() req: any, @Query() query: any) {
        return this.proxyService.getPaging(req, query);
    }


}