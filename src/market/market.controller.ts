import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { MarketService } from './market.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get()
  async findAll() {
    return this.marketService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req: any, @Body() body: any) {
    return this.marketService.create(body, req.user._id);
  }
}
