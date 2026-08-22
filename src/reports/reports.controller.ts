import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  async findAll() {
    return this.reportsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req: any, @Body() body: any) {
    return this.reportsService.create(body, req.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/verify')
  async verify(@Request() req: any, @Param('id') id: string, @Body('approve') approve: boolean) {
    return this.reportsService.verifyReport(id, approve, req.user._id);
  }
}
